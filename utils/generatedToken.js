import jwt from "jsonwebtoken";

const generatedToken = (user) => {
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "30min",
    }
  );

  return token;
};

export default generatedToken;
