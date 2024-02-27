const { MongoClient } = require("mongodb");
let client, db;

class LoadUserByEmailRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async load(email) {
    const user = this.userModel.findOne(
      { email },
      {
        projection: {
          password: 1,
        },
      }
    );
    return user;
  }
}

const makeSut = () => {
  const userModel = db.collection("users");
  const sut = new LoadUserByEmailRepository(userModel);
  return { userModel, sut };
};

describe("LoadUserByEmail Repository", () => {
  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = client.db();
  });

  beforeEach(async () => {
    await userModel.deleteMany();
  });

  afterAll(async () => {
    await client.close();
  });

  test("should return null if no user is found", async () => {
    const { sut } = makeSut();
    const user = await sut.load("invalid_email@email.com");
    expect(user).toBeNull();
  });

  test("should return an user if user is found", async () => {
    const { sut, userModel } = makeSut();
    const fakeUser = await userModel.insertOne({
      email: "valid_email@email.com",
      name: "any_name",
      password: "hashed_password",
    });
    const user = await sut.load("valid_email@email.com");
    expect(user).toEqual({
      _id: fakeUser.ops[0]._id,
      password: fakeUser.ops[0].password,
    });
  });
});
