import { User } from "src/user/entities/user.model";
import { TokensDto } from "./token.dto";

export class AuthTokenDto {
    userName: string;
    userId: string;
    accessToken: string;
    refreshToken: string;


    public static toDto(token: TokensDto , user: User): AuthTokenDto {
        return {
            userName: user.name,
            userId: user._id.toString(),
            accessToken: token.accessToken,
            refreshToken: token.refreshToken
        }
    }
}