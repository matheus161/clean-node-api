class AuthUseCase {
  async auth(email) {
    if (!email) throw new Error();
  }
}

describe("Auth UseCase", () => {
  test("Should throw if no email is provided", () => {
    // Jest não aceita com async, precisa usar promise
    const sut = new AuthUseCase();
    const promise = sut.auth();
    expect(promise).rejects.toThrow();
  });
});
