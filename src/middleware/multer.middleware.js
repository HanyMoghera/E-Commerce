import multer from "multer";
import { imageFileFilter } from "../utils/multerFileFilter.js";

// Disk storage configuration
const storage = multer.diskStorage({
  destination: "uploads/", // folder to save images
  filename: function (_, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // unique filename
  },
});

// Multer middleware
export const upload = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// import multer from "multer";
// import { imageFileFilter } from "../utils/multerFileFilter.js";

// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: function (_, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// export const upload = multer({
//   storage: storage,
//   fileFilter: imageFileFilter,
//   limits: {
//     fieldSize: 5 * 1024 * 1024,
//   },
// });
