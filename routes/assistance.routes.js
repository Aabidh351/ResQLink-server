import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { createAssistanceRequest } from "../controllers/assistance.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("citizen"),
  createAssistanceRequest
);

export default router;