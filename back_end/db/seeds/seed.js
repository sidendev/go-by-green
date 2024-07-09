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
          username TEXT NOT NULL,
          name TEXT NOT NULL,
          profile_url TEXT,
          total_routes INT DEFAULT 0 NOT NULL,
          total_carbon INT DEFAULT 0 NOT NULL,
          password VARCHAR NOT NULL
        );`);

      return usersTablePromise.then(() => {
        return db.query(`
          CREATE TABLE user_routes (
            route_id SERIAL PRIMARY KEY,
            user_id INT,
            route_address VARCHAR NOT NULL,
            carbon_usage INT DEFAULT 0 NOT NULL,
            route_distance INT DEFAULT 0 NOT NULL,
            mode_of_transport VARCHAR NOT NULL
          );`);
      });
    })
    .then(() => {
      const insertUsersQueryStr = format(
        "INSERT INTO users (username, name, profile_url, total_routes, total_carbon, password) VALUES %L;",
        usersData.map(({ username, name, profile_url, total_routes, total_carbon, password }) => [
          username,
          name,
          profile_url,
          total_routes,
          total_carbon,
          password,
        ])
      );
      const usersPromise = db.query(insertUsersQueryStr);

      const insertUserRoutesQueryStr = format(
        "INSERT INTO user_routes (user_id, route_address, carbon_usage, route_distance, mode_of_transport) VALUES %L;",
        userRoutesData.map(
          ({user_id, route_address, carbon_usage, route_distance, mode_of_transport }) => [
            user_id,
            route_address,
            carbon_usage,
            route_distance,
            mode_of_transport,
          ]
        )
      );
      const userRoutesPromise = db.query(insertUserRoutesQueryStr);


      return Promise.all([usersPromise, userRoutesPromise]);
    });
};

module.exports = seed;
