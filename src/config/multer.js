import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Get the parent folder path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const folder = path.join(__dirname, ".."); // Moves one level up

const storage = multer.diskStorage({
  destination: path.join(folder, "uploads"), // Saves in the parent folder
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

let multerUpload = multer({ storage });

export default multerUpload;