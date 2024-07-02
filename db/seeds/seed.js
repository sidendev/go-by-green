const format = require("pg-format");
const db = require("../connection");

const seed = ({ usersData, userRoutesData }) => {
  return db
    .query(`DROP TABLE IF EXISTS user_routes;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      const usersTablePromise = db.query(`
      CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR,
        name VARCHAR,
        profile_url VARCHAR,
        total_routes INT DEFAULT 0 NOT NULL,
        total_carbon INT DEFAULT 0 NOT NULL
      );`);

      const userRoutesTablePromise = db.query(`
      CREATE TABLE user_routes (
        route_id SERIAL PRIMARY KEY,
        route_address VARCHAR,
        carbon_usage INT DEFAULT 0 NOT NULL,
        route_distance INT DEFAULT 0 NOT NULL
      );`);

      return Promise.all([userRoutesTablePromise, usersTablePromise]);
    })
    .then(() => {
      const insertUsersQueryStr = format(
        "INSERT INTO users ( username, name, profile_url, total_routes, total_carbon  ) VALUES %L;",
        usersData.map(
          ({
            username,
            name,
            profile_url,
            total_routes,
            total_carbon,
          }) => [username, name, profile_url, total_routes, total_carbon]
        )
      );
      const usersPromise = db.query(insertUsersQueryStr);

      const insertUserRoutesQueryStr = format(
        "INSERT INTO user_routes ( route_address, carbon_usage, route_distance) VALUES %L;",
        userRoutesData.map(
          ({ route_address, carbon_usage, route_distance }) => [
            route_address,
            carbon_usage,
            route_distance,
          ]
        )
      );
      const userRoutesPromise = db.query(insertUserRoutesQueryStr);

      return Promise.all([usersPromise, userRoutesPromise]);
    });
};

module.exports = seed;
