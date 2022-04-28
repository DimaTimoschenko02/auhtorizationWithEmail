const { Router } = require("express");
const UserController = require("../controller/userController");
const { body } = require("express-validator");
const router = Router();
const authCheck = require("../middleware/middlewareAuth");
router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 6, max: 32 }),
  UserController.login
);
router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 6, max: 32 }),
  UserController.registration
);
router.post("/logout", UserController.logout);
router.get("/activate/:link", UserController.activate);
router.get("/refresh", UserController.refresh);
router.get("/users", authCheck, UserController.getUsers);

module.exports = router;
