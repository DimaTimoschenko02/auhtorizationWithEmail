const jwt = require("jsonwebtoken");
const Token = require("../module/tokenModel");
class TokenService {
  async generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
      expiresIn: "30s",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {
      expiresIn: "30d",
    });
    return { accessToken, refreshToken };
  }

  async saveToken(userId, refreshToken) {
    const token = await Token.findOne({ userId });
    if (token) {
      //console.log('exist')
      token.refreshToken = refreshToken;
      await token.save()
      return token;
    }
    const newToken = await Token.create({ userId, refreshToken });

    return newToken;
  }

  async removeToken(refreshToken) {
    console.log(refreshToken)
    const token = await Token.findOneAndDelete({ refreshToken });
    console.log("logout tokenS", token);
    return token;
  }

  async findToken(refreshToken){
    const token = Token.findOne({refreshToken})
    return token
  }
}
module.exports = new TokenService();
