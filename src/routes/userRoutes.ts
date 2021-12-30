export {};
import express from "express";
const router = express.Router();

import { userSchema } from "../schemas/userSchemaBody";
import { validateBody } from "../middlewares/validateBody";
import {
  isLoggedInAndAuthenticated,
  doesUserExist,
  doesSearchedUserExist,
  doesEmailExist,
  isPasswordPassed,
  isBanned,
  OtherAdminBanningAttempt,
  confirmPassword,
  encryptPassword,
  validatePassword,
  isSuperAdmin,
  onlySuperAdmin,
} from "../middlewares/userMiddlewares";
import {
  signup,
  login,
  showUsers,
  showUser,
  showUserContactInfo,
  showUserWithPets,
  editUser,
  banToggleUser,
  logout,
} from "../controllers/userControllers";

router
  .get("/token/", isLoggedInAndAuthenticated, doesUserExist, isBanned, login)
  .post(
    "/filtered",
    isLoggedInAndAuthenticated,
    doesUserExist,
    isSuperAdmin,
    onlySuperAdmin,
    showUsers
  )
  .post(
    "/signup",
    validateBody(userSchema),
    doesUserExist,
    isPasswordPassed,
    confirmPassword,
    encryptPassword,
    signup
  )
  .post(
    "/login",
    isPasswordPassed,
    doesUserExist,
    isBanned,
    validatePassword,
    login
  )
  .get("/logout", isLoggedInAndAuthenticated, doesUserExist, logout);

router.all("/:id*", isLoggedInAndAuthenticated, doesUserExist);

router
  .get("/:id/contact", doesSearchedUserExist, showUserContactInfo)
  .get(
    "/:id/full",
    isSuperAdmin,
    onlySuperAdmin,
    doesSearchedUserExist,
    showUserWithPets
  )
  .put(
    "/:id/toggle-ban",
    isSuperAdmin,
    onlySuperAdmin,
    doesSearchedUserExist,
    OtherAdminBanningAttempt,
    banToggleUser
  )
  .get("/:id", isSuperAdmin, onlySuperAdmin, doesSearchedUserExist, showUser)
  .put(
    "/:id",
    doesEmailExist,
    isBanned,
    isPasswordPassed,
    confirmPassword,
    validateBody(userSchema),
    encryptPassword,
    editUser
  );

// function isWorking(req, res, next) {
//   console.log("working");
//   console.log(req.body);
//   next();
// }

export default router;
