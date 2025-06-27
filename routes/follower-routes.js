
import express from "express"
import { followUser, getFollowers, getFollowing, unfollowUser } from "../controllers/follower-controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const  userFollowRouter = express.Router();


userFollowRouter.post('/follow/:userId', authMiddleware, followUser);
userFollowRouter.post('/:userId/unfollow', authMiddleware, unfollowUser);
userFollowRouter.get('/:userId/followers', getFollowers);
userFollowRouter.get('/:userId/following', getFollowing);

   export  default  userFollowRouter