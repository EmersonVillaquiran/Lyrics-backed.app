const sequelize = require("../utils/connection");
const request = require("supertest");
const app = require("../app");

const main = async () => {
  try {
    // Acciones a ejecutar antes de los tests
    sequelize.sync();

    const testUser = {
      firstName: "test user",
      lastName: "test user",
      email: "testemail2@.com",
      password: "test1234",
    };

    await request(app).post("/users").send(testUser);

    process.exit();
  } catch (error) {
    console.log(error);
  }
};

main();
