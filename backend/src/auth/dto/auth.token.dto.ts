import { User, UserDocument } from "src/user/entities/user.model";
import { TokensDto } from "./token.dto";
import { UserDto } from "src/user/dto/user.dto";

export class AuthTokenDto {
    user: UserDto
    accessToken: string;
    refreshToken: string;

    public static toDto(token: TokensDto, user: UserDocument): AuthTokenDto {
        return {
            user: UserDto.toDto(user),
            accessToken: token.accessToken,
            refreshToken: token.refreshToken
        }
    }
}