import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const uniquiSuffex = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const etx = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniquiSuffex + etx);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpeg", "image/gif", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("wrong is here"), false);
  }
};

export const uploads = multer({
  storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
