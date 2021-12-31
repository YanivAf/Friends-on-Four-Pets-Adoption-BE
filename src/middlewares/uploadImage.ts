import multer from "multer";
import path from "path";
export const storage = multer.diskStorage({
  destination: "./public/images/",
  filename: (req, file, cb) => {
    cb(null, `${req.petDoc._id}${path.extname(file.originalname)}`);
  },
});

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: 2000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|gif)$/)) {
      return cb(new Error("Please upload image type only"));
    }
    cb(undefined, true);
  },
});
