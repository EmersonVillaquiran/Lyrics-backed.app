const app = require("../app");
const request = require("supertest");

let id;
let token;

test("POST /users debe crear un usuario", async () => {
  const newUsar = {
    firstName: "test user",
    lastName: "test user",
    email: "testemail@.com",
    password: "test1234",
  };
  const res = await request(app).post("/users").send(newUsar);
  id = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
  expect(res.body.firstName).toBe(newUsar.firstName);
});

test("POST /users/login debe loggear al usuario", async () => {
  const credentials = {
    email: "testemail@.com",
    password: "test1234",
  };
  const res = await request(app).post("/users/login").send(credentials);
  token = res.body.token;
  expect(res.status).toBe(200);
  expect(res.body.token).toBeDefined();
  expect(res.body.user.email).toBe(credentials.email);
});

test("Get /users debe crear todos los usuarios", async () => {
  const res = await request(app)
    .get("/users")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test("POST /users/login con credenciales incorrectas debe dar error", async () => {
  const credentials = {
    email: "testincorrectos@.com",
    password: "incorrecto1234",
  };
  const res = await request(app).post("/users/login").send(credentials);
  expect(res.status).toBe(401);
});

test("DELETE /users/:id debe eliminar un usuario", async () => {
  const res = await request(app)
    .delete(`/users/${id}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
