export const jwtonfigs = {
  secret: process.env.SECRET,
  signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
};
