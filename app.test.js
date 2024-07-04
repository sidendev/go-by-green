const request = require("supertest");
const app = require("./app");
const db = require("./db/connection");
const seed = require("./db/seeds/seed");
const data = require("./db/data/test-data");
require("jest-sorted");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("404: generic not found error", () => {
  test("404: returns 'not found' when api users endpoint is invalid due to typo or different endpoint received", async () => {
    const response = await request(app).get("/api/user");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Not Found");
  });
});

describe("GET /api/users", () => {
  test("200: return an array of users", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    const { users } = response.body;
    expect(users.length).toBeGreaterThan(1);
    users.forEach((user) => {
      expect(user).toMatchObject({
        username: expect.any(String),
        name: expect.any(String),
        profile_url: expect.any(String),
        total_routes: expect.any(Number),
        total_carbon: expect.any(Number),
      });
    });
  });
});

describe("GET /api/users/:user_id", () => {
  test("200, returns specific user information", async () => {
    const response = await request(app).get("/api/users/1");
    expect(response.status).toBe(200);
    const { user } = response.body;
    expect(user).toEqual({
      user_id: 1,
      username: "mrgreen",
      name: "Oliver Meadows",
      profile_url:
        "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3870&auto=format&f[…]3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      total_routes: 10,
      total_carbon: 26,
    });
  });

  test("404, error when user_id does not exist but is valid", async () => {
    const response = await request(app).get("/api/users/9999");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("User_id not found");
  });

  test("400, error when user_id is invalid", async () => {
    const response = await request(app).get("/api/users/cheesecake");
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Bad Request");
  });
});

describe("GET /api/users/:user_id/user_routes", () => {
  test("200: return an array of users saved routes", async () => {
    const response = await request(app).get("/api/users/1/user_routes");
    expect(response.status).toBe(200);
    const { routes } = response.body;
    routes.map((route) => {
      expect(route).toMatchObject({
        username: expect.any(String),
        route_address: expect.any(String),
        carbon_usage: expect.any(Number),
        route_distance: expect.any(Number),
      });
    });
  });

  test("404, error when user_id does not exist but is valid", async () => {
    const response = await request(app).get("/api/users/1000/user_routes");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("User_id not found");
  });

  test("400, error when user_id is invalid", async () => {
    const response = await request(app).get(
      "/api/users/cheesecake/user_routes"
    );
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Bad Request");
  });
});

describe("GET /api/users/:user_id/user_routes/:route_id", () => {
  test("200: return a specific user route", async () => {
    const response = await request(app).get("/api/users/1/user_routes/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      route_id: 1,
      user_id: 1,
      route_address:
        "https://www.google.co.uk/maps/dir/London+Gatwick+Airport+(LGW),+Horley,+Gatwick/London/@51.3419266,-0.4393995,10z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x4875efde7d1f391b:0x59dda4bf018973ff!2m2!1d-0.1820629!2d51.1536621!1m5!1m1!1s0x47d8a00baf21de75:0x52963a5addd52a99!2m2!1d-0.1275862!2d51.5072178!3e3?entry=ttu",
      carbon_usage: 24,
      route_distance: 17,
    });
  });

  test("404, error when user_id does not exist but is valid", async () => {
    const response = await request(app).get("/api/users/1000/user_routes/1");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("User_id or route_id not found");
  });

  test("400, error when user_id is invalid", async () => {
    const response = await request(app).get(
      "/api/users/cheesecake/user_routes/1"
    );
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Bad Request");
  });

  test("404, error when route_id does not exist but is valid", async () => {
    const response = await request(app).get("/api/users/1/user_routes/1000");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("User_id or route_id not found");
  });

  test("400, error when route_id is invalid", async () => {
    const response = await request(app).get(
      "/api/users/1/user_routes/cheesecake"
    );
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Bad Request");
  });
});

describe("POST /api/users", () => {
  test("201: successfully adds a user", async () => {
    const response = await request(app).post("/api/users").send({
      name: "Butter_Bridge",
      username: "hello_butter_bridge",
      profile_url: "https://google.com",
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      user_id: 5,
      username: "hello_butter_bridge",
      name: "Butter_Bridge",
      profile_url: "https://google.com",
      total_routes: 0,
      total_carbon: 0,
    });
  });

  test("400: when body to send is empty or missing", async () => {
    const response = await request(app).post("/api/users").send({});
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Bad Request");
  });

  test("400: when body when datatypes are invalid", async () => {
    const response = await request(app).post("/api/users").send({
      name: 500, //why is number allowed??
      username: 5,
      profile_url: 5,
    });
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Bad request: invalid data format");
  });
});

