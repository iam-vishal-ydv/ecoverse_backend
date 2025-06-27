import User from "../models/user-model.js";

export const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;
    console.log(userId)

    if (id === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const userToFollow = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (currentUser.followers.includes(id)) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    currentUser.following.push(id);
    userToFollow.followers.push(currentUserId);

    await currentUser.save();
    await userToFollow.save();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const userToUnfollow = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUser.following.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are not following this user" });
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userId
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUserId.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).json({ message: "Successfully unfollowed user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
