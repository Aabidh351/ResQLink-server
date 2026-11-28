import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import {
  createAssistanceRequest,
  getMyAssistanceRequests,
  cancelAssistanceRequest,
  getAssistanceRequestById,
  updateAssistanceRequest,
  getIncomingAssistanceRequests,
  updateAssistanceRequestStatus,
  getOrganizationRequestHistory
} from "../controllers/assistance.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("citizen"),
  createAssistanceRequest
);

router.get(
  "/",
  authenticate,
  authorize("citizen"),
  getMyAssistanceRequests
);

router.patch(
  "/:id/cancel",
  authenticate,
  authorize("citizen"),
  cancelAssistanceRequest
);

router.get(
  "/incoming",
  authenticate,
  authorize("organization"),
  getIncomingAssistanceRequests
);

router.get(
  "/organization-history",
  authenticate,
  authorize("organization"),
  getOrganizationRequestHistory
);

router.get(
  "/:id",
  authenticate,
  authorize("citizen"),
  getAssistanceRequestById
);

router.patch(
  "/:id",
  authenticate,
  authorize("citizen"),
  updateAssistanceRequest
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("organization"),
  updateAssistanceRequestStatus
);


export default router;