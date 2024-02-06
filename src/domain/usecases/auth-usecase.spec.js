const { MissingParamError, InvalidParamError } = require("../../utils/errors");

class AuthUseCase {
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
    await this.loadUserByEmailRepositorySpy.load(email);
  }
}

const makeSut = () => {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email;
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy);
  return { sut, loadUserByEmailRepositorySpy };
};

describe("Auth UseCase", () => {
  test("Should throw if no email is provided", () => {
    // Jest não aceita com async, precisa usar promise
    const { sut } = makeSut();
    const promise = sut.auth();
    expect(promise).rejects.toThrow(new MissingParamError("email"));
  });

  test("Should throw if no password is provided", () => {
    // Jest não aceita com async, precisa usar promise
    const { sut } = makeSut();
    const promise = sut.auth("any_email@mail.com");
    expect(promise).rejects.toThrow(new MissingParamError("password"));
  });

  test("Should call LoadUserByEmailRepository with correct email", async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    await sut.auth("any_email@mail.com", "any_password");
    expect(loadUserByEmailRepositorySpy.email).toBe("any_email@mail.com");
  });

  test("Should throw if no LoadUserByEmailRepositorySpy is provided", () => {
    const sut = new AuthUseCase();
    const promise = sut.auth("any_email@mail.com", "any_password");
    expect(promise).rejects.toThrow(
      new MissingParamError("loadUserByEmailRepositorySpy")
    );
  });

  test("Should throw if no LoadUserByEmailRepositorySpy has no load method", () => {
    const sut = new AuthUseCase({});
    const promise = sut.auth("any_email@mail.com", "any_password");
    expect(promise).rejects.toThrow(
      new InvalidParamError("loadUserByEmailRepositorySpy")
    );
  });
});
