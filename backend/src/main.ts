import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Notepott API')
    .setDescription('Notepott API Description')
    .setVersion('1.0')
    // .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();

// async resendOtp(ResendOtpDto: ResendOtpDto) {
//   try {
//     //  get user by email
//     const getUser = await this.prismaService.user.findUnique({
//       where: {
//         email: ResendOtpDto.email,
//       },
//     });

//     // Not found then throwing Error

//     if (!getUser) {
//       throw new NotFoundException('Enter Valid Email');
//     }

//     const userVerify =
//       await this.prismaService.user_Account_Verification.findUnique({
//         where: {
//           user_id: getUser.id,
//         },
//       });

//     // if user Otp not found on user_account_verification table then generate and create otp  TODO and send on email

//     if (!userVerify) {
//       // generate OTP
//       const otpCode = generateOtp();

//       console.log(otpCode);

//       await this.prismaService.user_Account_Verification.create({
//         data: {
//           code: await encryptPassword(otpCode.toString()),
//           limit: 9,
//           user_id: getUser.id,
//         },
//       });
//     }

//     // checking time limit that has been set to prohibit user and after that specific time allowing user to send if limit reached then block user (limit == 0)

//     const currentTime = new Date().getTime();

//     let allow = true;

//     if (userVerify.limit <= 6 && userVerify.limit > 3) {
//       currentTime < userVerify.updatedAt.getTime() + 120 * 60 * 1000
//         ? (allow = false)
//         : allow;
//       // Assume userVerify.updatedAt is a Date object
//       const updatedAt = userVerify.updatedAt; // This should be a Date object

//       // Calculate the future timestamp (1 day later)
//       const futureTimestamp = updatedAt.getTime() + 120 * 60 * 1000;

//       // Create a new Date object from the future timestamp
//       const futureDate = new Date(futureTimestamp);

//       // Format the future date as a readable string
//       const readableDate = futureDate.toLocaleString();

//       console.log({
//         twomins: allow,
//         currentTime: new Date().toTimeString(),
//         prohibitedTill: readableDate,
//       });
//     } else if (userVerify.limit <= 3 && userVerify.limit > 0) {
//       currentTime < userVerify.updatedAt.getTime() + 1440 * 60 * 1000
//         ? (allow = false)
//         : allow;

//       // Assume userVerify.updatedAt is a Date object
//       const updatedAt = userVerify.updatedAt; // This should be a Date object

//       // Calculate the future timestamp (1 day later)
//       const futureTimestamp = updatedAt.getTime() + 1440 * 60 * 1000;

//       // Create a new Date object from the future timestamp
//       const futureDate = new Date(futureTimestamp);

//       // Format the future date as a readable string
//       const readableDate = futureDate.toLocaleString();

//       console.log({
//         threemins: allow,
//         currentTime: new Date().toTimeString(),
//         prohibitedTill: readableDate,
//       });
//     } else if (userVerify.limit === 0) {
//       return { message: 'you have beeen blocked' };
//     }

//     const otpCode = generateOtp();

//     console.log(otpCode);

//     const expiresAt =
//       currentTime < userVerify.updatedAt.getTime() + 3 * 60 * 1000;
//     // update previous Otp

//     if (allow) {
//       console.log({ updateArea: allow });
//       if (!expiresAt) {
//         await this.prismaService.user_Account_Verification.update({
//           where: {
//             user_id: getUser.id,
//           },
//           data: {
//             limit: --userVerify.limit,
//             code: otpCode.toString(),
//           },
//         });
//       }

//       //TODO send Otp on email
//     }

//     return userVerify;
//   } catch (error) {
//     throw error;
//   }
// }

