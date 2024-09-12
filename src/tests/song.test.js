const app = require("../app");
const request = require("supertest");

let token;
let id;

beforeAll(async () => {
  const credentials = {
    email: "testemail2@.com",
    password: "test1234",
  };
  const res = await request(app).post("/users/login").send(credentials);
  token = res.body.token;
});

test("Get /songs debe crear todos las canciones", async () => {
  const res = await request(app).get("/songs");
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test("POST /songs debe crear las canciones", async () => {
  const newSong = {
    name: "test name",
    artist: "test artist",
    genre: "test",
    lyric: "Lyric test",
    url: "url.com",
  };

  const res = await request(app)
    .post("/songs")
    .send(newSong)
    .set("Authorization", `Bearer ${token}`);
  id = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
  expect(res.body.name).toBe(newSong.name);
});

test("DELETE /songs/:id debe eliminar un usuario", async () => {
  const res = await request(app)
    .delete(`/songs/${id}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
