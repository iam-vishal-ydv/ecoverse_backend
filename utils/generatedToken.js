import jwt from "jsonwebtoken";

const generatedToken = (user) => {
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "2d",
    }
  );

  return token;
};

export default generatedToken;
