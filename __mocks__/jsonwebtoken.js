module.exports = {
  token: "any_token",
  id: "",
  secret: "",
  sign(payload, secret) {
    this.payload = payload;
    this.secret = secret;
    return this.token;
  },
};
