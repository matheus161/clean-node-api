const { MissingParamError } = require("../../utils/errors");

class AuthUseCase {
  async auth(email) {
    if (!email) throw new MissingParamError("email");
  }
}

describe("Auth UseCase", () => {
  test("Should throw if no email is provided", () => {
    // Jest não aceita com async, precisa usar promise
    const sut = new AuthUseCase();
    const promise = sut.auth();
    expect(promise).rejects.toThrow(new MissingParamError("email"));
  });
});
