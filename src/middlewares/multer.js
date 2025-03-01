import multer from "multer";
import { nanoid } from "nanoid";
import fs from "fs";

// file validation
export const fileFormat = {
  image: ["image/jpeg", "image/png"],
  video: ["video/mp4"],
  audio: ["audio/mp3"],
  pdf: ["application/pdf"],
  document: ["application/word"],
  archive: ["application/zip"],
};

// Multer configuration
export const multerLocal = (customValidation = [], customPath = "Generals") => {
  const fullPath = `./src/uploads/${customPath}`;
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      //const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, nanoid(5) + "-" + file.originalname);
    },
  });

  function fileFilter(req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type: ", false));
    }
  }

  const upload = multer({ storage, fileFilter });
  return upload;
};

export const multerCloud = (customValidation = []) => {
  const storage = multer.diskStorage({});
  function fileFilter(req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type: ", false));
    }
  }

  const upload = multer({ storage, fileFilter });
  return upload;
};
