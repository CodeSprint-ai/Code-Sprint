export const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

export const storingJwtOnCookie = (user: any, res: any, jwtService: any) => {
  const payload: any = {
    id: user.id,
    email: user.email,
  };

  const access_token = jwtService.sign(payload);

  return res.cookie('jwt', access_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });
};

export const removeJwtFromCookie = (res: any): boolean => {
  return res.clearCookie('jwt'); // Replace with your cookie name
};
