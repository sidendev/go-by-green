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
          username VARCHAR NOT NULL,
          name VARCHAR NOT NULL,
          profile_url VARCHAR,
          total_routes INT DEFAULT 0 NOT NULL,
          total_carbon INT DEFAULT 0 NOT NULL
        );`);

      return usersTablePromise.then(() => {
        return db.query(`
          CREATE TABLE user_routes (
            route_id SERIAL PRIMARY KEY,
            user_id INT,
            route_address VARCHAR NOT NULL,
            carbon_usage INT DEFAULT 0 NOT NULL,
            route_distance INT DEFAULT 0 NOT NULL
          );`);
      });
    })
    .then(() => {
      const insertUsersQueryStr = format(
        "INSERT INTO users (username, name, profile_url, total_routes, total_carbon) VALUES %L;",
        usersData.map(({ username, name, profile_url, total_routes, total_carbon }) => [
          username,
          name,
          profile_url,
          total_routes,
          total_carbon,
        ])
      );
      const usersPromise = db.query(insertUsersQueryStr);

      const insertUserRoutesQueryStr = format(
        "INSERT INTO user_routes (user_id, route_address, carbon_usage, route_distance) VALUES %L;",
        userRoutesData.map(
          ({user_id, route_address, carbon_usage, route_distance }) => [
            user_id,
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
