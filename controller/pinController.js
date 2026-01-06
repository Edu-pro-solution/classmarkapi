import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../pins.json");

function loadPins() {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function savePins(pins) {
  fs.writeFileSync(filePath, JSON.stringify(pins, null, 2));
}

// Only uppercase + digits
function generatePin() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let pin = "";
  for (let i = 0; i < 10; i++) {
    pin += chars[Math.floor(Math.random() * chars.length)];
  }

  return pin;
}

// Generate 15-digit serial number
function generateSerial() {
  let serial = "";
  for (let i = 0; i < 15; i++) {
    serial += Math.floor(Math.random() * 10);
  }
  return serial;
}

export const generatePins = (req, res) => {
  const { count = 1 } = req.body;

  const pins = loadPins();
  const newPins = [];

  for (let i = 0; i < count; i++) {
    const pin = generatePin();
    const serial = generateSerial();

    const record = { pin, serial, used: false, createdAt: Date.now() };

    newPins.push(record);
    pins.push(record);
  }

  savePins(pins);

  // Return formatted version for frontend display
  const formattedPins = newPins.map((p) => ({
    display: `Edu Pro SOlution Jamb UTME
${p.pin}
Serial Number :${p.serial}
After installation, click 'Activate'
Customer Care: 07038412640`,
    pin: p.pin,
    serial: p.serial,
  }));

  res.json({
    status: true,
    message: "Pins generated",
    pins: formattedPins,
  });
};
