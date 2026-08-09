import express from "express";
import multer from "multer";
import authenticateUser from "../middleware/authMiddleware.js";
import {
  getHomeworkSubmissions,
  createHomeworkSubmission,
  askHomeworkAssistant,
} from "../controller/homeworkController.js";

// Files land in memory so they can be streamed straight to S3
// without touching disk first.
const upload = multer({ storage: multer.memoryStorage() });

// Matches the pattern already used for commonRoute(s3, ...) and onScreenRoute(s3)
// in index.js, so the shared S3 client gets passed in from there.
export default function homeworkRoute(s3) {
  const router = express.Router();

  router.get("/submissions", authenticateUser, getHomeworkSubmissions);

  router.post(
    "/homework/submissions",
    authenticateUser,
    upload.single("attachment"),
    createHomeworkSubmission(s3)
  );

  router.post("/assistant", authenticateUser, askHomeworkAssistant);

  return router;
}
