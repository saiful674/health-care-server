import jwt from "jsonwebtoken";

const genarateToken = (payload: any, secret: string, expiresIn: string) => {
  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  });

  return token;
};

export const jwtHalper = {
  genarateToken,
};
