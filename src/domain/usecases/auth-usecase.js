const { MissingParamError, InvalidParamError } = require("../../utils/errors");

module.exports = class AuthUseCase {
  constructor(loadUserByEmailRepositorySpy) {
    this.loadUserByEmailRepositorySpy = loadUserByEmailRepositorySpy;
  }
  async auth(email, password) {
    if (!email) throw new MissingParamError("email");
    if (!password) throw new MissingParamError("password");
    if (!this.loadUserByEmailRepositorySpy)
      throw new MissingParamError("loadUserByEmailRepositorySpy");
    if (!this.loadUserByEmailRepositorySpy.load)
      throw new InvalidParamError("loadUserByEmailRepositorySpy");
    const user = await this.loadUserByEmailRepositorySpy.load(email);
    if (!user) return null;
  }
};
