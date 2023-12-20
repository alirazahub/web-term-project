import express from "express";
import { login, register,updateProfile,updateProfileImage } from "../controllers/user.js";
import { verifyUser } from '../middleware/verifyUser.js'

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.put("/profile/:id", updateProfile);
router.put("/change-profile-img/:id", updateProfileImage);


export default router;