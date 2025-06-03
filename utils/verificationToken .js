import jwt from "jsonwebtoken";

export const verificationToken = (email) => {
  const token = jwt.sign(
    { email: email.toLowerCase() },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );

  return token;
};
