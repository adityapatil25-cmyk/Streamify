import express from "express";

const router = express.Router();
import { protectRoute } from "../src/middleware/auth.middleware.js";
import { getMyFriends , getRecommendedUsers,sendFriendRequest,acceptFriendRequest,getFriendRequests,getOutgoingFriendReqs} from "../controllers/user.controller.js";
router.get("/",protectRoute,getRecommendedUsers);
router.get("/friends",protectRoute,getMyFriends);

router.post("/friend-request/:id",protectRoute,sendFriendRequest);
router.put("/friend-request/:id/accept",protectRoute,acceptFriendRequest);


router.get("/friend-requests",protectRoute,getFriendRequests); /* it is useful to accept the friend request which is 
in pending state on the notification page. It is basically used for getting the friend request. */

router.get("/outgoing-friend-requests",protectRoute,getOutgoingFriendReqs);
/* This is for when we have sent a request to a user already , then we should not be able to send request to that user again , so we are 
writting this route */
export default router;