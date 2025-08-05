import express from 'express';
const router = express.Router();
import {signup,login,logout,onboard} from "../controllers/auth.controller.js";

import { protectRoute } from '../src/middleware/auth.middleware.js';

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout); // post method is basically used bcz that request changes something on to the server side. 

router.post("/onboarding",protectRoute,onboard);

router.get("/me",protectRoute ,(req, res) => {
  if (!req.user) {
    return res.status(200).json({ success: true, user: null });
  }
  res.status(200).json({ success: true, user: req.user });
});
 // used to check whether the user is logged in or not mostly while dealing with the frontend.
export default router;

