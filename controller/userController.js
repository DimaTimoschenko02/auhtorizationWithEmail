const { markAsUntransferable } = require("worker_threads");
const userService = require("../service/userService");
const UserService = require("../service/userService");
const { validationResult } = require("express-validator");
const ApiError = require("../exeptions/apiErrors");
const tokenservice = require("../service/tokenService");

class UserController {

  async registration(req, res, next) {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        console.log(error)
        return next(ApiError.BadRequest("validation error", error.array()));
      }
      const { email, password } = req.body;
      const newUser = await UserService.registration(email, password);
      res.cookie("refreshToken", newUser.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(newUser);
    } catch (err) {
      next(err);
    }
  }


  async login(req, res, next) {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        console.log(error)
        return next(ApiError.BadRequest("validation error", error.array()));
      }
      
      const {email , password} = req.body
      const user = await UserService.login(email , password)
      res.cookie("refreshToken", user.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(user)
    } catch (err) {
      next(err);
    }
  }
  async logout(req, res, next) {
    try {
      const {refreshToken} = req.cookies  
      const token = await userService.logout(refreshToken)
      console.log("logout userC" , token)
      res.clearCookie('refreshToken')
      return res.json(token)
    } catch (err) {
      next(err);
    }
  }
  async refresh(req, res, next) {
    try {
      const {refreshToken} = req.cookies
      const user = await userService.refresh(refreshToken)
      res.cookie("refreshToken", user.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(user)
    } catch (err) {
      next(err);
    }
  }
  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (err) {
      next(err);
    }
  }
  async getUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers()
      return res.json(users)
    } catch (err) {
      next(err);
    }
  }
}
module.exports = new UserController();
