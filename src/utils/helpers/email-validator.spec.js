const MissingParamError = require("../errors/missing-param-error");
const EmailValidator = require("./email-validator");
const validator = require("validator");

const makeSut = () => {
  return new EmailValidator();
};

describe("Email Validator", () => {
  test("Shoul return true if validator returns true", () => {
    const sut = makeSut();
    const isEmailValid = sut.isValid("valid_email@email.com");
    expect(isEmailValid).toBe(true);
  });

  test("Shoul return false if validator returns false", () => {
    // Use the mock version, no worries about mock a data
    validator.isEmailValid = false;
    const sut = makeSut();
    const isEmailValid = sut.isValid("invalid_email@email.com");
    expect(isEmailValid).toBe(false);
  });

  test("Shoul call validator validator with correct email", () => {
    const sut = makeSut();
    sut.isValid("any_email@email.com");
    expect(validator.email).toBe("any_email@email.com");
  });

  test("Should throw if no email is provided", async () => {
    const sut = makeSut();
    expect(() => {
      sut.isValid();
    }).toThrow(new MissingParamError("email"));
  });
});
