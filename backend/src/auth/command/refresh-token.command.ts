export class RefreshTokenCommand {
  constructor(
    public readonly userUuid: string,
    public readonly refreshToken: string,
  ) {}
}