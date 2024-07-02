const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
require("jest-sorted");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("404: generic not found error", () => {
  test("404: returns 'not found' when api users endpoint is invalid due to typo or different endpoint received", async () => {
    const response = request(app).get("/api/user");
    expect(404);
    (({ body }) => expect(body.msg).toBe("Not Found"));
  });
});

describe("GET /api/users", () => {
  test("200: return an array of users", async () => {
    const response = await request(app).get("/api/users");
    expect(200);
    (({ body }) => {
      expect(body.users.length).toBeGreaterThan(1);
      const { users } = body;
      users.forEach((user) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          profile_url: expect.any(String),
          total_routes: expect.any(Number),
          total_carbon: expect.any(Number)
        });
      });
    });
  });
});




describe("GET /api/users/:user_id", () => {
    test("200, returns specific user information", async () => {
        const response = request(app).get("/api/users/1");
        expect(200);
        (({body}) => {
            expect(body.user).toEqual({
              username: 'mrgreen',
              name: 'Oliver Meadows',
              profile_url:
                'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3870&auto=format&f[…]3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              total_routes: 10,
              total_carbon: 26
            })
        })
    })
})

describe("GET /api/users/:user_id/users_routes", () => {
  test("200: return an array of users saved routes", async () => {
    const response = await request(app).get("/api/users/1/users_routes");
    expect(200);
    (({ body }) => {
      const { users_routes } = body;
      users_routes.forEach((user_route) => {
        expect(user_route).toMatchObject({
          route_address: 'https://www.google.co.uk/maps/dir/London+Gatwick+Airport+(LGW),+Horley,+Gatwick/London/@51.3419266,-0.4393995,10z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x4875efde7d1f391b:0x59dda4bf018973ff!2m2!1d-0.1820629!2d51.1536621!1m5!1m1!1s0x47d8a00baf21de75:0x52963a5addd52a99!2m2!1d-0.1275862!2d51.5072178!3e3?entry=ttu',
          carbon_usage: 24,
          route_distance: 17
        });
      });
    });
  });
});

describe("GET /api/users/:user_id/users_routes/:saved_user_route", () => {
  test("200: return a specific user route", async () => {
    const response = await request(app).get("/api/users/1/users_routes/1");
    expect(200);
      (({body}) => {
        expect(body.user_route).toEqual({
        route_address: 'https://www.google.co.uk/maps/dir/London+Gatwick+Airport+(LGW),+Horley,+Gatwick/London/@51.3419266,-0.4393995,10z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x4875efde7d1f391b:0x59dda4bf018973ff!2m2!1d-0.1820629!2d51.1536621!1m5!1m1!1s0x47d8a00baf21de75:0x52963a5addd52a99!2m2!1d-0.1275862!2d51.5072178!3e3?entry=ttu',
        carbon_usage: 24,
        route_distance: 17
        })
    })
    });
});

describe("POST /api/users", () => {
  test("201: successfully adds a user", async () => {
    const response = await request(app).post("/api/users");
    expect(201);
    send({
      name: "Butter_Bridge",
      username: "hello_butter_bridge",
      profile_url: "https://google.com",
    });
    (({body}) => {
      expect(body.user).toEqual({
        username: "hello_butter_bridge",
          name: "Butter_Bridge",
          profile_url: "https://google.com",
          total_routes: 0,  // needs update after carbon calculation
          total_carbon: 0
      })
  })
  });
});

describe("POST /api/users/:user_id/users_routes", () => {
  test("201: successfully adds a user route", async () => {
    const response = await request(app).post("/api/users/1/users_routes");
    expect(201);
    send({
      route_address: 'https://www.google.com',
    });
    (({body}) => {
      expect(body.user).toEqual({
        route_address: 'https://www.google.com',
        carbon_usage: 40,   //needs update after carbon calculation
        route_distance: 23  //needs update after distance calculation
      })
  })
  });
});

describe("PATCH /api/users/:user_id", () => {
  test("200: successfully updates user information", async () => {
    const response = await request(app).patch("/api/users/1");
    expect(200);
    send({
      name: 'Arthur'
    });
    (({body}) => {
      expect(body.user).toEqual({
              username: 'mrgreen',
              name: 'Arthur',
              profile_url:
                'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3870&auto=format&f[…]3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              total_routes: 10,
              total_carbon: 26
      });
  })
  });
});


describe("PATCH /api/users/:user_id/users_routes/:saved_user_route", () => {
  test("200: successfully updates user routes", async () => {
    const response = await request(app).patch("/api/users/1/users_routes");
    expect(200);
    send({
      route_address: "https://google.com"
    });
    (({body}) => {
      expect(body.user_route).toEqual({
        route_address: 'https://google.com',
        carbon_usage: 24,
        route_distance: 17
      });
  })
  });
});

describe("DELETE /api/users/:user_id", () => {
  test("204: delete a user", async () => {
    const response = await request(app).delete("/api/users/2");
    expect(204);
  });
});

describe("DELETE /api/users/:user_id/users_routes/:saved_user_route", () => {
  test("204: delete a user route", async () => {
    const response = await request(app).delete("/api/users/2/users_routes/2");
    expect(204);
  });
});