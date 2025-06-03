import jwt from "jsonwebtoken";

const generatedToken = async (userId) => {
  const token = await jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "30min",
    }
  );

  return token;
};

export default generatedToken;
