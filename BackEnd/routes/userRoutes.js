import express from "express"
import  {followAndUnfollowUser, loginUser, logOut, myProfile, registerUser, userProfile }  from "../controllers/userController.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser )
router.get("/logout", isAuth, logOut )
router.get("/me", isAuth, myProfile )
router.get("/:id", isAuth, userProfile )
router.post("/follow/:id", isAuth, followAndUnfollowUser )

export default router;