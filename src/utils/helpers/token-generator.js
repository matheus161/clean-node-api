const jwt = require("jsonwebtoken");
const MissingParamError = require("../errors/missing-param-error");

module.exports = class TokenGenerator {
  // O correto é injetar no main a var de ambiente
  constructor(secret) {
    this.secret = secret;
  }
  async generate(id) {
    if (!this.secret) {
      throw new MissingParamError("secret");
    }
    if (!id) {
      throw new MissingParamError("id");
    }
    return jwt.sign(id, this.secret);
  }
};