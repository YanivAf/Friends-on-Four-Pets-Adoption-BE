"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
require("dotenv").config();
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const pathToFile = path_1.default.resolve(__dirname, "../public");
const cors_1 = __importDefault(require("cors"));
const corsOptions = {
    credentials: true,
    origin: process.env.ORIGIN || "http://localhost:3000",
    exposedHeaders: ["set-cookie"]
};
exports.app.set("trust proxy", 1);
exports.app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || '123456',
    resave: true,
    saveUninitialized: false,
    cookie: {
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
        secure: process.env.NODE_ENV === "production",
        domain: process.env.ORIGIN || "http://localhost:3000"
    }
}));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use(express_1.default.static(pathToFile));
exports.app.use((0, cors_1.default)(corsOptions));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const petRoutes_1 = __importDefault(require("./routes/petRoutes"));
exports.app.get('/', (req, res) => {
    res.send({ foo: "bar", hello: "world", chuck: "norris", origin: corsOptions.origin });
});
exports.app.use("/user", userRoutes_1.default);
exports.app.use("/pet", petRoutes_1.default);
//# sourceMappingURL=server.js.map