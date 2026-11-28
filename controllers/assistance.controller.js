
import { db } from "../config/db.js";

export async function createAssistanceRequest(req, res) {
  try {
    const { type, description, location, peopleCount } = req.body;

    // Validate required fields
    if (
      !type?.trim() ||
      !description?.trim() ||
      !location?.trim() ||
      peopleCount === undefined
    ) {
      return res.status(400).json({
        message: "Please provide all required information.",
      });
    }

    const count = Number(peopleCount);

    if (!Number.isInteger(count) || count < 1) {
      return res.status(400).json({
        message: "Number of people must be a positive whole number.",
      });
    }

    const assistanceRequest = {
  userId: req.user.id,

  requester: {
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone || null,
  },

  type: type.trim(),
  description: description.trim(),
  location: location.trim(),
  peopleCount: count,

  status: "pending",
  createdAt: new Date(),
  updatedAt: new Date(),
};

    const result = await db
      .collection("assistanceRequests")
      .insertOne(assistanceRequest);

    return res.status(201).json({
      message: "Assistance request submitted successfully.",
      request: {
        _id: result.insertedId,
        ...assistanceRequest,
      },
    });
  } catch (error) {
    console.error("Create assistance request error:", error);

    return res.status(500).json({
      message: "Unable to submit assistance request.",
    });
  }
}
