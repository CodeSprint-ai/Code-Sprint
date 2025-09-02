export class TokensDto {
  accessToken: string;
  refreshToken: string;

  public static toDto(accessToken,refreshToken): TokensDto {
    return {
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  }
}