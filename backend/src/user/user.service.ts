import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
  Req,
  Request,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpUserDto } from './dto/signup-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { comparePassword, encryptPassword } from 'src/common/utils/bcrypt';
import {
  generateOtp,
  removeJwtFromCookie,
  storingJwtOnCookie,
} from 'src/common/utils/helper';
import { AccountVerificationUserDto } from './dto/account-verification-user.dto';
import { ChangePasswordDto } from './dto/changepassword-user.dto';
import { NotFoundError } from 'rxjs';
import { UserDto } from './dto/user.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ResendOtpDto } from './dto/resend.otp.dto';
import { AccessTokenPayload } from 'src/auth/types/AccessTokenPayload';
import { AccessToken } from 'src/auth/types/AccessToken';
import { JwtService } from '@nestjs/jwt';
import { ForgetPasswordUserDto } from './dto/forgetpassword-user.dto.';
import { MailerService } from 'src/mailer/mailer.service';
@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async signup(signUpUserDto: SignUpUserDto, res: any): Promise<UserDto> {
    try {
      // check email exists
      const userExist = await this.prismaService.user.findUnique({
        where: {
          email: signUpUserDto.email,
        },
      });

      if (userExist) {
        throw new ConflictException('Email already exists');
      }

      const userCreated = await this.prismaService.user.create({
        data: {
          full_name: signUpUserDto.full_name,
          email: signUpUserDto.email,
          password: await encryptPassword(signUpUserDto.password),
        },
      });

      // generate OTP
      const otpCode = generateOtp();

      console.log(otpCode);

      await this.prismaService.user_Account_Verification.create({
        data: {
          code: await encryptPassword(otpCode.toString()),
          limit: 9,
          user_id: userCreated.id,
        },
      });

      // save account provider
      await this.prismaService.user_Account_Providers.create({
        data: {
          user_id: userCreated.id,
        },
      });

      const user = {
        id: userCreated.id,
        email: userCreated.email,
      };

      // TODO need to add token

      storingJwtOnCookie(user, res, this.jwtService);

      // Transform userCreated to UserDto
      const userDto = plainToClass(UserDto, {
        ...userCreated,
      });

      // TODO Otp send email

      const sendEmailDto = {
        recipients: {
          name: userDto.full_name,
          address: userDto.email,
        },
        subject: 'Account Verification',
        placeholderReplacement: {
          name: userDto.full_name,
          number: otpCode.toString(),
        },
      };

      this.mailerService.sendEmail(sendEmailDto);

      // console.log(email)

      return userDto;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async signin(user: any, res: any): Promise<UserDto> {
    try {
      storingJwtOnCookie(user, res, this.jwtService);

      // Transform userCreated to UserDto
      const userDto = plainToClass(UserDto, {
        ...user,
        message: 'Logged in successfully',
      });

      return userDto;
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(
    accountVerificationUserDto: AccountVerificationUserDto,
    res: any,
  ): Promise<UserDto> {
    try {
      //  get user by email
      const getUser = await this.prismaService.user.findUnique({
        where: {
          email: accountVerificationUserDto.email,
        },
      });

      // Not found then throwing Error

      if (!getUser) {
        throw new NotFoundException('Enter Valid Email');
      }

      // // fetching user Account Verification Otp

      const getVerification =
        await this.prismaService.user_Account_Verification.findUnique({
          where: {
            user_id: getUser.id,
          },
        });

      if (!getVerification) {
        throw new NotFoundException('Otp code not found');
      }

      const currentTime = new Date().getTime();
      const expiresAfterEvery3Mins =
        currentTime < getVerification.updatedAt.getTime() + 3 * 60 * 1000;

      if (!expiresAfterEvery3Mins) {
        throw new BadRequestException(
          'Your Otp has been expired. Try clicking on resend',
        );
      }

      const VerifyOtp = await comparePassword(
        accountVerificationUserDto.code,
        getVerification.code,
      );

      console.log(VerifyOtp);

      // matching Otp provided by the user with the code generated during sign up or forget password
      // not found then throwing exception

      if (!VerifyOtp) {
        throw new BadRequestException('Enter Valid Otp Code');
      }

      console.log(getVerification);

      // updating status of email_Verified

      const user = await this.prismaService.user.update({
        where: {
          id: getUser.id,
        },
        data: {
          email_verified: true,
          email_verifiedAt: new Date().toISOString(),
        },
      });

      // deleting User that has been Verified record

      await this.prismaService.user_Account_Verification.delete({
        where: {
          id: getVerification.id,
        },
      });

      const userInfo = {
        id: user.id,
        email: user.email,
      };

      storingJwtOnCookie(userInfo, res, this.jwtService);

      const userDto = plainToInstance(UserDto, {
        ...user,
      });

      console.log({ userDto });

      return userDto;
      // user.password
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async verifyOtpAfterForgetPassword(
    accountVerificationUserDto: AccountVerificationUserDto,
    //  res: any
  ) {
    try {
      //  get user by email
      const getUser = await this.prismaService.user.findUnique({
        where: {
          email: accountVerificationUserDto.email,
        },
      });

      // Not found then throwing Error

      if (!getUser) {
        throw new NotFoundException('Enter Valid Email');
      }

      const currentTime = new Date().getTime();

      // // fetching user Account Verification Otp

      const getVerification =
        await this.prismaService.user_Account_Verification.findUnique({
          where: {
            user_id: getUser.id,
          },
        });

      if (!getVerification) {
        throw new NotFoundException('Otp not found');
      }

      const expiresAfterEvery3Mins =
        currentTime < getVerification.updatedAt.getTime() + 3 * 60 * 1000;

      if (!expiresAfterEvery3Mins) {
        throw new BadRequestException(
          'Your Otp has been expired. Try clicking on resend',
        );
      }

      const VerifyOtp = await comparePassword(
        accountVerificationUserDto.code,
        getVerification.code,
      );

      console.log(VerifyOtp);

      // matching Otp provided by the user with the code generated during sign up or forget password
      // not found then throwing exception

      if (!VerifyOtp) {
        throw new BadRequestException('Enter Valid Otp Code');
      }

      // const userDto = plainToInstance(UserDto, getUser);

      return true;
      // user.password
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async resendOtp(ResendOtpDto: ResendOtpDto) {
    try {
      //  get user by email
      const getUser = await this.prismaService.user.findUnique({
        where: {
          email: ResendOtpDto.email,
        },
      });

      // Not found then throwing Error

      if (!getUser) {
        throw new NotFoundException('Enter Valid Email');
      }

      const userOtp =
        await this.prismaService.user_Account_Verification.findUnique({
          where: {
            user_id: getUser.id,
          },
        });

      if (!userOtp) {
        throw new NotFoundException('Otp not found');
      }
      // if user Otp not found on user_account_verification table then generate and create otp  TODO and send on email

      // TODO change  userOtpVerify name to getUser

      // checking time limit that has been set to prohibit user and after that specific time allowing user to send if limit

      const currentTime = new Date().getTime();
      let is2HoursPass =
        currentTime < userOtp.updatedAt.getTime() + 120 * 60 * 1000;
      let isDayPass = userOtp.updatedAt.getTime() + 1440 * 60 * 1000;

      let allow = true;
      if (
        (userOtp.limit === 6 && is2HoursPass) ||
        (userOtp.limit === 3 && isDayPass)
      ) {
        allow = false;
      }

      if (userOtp.limit === 0) {
        return { message: 'you have beeen blocked please contact our support' };
      }

      const otpCode = generateOtp();

      console.log(otpCode);

      // update previous Otp

      const expiresAfterEvery3Mins =
        currentTime < userOtp.updatedAt.getTime() + 3 * 60 * 1000;

      if (allow && !expiresAfterEvery3Mins) {
        await this.prismaService.user_Account_Verification.update({
          where: {
            user_id: getUser.id,
          },
          data: {
            limit: --userOtp.limit,
            code: await encryptPassword(otpCode.toString()),
          },
        });

        //TODO send Otp on email

        const sendEmailDto = {
          recipients: {
            name: getUser.full_name,
            address: getUser.email,
          },
          subject: 'Verify User Identity',
          placeholderReplacement: {
            name: getUser.full_name,
            number: otpCode.toString(),
          },
        };

        this.mailerService.sendEmail(sendEmailDto);
      }

      return userOtp;
    } catch (error) {
      throw error;
    }
  }

  async sendOtpOnForgetPassword(forgetPasswordUserDto: ForgetPasswordUserDto) {
    try {
      //  get user by email
      const getUser = await this.prismaService.user.findUnique({
        where: {
          email: forgetPasswordUserDto.email,
        },
      });

      // Not found then throwing Error

      if (!getUser) {
        throw new NotFoundException('User email not found');
      }

      const checkUserAlreadyExist =
        await this.prismaService.user_Account_Verification.findUnique({
          where: {
            user_id: getUser.id,
          },
        });

      console.log(checkUserAlreadyExist);

      if (checkUserAlreadyExist) {
        throw new ConflictException('Otp has been already send to this email');
      }

      // generate otp

      const otpCode = generateOtp();

      console.log(otpCode);

      // TODO encrypt the otp before
      await this.prismaService.user_Account_Verification.create({
        data: {
          code: await encryptPassword(otpCode.toString()),
          limit: 9,
          user_id: getUser.id,
        },
      });

      // TODO sent Otp on email

      const sendEmailDto = {
        recipients: {
          name: getUser.full_name,
          address: getUser.email,
        },
        subject: 'Verify User Identity',
        placeholderReplacement: {
          name: getUser.full_name,
          number: otpCode.toString(),
        },
      };

      this.mailerService.sendEmail(sendEmailDto);

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findUserByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    try {
      //  get user by email
      const getUser = await this.prismaService.user.findUnique({
        where: {
          email: changePasswordDto.email,
        },
        select: {
          email: true,
          id: true,
        },
      });

      // Not found then throwing Error

      if (!getUser) {
        throw new NotFoundException('Enter Valid Email');
      }

      // checking that user is present on otp table

      const userOtp =
        await this.prismaService.user_Account_Verification.findUnique({
          where: {
            user_id: getUser.id,
          },
        });

      // otp not found throwing exception

      if (!userOtp) {
        throw new NotFoundException('Otp not found ');
      }

      const verifyUserOtp = await comparePassword(
        changePasswordDto.code,
        userOtp.code,
      );

      // TODO compare with encryp

      // if not then throwing exception

      if (!verifyUserOtp) {
        throw new ConflictException('Enter Valid Otp');
      }

      // else  updating the pass

      // matches so update password

      await this.prismaService.user.update({
        where: {
          id: getUser.id,
        },
        data: {
          password: await encryptPassword(changePasswordDto.password),
        },
      });

      // now delete the Otp present

      await this.prismaService.user_Account_Verification.delete({
        where: {
          user_id: getUser.id,
        },
      });

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async logout(res: any): Promise<boolean> {

    let isRemoved = await removeJwtFromCookie(res);

    return true;
  }
}

// sign up, sign in, logout,  verifyEmail, verifyForgotPassword, forgetPassword changePassword
