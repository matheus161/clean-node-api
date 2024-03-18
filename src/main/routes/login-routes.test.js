const request = require("supertest");
const app = require("../config/app");
const MongoHelper = require("../../infra/helpers/mongo-helper");
let userModel;

describe("Login Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    userModel = await MongoHelper.getCollection("users");
  });

  beforeEach(async () => {
    await userModel.deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test("Should return 200 when valid credentials are provided", async () => {
    const hashedPassword =
      "$2b$10$qHItJuIpat8QGH40JwCaNurvPz0/1Yl6AGeaGivd337byi6Jdtk8S";

    await userModel.insertOne({
      email: "valid_email@mail.com",
      password: hashedPassword,
    });
    await request(app)
      .post("/api/login")
      .send({
        email: "valid_email@mail.com",
        password: "12345678",
      })
      .expect(200);
  });

  test("Should return 401 when invalid credentials are provided", async () => {
    await request(app)
      .post("/api/login")
      .send({
        email: "valid_email@mail.com",
        password: "hashed_password",
      })
      .expect(401);
  });
});
