const request = require('supertest');
const app = require('./app');
const db = require('./db/connection');
const seed = require('./db/seeds/seed');
const data = require('./db/data/test-data');
require('jest-sorted');

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

// ---------------------------------------------------------------------------------------

describe('404: generic not found error', () => {
  test("404: returns 'not found' when api users endpoint is invalid due to typo or different endpoint received", async () => {
    const response = await request(app).get('/api/user');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('Not Found');
  });
});

// ---------------------------------------------------------------------------------------

describe('GET /api/users', () => {
  test('200: return an array of users', async () => {
    const response = await request(app).get('/api/users');
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

// ---------------------------------------------------------------------------------------

describe('GET /api/users/:user_id', () => {
  test('200, returns specific user information', async () => {
    const response = await request(app).get('/api/users/1');
    expect(response.status).toBe(200);
    const { user } = response.body;
    expect(user).toEqual({
      user_id: 1,
      username: 'mrgreen',
      name: 'Oliver Meadows',
      profile_url:
        'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3870&auto=format&f[…]3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      total_routes: 4,
      total_carbon: 26,
    });
  });

  test('404, error when user_id does not exist but is valid', async () => {
    const response = await request(app).get('/api/users/9999');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('User not found for user_id: 9999');
  });

  test('400, error when user_id is invalid', async () => {
    const response = await request(app).get('/api/users/cheesecake');
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad Request');
  });
});

// ---------------------------------------------------------------------------------------

describe('GET /api/users/:user_id/user_routes', () => {
  test('200: return an array of users saved routes', async () => {
    const response = await request(app).get('/api/users/1/user_routes');
    expect(response.status).toBe(200);
    const { routes } = response.body;
    routes.map((route) => {
      expect(route).toMatchObject({
        username: expect.any(String),
        origin_address: expect.any(String),
        destination_address: expect.any(String),
        carbon_usage: expect.any(Number),
        route_distance: expect.any(String),
        mode_of_transport: expect.any(String),
        route_time: expect.any(String),
      });
    });
  });

  test('404, error when user_id does not exist but is valid', async () => {
    const response = await request(app).get('/api/users/1000/user_routes');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('User not found for user_id: 1000');
  });

  test('400, error when user_id is invalid', async () => {
    const response = await request(app).get(
      '/api/users/cheesecake/user_routes'
    );
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad Request');
  });
});

// ---------------------------------------------------------------------------------------

describe('GET /api/users/:user_id/user_routes/:route_id', () => {
  test('200: return a specific user route', async () => {
    const response = await request(app).get('/api/users/1/user_routes/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      route_id: 1,
      user_id: 1,
      origin_address:
        'Canary Wharf, Underground Ltd, Heron Quays Rd, London E14 4HJ, UK',
      destination_address:
        'Tooting Bec, Underground Ltd, Balham High Rd, London SW17 7AA, UK',
      carbon_usage: 20,
      route_distance: '16,74 km',
      mode_of_transport: 'public_transport',
      route_time: '41 min',
    });
  });

  test('404, error when user_id does not exist but is valid', async () => {
    const response = await request(app).get('/api/users/1000/user_routes/1');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('User not found for user_id: 1000');
  });

  test('400, error when user_id is invalid', async () => {
    const response = await request(app).get(
      '/api/users/cheesecake/user_routes/1'
    );
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad Request');
  });

  test('404, error when route_id does not exist but is valid', async () => {
    const response = await request(app).get('/api/users/1/user_routes/1000');
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('Route not found for route_id: 1000');
  });

  test('400, error when route_id is invalid', async () => {
    const response = await request(app).get(
      '/api/users/1/user_routes/cheesecake'
    );
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad Request');
  });
});

// ---------------------------------------------------------------------------------------

describe('POST /api/users', () => {
  test('201: successfully adds a user', async () => {
    const response = await request(app).post('/api/users').send({
      name: 'Butter_Bridge',
      username: 'hello_butter_bridge',
      profile_url: 'https://google.com',
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      user_id: 5,
      username: 'hello_butter_bridge',
      name: 'Butter_Bridge',
      profile_url: 'https://google.com',
      total_routes: 0,
      total_carbon: 0,
    });
  });

  test('400: when body to send is empty or missing', async () => {
    const response = await request(app).post('/api/users').send({});
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad Request');
  });

  test('400: when body when datatypes are invalid', async () => {
    const response = await request(app).post('/api/users').send({
      name: 500,
      username: 5,
      profile_url: 5,
    });
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad request: invalid data format');
  });
});

// ---------------------------------------------------------------------------------------

describe('POST /api/users/:user_id/user_routes', () => {
  test('201: successfully adds a user route', async () => {
    const response = await request(app).post('/api/users/1/user_routes').send({
      origin_address:
        'Battersea Power Station, Circus Rd W, Nine Elms, London SW11 8DD, UK',
      destination_address: 'Tower Bridge, Tower Bridge Rd, London SE1 2UP, UK',
      carbon_usage: 22, //needs to come from calculation in front end (API/hard coded)
      route_distance: '6,8 km', //needs to come from gmaps api call
      mode_of_transport: 'public_transport',
      route_time: '45 mins',
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      user_id: 1,
      origin_address:
        'Battersea Power Station, Circus Rd W, Nine Elms, London SW11 8DD, UK',
      destination_address: 'Tower Bridge, Tower Bridge Rd, London SE1 2UP, UK',
      carbon_usage: 22, //needs update after carbon calculation
      route_distance: '6,8 km', //needs update after distance calculation
      mode_of_transport: 'public_transport',
      route_time: '45 mins',
    });
  });

  test('status: 400 if missing part of the body', async () => {
    const unfinishedRoute = {
      carbon_usage: 22, //needs to come from calculation in front end (API/hard coded)
      route_distance: '6,8 km', //needs to come from gmaps api call
    };
    const response = await request(app)
      .post('/api/users/1/user_routes')
      .send(unfinishedRoute)
      .expect(400);
    expect(response.body.msg).toBe(
      'Bad request: must include an origin address, a destination address, carbon usage, route distance, mode of transport and a route time'
    );
  });

  test('status: 400 when the body is invalid', async () => {
    const invalidRoute = {
      origin_address: 1234,
      destination_address: 12,
      carbon_usage: 22, //needs to come from calculation in front end (API/hard coded)
      route_distance: 33, //needs to come from gmaps api call
      mode_of_transport: 'public_transport',
      route_time: '45 mins',
    };
    const response = await request(app)
      .post('/api/users/1/user_routes')
      .send(invalidRoute)
      .expect(400);
    expect(response.body.msg).toBe(
      'Bad request: invalid data format (eg route_address)'
    );
  });

  test('status: 404 when user_id is valid but does not exist', async () => {
    const route = {
      origin_address:
        'Battersea Power Station, Circus Rd W, Nine Elms, London SW11 8DD, UK',
      destination_address: 'Tower Bridge, Tower Bridge Rd, London SE1 2UP, UK',
      carbon_usage: 22, //needs to come from calculation in front end (API/hard coded)
      route_distance: '6,8 km', //needs to come from gmaps api call
      mode_of_transport: 'public_transport',
      route_time: '45 mins',
    };
    const response = await request(app)
      .post('/api/users/9999/user_routes')
      .send(route)
      .expect(404);
    expect(response.body.msg).toBe('User_id does not exist: 9999');
  });

  test('status: 400 if user_id is invalid (e.g., string)', async () => {
    const route = {
      origin_address:
        'Battersea Power Station, Circus Rd W, Nine Elms, London SW11 8DD, UK',
      destination_address: 'Tower Bridge, Tower Bridge Rd, London SE1 2UP, UK',
      carbon_usage: 22, //needs to come from calculation in front end (API/hard coded)
      route_distance: '6,8 km', //needs to come from gmaps api call
      mode_of_transport: 'public_transport',
      route_time: '45 mins',
    };
    const response = await request(app)
      .post('/api/users/string/user_routes')
      .send(route)
      .expect(400);
    expect(response.body.msg).toBe('Bad Request');
  });
});

// ---------------------------------------------------------------------------------------

describe('PATCH /api/users/:user_id', () => {
  test('200: successfully updates one single changeable item of user information', async () => {
    const response = await request(app).patch('/api/users/1').send({
      name: 'Arthur',
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user_id: 1,
      username: 'mrgreen',
      name: 'Arthur',
      profile_url:
        'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3870&auto=format&f[…]3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      total_routes: 4,
      total_carbon: 26,
    });
  });

  test('200: successfully updates multiple items of changeable user information', async () => {
    const response = await request(app).patch('/api/users/1').send({
      name: 'Katie',
      username: 'katie123',
      profile_url: 'https://www.google.com',
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user_id: 1,
      name: 'Katie',
      username: 'katie123',
      profile_url: 'https://www.google.com',
      total_routes: 4,
      total_carbon: 26,
    });
  });

  test('Status 400: responds with an appropriate error message when not changing anything', async () => {
    const response = await request(app)
      .patch('/api/users/1')
      .send({})
      .expect(400);
    expect(response.body.msg).toBe(
      'Bad request: you need to include changes to your user profile'
    );
  });

  test('Status 400: responds with an appropriate error message when passed an invalid type in the body', async () => {
    const updatedUser = {
      name: 1234,
      username: 'katie123',
      profile_url: 'https://www.google.com',
    };
    const response = await request(app).patch('/api/users/1').send(updatedUser);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad request: invalid data format');
  });

  test("Status 404: responds with an appropriate error message when user_id is valid but doesn't exist", async () => {
    const updatedUser = {
      name: 'Katie',
      username: 'katie123',
      profile_url: 'https://www.google.com',
    };
    const response = await request(app)
      .patch('/api/users/9999')
      .send(updatedUser);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('User_id does not exist: 9999');
  });

  test('Status 400: responds with an appropriate error message when user_id is an invalid type', async () => {
    const updatedUser = {
      name: 'Katie',
      username: 'katie123',
      profile_url: 'https://www.google.com',
    };
    const response = await request(app)
      .patch('/api/users/chocolate')
      .send(updatedUser);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad Request');
  });
});

describe('PATCH /api/users/:user_id/users_routes/:route_id', () => {
  test("200: successfully updates user's route (must replace origin or destination address, as well as carbon usage, route distance and route time", async () => {
    const response = await request(app)
      .patch('/api/users/1/user_routes/1')
      .send({
        origin_address:
          'Wembley Arena, Arena Square, Park, Wembley Park, Wembley HA9 0AA, UK',
        carbon_usage: 10.1,
        route_distance: '20,9 km',
        route_time: '1 hour',
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user_id: 1,
      route_id: 1,
      origin_address:
        'Wembley Arena, Arena Square, Park, Wembley Park, Wembley HA9 0AA, UK',
      destination_address:
        'Tooting Bec, Underground Ltd, Balham High Rd, London SW17 7AA, UK',
      carbon_usage: 10.1,
      route_distance: '20,9 km',
      mode_of_transport: 'public_transport',
      route_time: '1 hour',
    });
  });

  test('Status 400: responds with an appropriate error message when not changing anything', async () => {
    const response = await request(app)
      .patch('/api/users/1/user_routes/1')
      .send({})
      .expect(400);
    expect(response.body.msg).toBe(
      'Bad request: you need to include changes to your route'
    );
  });

  test('Status 400: responds with an appropriate error message when passed an invalid type in the body', async () => {
    const response = await request(app)
      .patch('/api/users/1/user_routes/1')
      .send({
        route_address: true,
        carbon_usage: 24,
        route_distance: 17,
      });
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad request: invalid data format');
  });

  test("Status 404: responds with an appropriate error message when user_id is valid but doesn't exist", async () => {
    const response = await request(app)
      .patch('/api/users/9999/user_routes/1')
      .send({
        route_address: 'https://google.com',
        carbon_usage: 24,
        route_distance: 17,
      });
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('User_id does not exist: 9999');
  });

  test("Status 404: responds with an appropriate error message when route_id is valid but doesn't exist", async () => {
    const response = await request(app)
      .patch('/api/users/1/user_routes/9999')
      .send({
        route_address: 'https://google.com',
        carbon_usage: 24,
        route_distance: 17,
      });
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('Route_id does not exist: 9999');
  });

  test("Status 404: responds with an appropriate error message when route_id and user_id are valid but don't exist", async () => {
    const response = await request(app)
      .patch('/api/users/9999/user_routes/9999')
      .send({
        route_address: 'https://google.com',
        carbon_usage: 24,
        route_distance: 17,
      });
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('User_id does not exist: 9999'); // it will check user_id first so will return the error message related to user_id
  });

  test('Status 400: responds with an appropriate error message when user_id is an invalid type', async () => {
    const response = await request(app)
      .patch('/api/users/strawberry/user_routes/1')
      .send({
        route_address: 'https://google.com',
        carbon_usage: 24,
        route_distance: 17,
      });
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad Request');
  });

  test('Status 400: responds with an appropriate error message when route_id is an invalid type', async () => {
    const response = await request(app)
      .patch('/api/users/1/user_routes/icecream')
      .send({
        route_address: 'https://google.com',
        carbon_usage: 24,
        route_distance: 17,
      });
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad Request');
  });
});

describe('DELETE /api/users/:user_id', () => {
  test('204: delete a user', async () => {
    const response = await request(app).delete('/api/users/2');
    expect(response.status).toBe(204);
  });
  test('status: 404 when user_id does not exist', async () => {
    const response = await request(app).delete('/api/users/9999').expect(404);
    expect(response.body.msg).toBe('User not found for user_id: 9999');
  });
  test('status: 400 for invalid requests (eg not a number when searching by user_id)', async () => {
    const response = await request(app).delete('/api/users/invalidId');
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Bad Request');
  });
});

describe('DELETE /api/users/:user_id/user_routes/:route_id', () => {
  test('204: delete a user route', async () => {
    const response = await request(app).delete('/api/users/1/user_routes/2');
    expect(response.status).toBe(204);
  });
  test('status: 404 when user_id does not exist', async () => {
    const response = await request(app)
      .delete('/api/users/9999/user_routes/2')
      .expect(404);
    expect(response.body.msg).toBe('User not found for user_id: 9999');
  });
  test('status: 404 when route_id does not exist', async () => {
    const response = await request(app)
      .delete('/api/users/1/user_routes/9999')
      .expect(404);
    expect(response.body.msg).toBe('Route not found for route_id: 9999');
  });
});