describe("POST /api/users/:user_id/user_routes", () => {
  test("201: successfully adds a user route", async () => {
    const response = await request(app).post("/api/users/1/user_routes").send({
      route_address: "https://www.google.com",
      carbon_usage: 22, //needs to come from calculation in front end (API/hard coded)
      route_distance: 33, //needs to come from gmaps api call
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      user_id: 1,
      route_address: "https://www.google.com",
      carbon_usage: 22, //needs update after carbon calculation
      route_distance: 33, //needs update after distance calculation
    });
  });

  test("status: 400 if missing part of the body", async () => {
    const unfinishedRoute = {
      carbon_usage: 22, //needs to come from calculation in front end (API/hard coded)
      route_distance: 33, //needs to come from gmaps api call
    };
    const response = await request(app)
      .post("/api/users/1/user_routes")
      .send(unfinishedRoute)
      .expect(400);
    expect(response.body.msg).toBe(
      "Bad request: must include a route address, carbon usage and route distance"
    );
  });

  test("status: 400 when the body is invalid", async () => {
    const invalidRoute = {
      route_address: 1234,
      carbon_usage: 22, //needs to come from calculation in front end (API/hard coded)
      route_distance: 33, //needs to come from gmaps api call
    };
    const response = await request(app)
    .post("/api/users/1/user_routes")
    .send(invalidRoute)
    .expect(400);
    expect(response.body.msg).toBe(
      "Bad request: invalid data format (eg route_address)"
    );
  })
  
  test("status: 404 when user_id is valid but does not exist", async () => {
    const route = {
      route_address: "https://www.google.com",
      carbon_usage: 22, //needs to come from calculation in front end (API/hard coded)
      route_distance: 33, //needs to come from gmaps api call
    };
    const response = await request(app)
      .post("/api/users/9999/user_routes")
      .send(route)
      .expect(404);
    expect(response.body.msg).toBe("User_id does not exist: 9999");
  });


  test("status: 400 if user_id is invalid (e.g., string)", async () => {
    const route = {
      route_address: "https://www.google.com",
      carbon_usage: 22, //needs to come from calculation in front end (API/hard coded)
      route_distance: 33, //needs to come from gmaps api call
    };
    const response = await request(app)
      .post("/api/users/string/user_routes")
      .send(route)
      .expect(400);
    expect(response.body.msg).toBe("Bad Request");
  });

});

// describe("PATCH /api/users/:user_id", () => {
//   test("200: successfully updates one single changeable item of user information", async () => {
//     const response = await request(app).patch("/api/users/1").send({
//       name: "Arthur",
//     });
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual({
//       user_id: 1,
//       username: "mrgreen",
//       name: "Arthur",
//       profile_url:
//         "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3870&auto=format&f[…]3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       total_routes: 10,
//       total_carbon: 26,
//     });
//   });

//   test("200: successfully updates multiple items of changeable user information", async () => {
//     const response = await request(app).patch("/api/users/1").send({
//       name: "Katie",
//       username: "katie123",
//       profile_url: "https://www.google.com",
//     });
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual({
//       user_id: 1,
//       name: "Katie",
//       username: "katie123",
//       profile_url: "https://www.google.com",
//       total_routes: 10,
//       total_carbon: 26,
//     });
//   });
// });

// describe("PATCH /api/users/:user_id/users_routes/:route_id", () => {
//   test("200: successfully updates user routes", async () => {
//     const response = await request(app)
//       .patch("/api/users/1/user_routes/1")
//       .send({
//         route_address: "https://google.com",
//         carbon_usage: 24,
//         route_distance: 17,
//       });
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual({
//       route_id: 1,
//       user_id: 1,
//       route_address: "https://google.com",
//       carbon_usage: 24,
//       route_distance: 17,
//     });
//   });
// });

// describe("DELETE /api/users/:user_id", () => {
//   test("204: delete a user", async () => {
//     const response = await request(app).delete("/api/users/2");
//     expect(response.status).toBe(204);
//   });
// });

// describe("DELETE /api/users/:user_id/user_routes/:route_id", () => {
//   test("204: delete a user route", async () => {
//     const response = await request(app).delete("/api/users/1/user_routes/2");
//     expect(response.status).toBe(204);
//   });
// });
