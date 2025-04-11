import { Router } from "express";
import { dynamicFile, updateUserFile } from "../controllers/user.contoller.js";
const router = Router()

router.route("/:fileName").get(
    dynamicFile
)
router.route("/:fileName").post(
    updateUserFile
)

router.route("/").get(
    (req,res)=>{return res.status(200).json({message:"donde"})}
)

export default router