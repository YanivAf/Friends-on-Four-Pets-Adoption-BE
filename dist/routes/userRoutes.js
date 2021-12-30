"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userSchemaBody_1 = require("../schemas/userSchemaBody");
const validateBody_1 = require("../middlewares/validateBody");
const userMiddlewares_1 = require("../middlewares/userMiddlewares");
const userControllers_1 = require("../controllers/userControllers");
router
    .get("/token/", userMiddlewares_1.isLoggedInAndAuthenticated, userMiddlewares_1.doesUserExist, userMiddlewares_1.isBanned, userControllers_1.login)
    .post("/filtered", userMiddlewares_1.isLoggedInAndAuthenticated, userMiddlewares_1.doesUserExist, userMiddlewares_1.isSuperAdmin, userMiddlewares_1.onlySuperAdmin, userControllers_1.showUsers)
    .post("/signup", (0, validateBody_1.validateBody)(userSchemaBody_1.userSchema), userMiddlewares_1.doesUserExist, userMiddlewares_1.isPasswordPassed, userMiddlewares_1.confirmPassword, userMiddlewares_1.encryptPassword, userControllers_1.signup)
    .post("/login", userMiddlewares_1.isPasswordPassed, userMiddlewares_1.doesUserExist, userMiddlewares_1.isBanned, userMiddlewares_1.validatePassword, userControllers_1.login)
    .get("/logout", userMiddlewares_1.isLoggedInAndAuthenticated, userMiddlewares_1.doesUserExist, userControllers_1.logout);
router.all("/:id*", userMiddlewares_1.isLoggedInAndAuthenticated, userMiddlewares_1.doesUserExist);
router
    .get("/:id/contact", userMiddlewares_1.doesSearchedUserExist, userControllers_1.showUserContactInfo)
    .get("/:id/full", userMiddlewares_1.isSuperAdmin, userMiddlewares_1.onlySuperAdmin, userMiddlewares_1.doesSearchedUserExist, userControllers_1.showUserWithPets)
    .put("/:id/toggle-ban", userMiddlewares_1.isSuperAdmin, userMiddlewares_1.onlySuperAdmin, userMiddlewares_1.doesSearchedUserExist, userMiddlewares_1.OtherAdminBanningAttempt, userControllers_1.banToggleUser)
    .get("/:id", userMiddlewares_1.isSuperAdmin, userMiddlewares_1.onlySuperAdmin, userMiddlewares_1.doesSearchedUserExist, userControllers_1.showUser)
    .put("/:id", userMiddlewares_1.doesEmailExist, userMiddlewares_1.isBanned, userMiddlewares_1.isPasswordPassed, userMiddlewares_1.confirmPassword, (0, validateBody_1.validateBody)(userSchemaBody_1.userSchema), userMiddlewares_1.encryptPassword, userControllers_1.editUser);
// function isWorking(req, res, next) {
//   console.log("working");
//   console.log(req.body);
//   next();
// }
exports.default = router;
//# sourceMappingURL=userRoutes.js.map