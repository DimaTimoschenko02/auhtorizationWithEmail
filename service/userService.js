const User = require("../module/userModel");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mailService");
const TokenService = require("./tokenService");
const UserDto = require("../dto/userDto");
const ApiError = require("../exeptions/apiErrors");
const tokenservice = require("./tokenService");
const jwt = require('jsonwebtoken')

class UserService {
  validateAccessToken(token){
    try{
      const userData = jwt.verify(token , process.env.JWT_ACCESS_TOKEN)
      return userData
    }catch(e){
      return null
    }
  }
  validateRefreshToken(token){
    try{
      const userData = jwt.verify(token , process.env.JWT_REFRESH_TOKEN)
      return userData
    }catch(e){
      return null
    }
  }


  async registration(email, password) {
    const user = await User.findOne({ email });
    if (user) {
      throw ApiError.BadRequest(`User with this email ${email} already exist`);
    }
    const activationLink = uuid.v4();
    const hashPassword = bcrypt.hashSync(password, 5);

    const newUser = await User.create({
      email,
      password: hashPassword,
      activationLink,
    });
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );

    const userDto = new UserDto(newUser);
    const tokens = await TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, userDto };
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest(`user with this ${email} was not found`);
    }
    const hashPassword = await bcrypt.compare(password, user.password);
    if (!hashPassword) {
      throw ApiError.BadRequest("uncorrect password");
    }
    const userDto = new UserDto(user);
    const tokens = await TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async activate(activationLink) {
    const user = await User.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest("uncorrect link");
    }
    user.isActivated = true;
    user.save();
  }

  async getAllUsers() {
    const users = await User.find();
    return users;
  }

  async logout(refreshToken) {
    const token = await tokenservice.removeToken(refreshToken);
    console.log("logout userS" , token)
    return token;
  }

  async refresh(refreshToken){
    if(!refreshToken)
    {
      throw ApiError.UnauthorizedError()
    }
    const userData = this.validateRefreshToken(refreshToken)
    const tokenFromDb = tokenservice.findToken(refreshToken)
    if(!userData || !tokenFromDb){
      throw ApiError.UnauthorizedError()
    }
    const user = await User.findById(userData.id)
    const userDto = new UserDto(user);
    const tokens = await TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }
}
module.exports = new UserService();
