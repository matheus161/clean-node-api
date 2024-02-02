// Arquivo que faz o mock para lib para checara integração
// o Jest reconhece de forma automática
module.exports = {
  isEmailValid: true,
  isEmail(email) {
    return this.isEmailValid;
  },
};
