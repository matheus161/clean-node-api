const { MissingParamError } = require("../../utils/errors");

module.exports = class AuthUseCase {
  constructor(loadUserByEmailRepositorySpy) {
    this.loadUserByEmailRepositorySpy = loadUserByEmailRepositorySpy;
  }
  async auth(email, password) {
    if (!email) {
      throw new MissingParamError("email");
    }
    if (!password) {
      throw new MissingParamError("password");
    }
    const user = await this.loadUserByEmailRepositorySpy.load(email);
    if (!user) return null;
    return null;
  }
};
