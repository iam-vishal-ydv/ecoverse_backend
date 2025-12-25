import User from "../models/user-model.js";

export const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id.toString();

    if (userId === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const userToFollow = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = userToFollow.followers.includes(currentUserId);

    if (isFollowing) {
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: currentUserId },
      });

      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: userId },
      });

      return res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { followers: currentUserId },
      });

      await User.findByIdAndUpdate(currentUserId, {
        $addToSet: { following: userId },
      });

      return res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate({
      path: "followers",
      select: "username profileImage bio",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.followers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate({
      path: "following",
      select: "username profileImage bio",
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.following);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
