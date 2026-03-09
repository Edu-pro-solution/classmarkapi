// import express from "express";


// import { paystackWebhook,   initializePayment,
//   verifyPayment,
//   checkAccess, } from "../controller/schPaymentController.js";
// import { protect } from "../middleware/protectUser.js";

// const router = express.Router();

// // ──────────────────────────────────────────────────────────────────────────────
// // PUBLIC ROUTES (no auth required)
// // ──────────────────────────────────────────────────────────────────────────────

// // Paystack webhook — must be raw body, no auth
// // ⚠️  Register this BEFORE express.json() in your app.js for this route only
// router.post(
//   "/sch-webhook",
//   express.raw({ type: "application/json" }), // raw body for signature check
//   paystackWebhook
// );

// // Check if email has access to an article (called on page load)
// // GET /api/payments/access?email=xxx&articleId=yyy
// router.get("/sch-access", checkAccess);

// // Verify payment after redirect from Paystack
// // GET /api/payments/verify/:reference
// router.get("/sch/verify/:reference", verifyPayment);

// // ──────────────────────────────────────────────────────────────────────────────
// // PROTECTED ROUTES (JWT required)
// // ──────────────────────────────────────────────────────────────────────────────

// // Initialize a new payment
// // POST /api/payments/initialize
// // Body: { email, articleId, articleTitle }
// router.post("/sch-initialize", protect, initializePayment);

// export default router;

// // ──────────────────────────────────────────────────────────────────────────────
// // REGISTER IN YOUR app.js / server.js like this:
// //
// //   import paymentRouter from "./paymentRouter.js";
// //   app.use("/api/payments", paymentRouter);
// //
// // Add to your .env:
// //   PAYSTACK_SECRET_KEY=sk_live_xxxx   (or sk_test_xxxx for testing)
// //   FRONTEND_URL=https://yourdomain.com
// // ──────────────────────────────────────────────────────────────────────────────
import express from "express";
import {
  initializePayment,
  verifyPayment,
  paystackWebhook,
  checkAccess,
} from "../controller/schPaymentController.js";
import { protect } from "../middleware/protectUser.js";
const router = express.Router();

// ──────────────────────────────────────────────────────────────────────────────
// Match exactly what your frontend calls:
//
//   POST /api/sch-initialize        → initializePayment
//   GET  /api/sch/verify/:reference → verifyPayment
//   GET  /api/sch/access            → checkAccess
//   POST /api/sch/webhook           → paystackWebhook (called by Paystack, not frontend)
// ──────────────────────────────────────────────────────────────────────────────

// Paystack webhook — raw body needed for signature verification
// ⚠️ Must be registered BEFORE express.json() parses the body
router.post(
  "/sch/webhook",
  express.raw({ type: "application/json" }),
  paystackWebhook
);

// Check if user already has access (called on article page load)
// GET /api/sch/access?email=xxx&articleId=yyy
router.get("/sch/access", checkAccess);

// Verify payment after Paystack callback
// GET /api/sch/verify/:reference
router.get("/sch/verify/:reference", verifyPayment);

// Initialize payment — requires login
// POST /api/sch-initialize
router.post("/sch-initialize", protect, initializePayment);

export default router;

// ──────────────────────────────────────────────────────────────────────────────
// In your server.js / app.js register like this:
//
//   import paymentRouter from "./routes/schPaymentRouter.js";
//   app.use("/api", paymentRouter);
//
// This gives you:
//   POST /api/sch-initialize
//   GET  /api/sch/verify/:reference
//   GET  /api/sch/access
//   POST /api/sch/webhook
// ──────────────────────────────────────────────────────────────────────────────