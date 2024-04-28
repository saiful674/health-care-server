import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const genarateToken = (payload: any, secret: Secret, expiresIn: string) => {
  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  });

  return token;
};

const varifyToken = (token: string, secret: Secret) => {
  const decodedUser = jwt.verify(token, secret) as JwtPayload;
  return decodedUser;
};

export const jwtHalper = {
  genarateToken,
  varifyToken,
};
