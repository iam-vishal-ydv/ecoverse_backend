

import { authMiddleware } from "../middlewares/authMiddleware";
import express from express
const router = express.Router();


router.post('/:userId/follow', authMiddleware, followUser);
router.post('/:userId/unfollow', authMiddleware, unfollowUser);
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);

   export  default  router