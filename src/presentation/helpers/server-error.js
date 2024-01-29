module.exports = class UnauthorizedError extends Error {
  constructor() {
    super("Internal error");
    this.name = "ServerError";
  }
};
