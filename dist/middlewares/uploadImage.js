"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.storage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
exports.storage = multer_1.default.diskStorage({
    destination: "./public/images/",
    filename: (req, file, cb) => {
        cb(null, `${req.petDoc._id}${path_1.default.extname(file.originalname)}`);
    },
});
exports.uploadImage = (0, multer_1.default)({
    storage: exports.storage,
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
//# sourceMappingURL=uploadImage.js.map