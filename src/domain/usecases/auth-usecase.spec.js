const { MissingParamError } = require("../../utils/errors");
const AuthUseCase = require("./auth-usecase");

const makeEcrypter = () => {
  class EncrypterSpy {
    async compare(password, hashedPassword) {
      this.password = password;
      this.hashedPassword = hashedPassword;
      return this.isValid;
    }
  }
  const encrypterSpy = new EncrypterSpy();
  encrypterSpy.isValid = true;
  return encrypterSpy;
};

const makeEcrypterWithError = () => {
  class EncrypterSpy {
    async compare() {
      throw new Error();
    }
  }
  return new EncrypterSpy();
};

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate(userId) {
      this.userId = userId;
      return this.accessToken;
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy();
  tokenGeneratorSpy.accessToken = "any_token";
  return tokenGeneratorSpy;
};

const makeTokenGeneratorWithError = () => {
  class TokenGeneratorSpy {
    async generate() {
      throw new Error();
    }
  }
  return new TokenGeneratorSpy();
};

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email;
      return this.user;
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
  loadUserByEmailRepositorySpy.user = {
    id: "any_id",
    password: "hashed_password",
  };
  return loadUserByEmailRepositorySpy;
};

const makeLoadUserByEmailRepositoryWithError = () => {
  class LoadUserByEmailRepositorySpy {
    async load() {
      throw new Error();
    }
  }
  return new LoadUserByEmailRepositorySpy();
};

const makeUpdateAccessTokenRepository = () => {
  class UpdateAccessTokenRepositorySpy {
    async update(userId, accessToken) {
      this.userId = userId;
      this.accessToken = accessToken;
    }
  }
  return new UpdateAccessTokenRepositorySpy();
};

const makeUpdateAccessTokenRepositoryWithError = () => {
  class UpdateAccessTokenRepositoryWithErro {
    async compare() {
      throw new Error();
    }
  }
  return new UpdateAccessTokenRepositoryWithErro();
};

const makeSut = () => {
  const encrypterSpy = makeEcrypter();
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository();
  const tokenGeneratorSpy = makeTokenGenerator();
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepository();
  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy,
  });
  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy,
  };
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

  test("Should return null if an invalid email is provided", async () => {
    // Not found a user in the repository
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    loadUserByEmailRepositorySpy.user = null;
    const accessToken = await sut.auth(
      "invalid_email@mail.com",
      "any_password"
    );
    expect(accessToken).toBeNull();
  });

  test("Should return null if an invalid password is provided", async () => {
    // Not found a user in the repository
    const { sut, encrypterSpy } = makeSut();
    encrypterSpy.isValid = false;
    const accessToken = await sut.auth(
      "valid_email@mail.com",
      "invalid_password"
    );
    expect(accessToken).toBeNull();
  });

  test("Should call Encrypter with correct values", async () => {
    // Not found a user in the repository
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut();
    await sut.auth("valid_email@mail.com", "any_password");
    expect(encrypterSpy.password).toBe("any_password");
    expect(encrypterSpy.hashedPassword).toBe(
      loadUserByEmailRepositorySpy.user.password
    );
  });

  test("Should call TokenGenerator with correct userId", async () => {
    // Not found a user in the repository
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut();
    await sut.auth("valid_email@mail.com", "valid_password");
    expect(tokenGeneratorSpy.userId).toBe(
      loadUserByEmailRepositorySpy.user._id
    );
  });

  test("Should call UpdateAccessTokenRepository with correct values", async () => {
    // Not found a user in the repository
    const {
      sut,
      loadUserByEmailRepositorySpy,
      updateAccessTokenRepositorySpy,
      tokenGeneratorSpy,
    } = makeSut();
    await sut.auth("valid_email@mail.com", "valid_password");
    expect(updateAccessTokenRepositorySpy.userId).toBe(
      loadUserByEmailRepositorySpy.user._id
    );
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(
      tokenGeneratorSpy.accessToken
    );
  });

  test("Should return an accessToken if correct credentials are provided", async () => {
    // Not found a user in the repository
    const { sut, tokenGeneratorSpy } = makeSut();
    const accessToken = await sut.auth(
      "valid_email@mail.com",
      "valid_password"
    );
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken);
    expect(accessToken).toBeTruthy();
  });

  test("Should throw if invalid dependencies are provided", () => {
    const invalid = {};
    const loadUserByEmailRepository = makeLoadUserByEmailRepository();
    const encrypter = makeEcrypter();
    const tokenGenerator = makeTokenGenerator();
    const suts = [].concat(
      new AuthUseCase(),
      new AuthUseCase({
        loadUserByEmailRepository: null,
        encrypter: null,
        tokenGenerator: null,
      }),
      new AuthUseCase({
        loadUserByEmailRepository: invalid,
        encrypter: null,
        tokenGenerator: null,
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter: null,
        tokenGenerator: null,
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter: invalid,
        tokenGenerator: null,
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: null,
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: invalid,
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator,
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepository: invalid,
      })
    );
    for (const sut of suts) {
      const promise = sut.auth("any_email@mail.com", "any_password");
      expect(promise).rejects.toThrow();
    }
  });

  test("Should throw if any dependency throws", () => {
    const loadUserByEmailRepository = makeLoadUserByEmailRepository();
    const encrypter = makeEcrypter();
    const tokenGenerator = makeTokenGenerator();
    const suts = [].concat(
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError(),
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter: makeEcrypterWithError(),
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: makeTokenGeneratorWithError(),
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepository: makeUpdateAccessTokenRepositoryWithError(),
      })
    );
    for (const sut of suts) {
      const promise = sut.auth("any_email@mail.com", "any_password");
      expect(promise).rejects.toThrow();
    }
  });
});
