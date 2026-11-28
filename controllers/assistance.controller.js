
import { db } from "../config/db.js";
import { ObjectId } from "mongodb";

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

export async function getMyAssistanceRequests(req, res) {
  try {
    const requests = await db
      .collection("assistanceRequests")
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({
      requests,
    });
  } catch (error) {
    console.error("Get assistance requests error:", error);

    return res.status(500).json({
      message: "Unable to retrieve assistance requests.",
    });
  }
}

export async function cancelAssistanceRequest(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid request ID.",
      });
    }

    const result = await db.collection("assistanceRequests").updateOne(
      {
        _id: new ObjectId(id),
        userId: req.user.id,
        status: "pending",
      },
      {
        $set: {
          status: "cancelled",
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Request not found or can no longer be cancelled.",
      });
    }

    return res.status(200).json({
      message: "Assistance request cancelled successfully.",
    });
  } catch (error) {
    console.error("Cancel assistance request error:", error);

    return res.status(500).json({
      message: "Unable to cancel assistance request.",
    });
  }
}

export async function getAssistanceRequestById(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid request ID.",
      });
    }

    const request = await db.collection("assistanceRequests").findOne({
      _id: new ObjectId(id),
      userId: req.user.id,
    });

    if (!request) {
      return res.status(404).json({
        message: "Assistance request not found.",
      });
    }

    return res.status(200).json({ request });
  } catch (error) {
    console.error("Get assistance request error:", error);

    return res.status(500).json({
      message: "Unable to retrieve assistance request.",
    });
  }
}


export async function updateAssistanceRequest(req, res) {
  try {
    const { id } = req.params;
    const { description, location, peopleCount } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid request ID.",
      });
    }

    if (
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

    const result = await db.collection("assistanceRequests").updateOne(
      {
        _id: new ObjectId(id),
        userId: req.user.id,
        status: "pending",
      },
      {
        $set: {
          description: description.trim(),
          location: location.trim(),
          peopleCount: count,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Request not found or can no longer be edited.",
      });
    }

    return res.status(200).json({
      message: "Assistance request updated successfully.",
    });
  } catch (error) {
    console.error("Update assistance request error:", error);

    return res.status(500).json({
      message: "Unable to update assistance request.",
    });
  }
}

export async function getIncomingAssistanceRequests(req, res) {
  try {
    const requests = await db
      .collection("assistanceRequests")
      .find({
  status: {
    $in: ["pending", "accepted", "in-progress"],
  },
})
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({
      requests,
    });
  } catch (error) {
    console.error("Get incoming assistance requests error:", error);

    return res.status(500).json({
      message: "Unable to retrieve incoming assistance requests.",
    });
  }
}



export async function updateAssistanceRequestStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid request ID.",
      });
    }

    const allowedTransitions = {
      accepted: {
        from: "pending",
      },
      rejected: {
        from: "pending",
      },
      "in-progress": {
        from: "accepted",
      },
      completed: {
        from: "in-progress",
      },
    };

    const transition = allowedTransitions[status];

    if (!transition) {
      return res.status(400).json({
        message: "Invalid request status.",
      });
    }

    const result = await db.collection("assistanceRequests").updateOne(
      {
        _id: new ObjectId(id),
        status: transition.from,
      },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Request not found or status transition not allowed.",
      });
    }

    return res.status(200).json({
      message: `Request marked as ${status} successfully.`,
    });
  } catch (error) {
    console.error("Update assistance request status error:", error);

    return res.status(500).json({
      message: "Unable to update request status.",
    });
  }
}


export async function getOrganizationRequestHistory(req, res) {
  try {
    const requests = await db
      .collection("assistanceRequests")
      .find({
        status: {
          $in: ["completed", "rejected"],
        },
      })
      .sort({ updatedAt: -1 })
      .toArray();

    return res.status(200).json({ requests });
  } catch (error) {
    console.error("Get organization request history error:", error);

    return res.status(500).json({
      message: "Unable to fetch request history.",
    });
  }
}

