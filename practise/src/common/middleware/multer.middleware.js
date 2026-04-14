import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination: function (req, cb, file) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffex = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const etx = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffex + etx);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpg", "image/jpeg", "image/png", "image/pdf"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("invalid file"), false);
  }
};

export const uploads = multer({
  storage,
  limits: { fieldSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter,
});
