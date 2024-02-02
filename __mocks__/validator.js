// Arquivo que faz o mock para lib para checara integração
// o Jest reconhece de forma automática
module.exports = {
  isEmailValid: true,
  email: "",

  isEmail(email) {
    this.email = email;
    return this.isEmailValid;
  },
};
