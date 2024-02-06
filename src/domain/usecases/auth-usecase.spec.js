const { MissingParamError } = require("../../utils/errors");

class AuthUseCase {
  async auth(email, password) {
    if (!email) throw new MissingParamError("email");
    if (!password) throw new MissingParamError("password");
  }
}

describe("Auth UseCase", () => {
  test("Should throw if no email is provided", () => {
    // Jest não aceita com async, precisa usar promise
    const sut = new AuthUseCase();
    const promise = sut.auth();
    expect(promise).rejects.toThrow(new MissingParamError("email"));
  });

  test("Should throw if no password is provided", () => {
    // Jest não aceita com async, precisa usar promise
    const sut = new AuthUseCase();
    const promise = sut.auth("any_email@mail.com");
    expect(promise).rejects.toThrow(new MissingParamError("password"));
  });
});
