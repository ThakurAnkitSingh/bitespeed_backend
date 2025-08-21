import express from "express";
import { identifyContact } from "./contactService";
import { IdentifyRequest } from "./types";
import { disconnect } from "./database";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// POST /identify endpoint as specified in requirements
app.post("/identify", async (req: express.Request, res: express.Response) => {
  try {
    const { email, phoneNumber }: IdentifyRequest = req.body;

    // Validate that at least one of email or phoneNumber is provided
    if (!email && !phoneNumber) {
      return res.status(400).json({
        error: "At least one of email or phoneNumber must be provided",
      });
    }

    // Process the identify request
    const result = await identifyContact({ email, phoneNumber });

    // Return response in the required format
    res.status(200).json({
      contact: result,
    });
  } catch (error: any) {
    console.error("Error processing identify request:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(
    `🚀 Bitespeed Identity Reconciliation API running on port ${PORT}`
  );
  console.log(`📡 POST /identify endpoint available`);
});
