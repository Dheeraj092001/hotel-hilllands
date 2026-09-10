import { Router } from "express";
import { UsersController } from "./users.controller";
import { authenticate } from "../../middleware/authenticate";

const router: Router = Router();

router.get("/me", authenticate, UsersController.getMe);
router.put("/me", authenticate, UsersController.updateMe);

export default router;
