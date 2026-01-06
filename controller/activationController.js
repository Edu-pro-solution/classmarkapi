// import fs from "fs";
// import path from "path";

// const pinsFile = path.join(process.cwd(), "pins.json"); // Adjust path if needed

// export const activateWithPin = (req, res) => {
//   const { pin, phoneNumber, type, client, productCode, productKey } = req.body;

//   if (!pin) return res.status(400).json({ status: false, message: "Pin required" });

//   // Load pins
//   if (!fs.existsSync(pinsFile)) {
//     return res.status(400).json({ status: false, message: "No pins available" });
//   }

//   const pins = JSON.parse(fs.readFileSync(pinsFile, "utf-8"));
//   const pinRecord = pins.find(p => p.pin === pin);

//   if (!pinRecord) {
//     return res.status(400).json({ status: false, message: "Invalid pin" });
//   }

//   if (pinRecord.used) {
//     return res.status(400).json({ status: false, message: "Pin already used" });
//   }

//   // Mark pin as used
//   pinRecord.used = true;
//   fs.writeFileSync(pinsFile, JSON.stringify(pins, null, 2));

//   // Return activation info
//   const token = Math.random().toString(36).substr(2, 16); // Random token
//   const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 365; // 1 year

//   return res.json({
//     status: true,
//     message: "Activated successfully",
//   activationKey: token, 
//     productKey,
//     pin,
//     deviceId: productKey,
//     expiresAt,
//   });
// };
import fs from "fs";
import path from "path";

const pinsFile = path.join(process.cwd(), "pins.json"); // Adjust path if needed

function generateActivationKey(length = 12) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = "";
  for (let i = 0; i < length; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
}

export const activateWithPin = (req, res) => {
  const { pin, phoneNumber, type, client, productCode, productKey } = req.body;

  if (!pin) return res.status(400).json({ status: false, message: "Pin required" });

  // Load pins
  if (!fs.existsSync(pinsFile)) {
    return res.status(400).json({ status: false, message: "No pins available" });
  }

  const pins = JSON.parse(fs.readFileSync(pinsFile, "utf-8"));
  const pinRecord = pins.find(p => p.pin === pin);

  if (!pinRecord) {
    return res.status(400).json({ status: false, message: "Invalid pin" });
  }

  if (pinRecord.used) {
    return res.status(400).json({ status: false, message: "Pin already used" });
  }

  // Mark pin as used
  pinRecord.used = true;
  fs.writeFileSync(pinsFile, JSON.stringify(pins, null, 2));

  // Generate proper activation key
  const activationKey = generateActivationKey(12); // 12 chars, uppercase + numbers
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 365; // 1 year

  return res.json({
    status: true,
    message: "Activated successfully",
    activationKey,
    productKey,
    pin,
    deviceId: productKey,
    expiresAt,
  });
};
