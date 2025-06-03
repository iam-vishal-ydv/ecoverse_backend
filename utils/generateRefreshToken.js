import jwt from "jsonwebtoken";
import User from "../models/user-model";

const generateRefreshToken = async (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const updatedRefreshToken = await User.updateOne(
    { _id: userId },
    {
      refresh_token: token,
    }
  );

  return updatedRefreshToken;
};

export default generateRefreshToken;
