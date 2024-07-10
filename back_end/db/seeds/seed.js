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
          username VARCHAR(50) NOT NULL,
          name VARCHAR(50) NOT NULL,
          profile_url VARCHAR,
          total_routes INT DEFAULT 0 NOT NULL,
          total_carbon FLOAT DEFAULT 0 NOT NULL,
          password VARCHAR(20) CHECK (LENGTH(password) >= 6) NOT NULL
        );`);

      return usersTablePromise.then(() => {
        return db.query(`
          CREATE TABLE user_routes (
            route_id SERIAL PRIMARY KEY,
            user_id INT,
            origin_address VARCHAR(100) NOT NULL,
            destination_address VARCHAR(100) NOT NULL,
            origin_lat FLOAT,
            origin_long FLOAT,
            destination_lat FLOAT,
            destination_long FLOAT,
            carbon_usage FLOAT DEFAULT 0 NOT NULL,
            route_distance VARCHAR(50) DEFAULT 0 NOT NULL,
            mode_of_transport VARCHAR(50) NOT NULL,
            route_time VARCHAR(50) NOT NULL
          );`);
      });
    })
    .then(() => {
      const insertUsersQueryStr = format(
        "INSERT INTO users (username, name, profile_url, total_routes, total_carbon, password) VALUES %L;",
        usersData.map(
          ({
            username,
            name,
            profile_url,
            total_routes,
            total_carbon,
            password,
          }) => [
            username,
            name,
            profile_url,
            total_routes,
            total_carbon,
            password,
          ]
        )
      );
      const usersPromise = db.query(insertUsersQueryStr);

      const insertUserRoutesQueryStr = format(
        "INSERT INTO user_routes (user_id, origin_address, destination_address, origin_lat, origin_long, destination_lat, destination_long, carbon_usage, route_distance, mode_of_transport, route_time) VALUES %L;",
        userRoutesData.map(
          ({
            user_id,
            origin_address,
            destination_address,
            origin_lat,
            origin_long,
            destination_lat,
            destination_long,
            carbon_usage,
            route_distance,
            mode_of_transport,
            route_time,
          }) => [
            user_id,
            origin_address,
            destination_address,
            origin_lat,
            origin_long,
            destination_lat,
            destination_long,
            carbon_usage,
            route_distance,
            mode_of_transport,
            route_time,
          ]
        )
      );
      const userRoutesPromise = db.query(insertUserRoutesQueryStr);

      return Promise.all([usersPromise, userRoutesPromise]);
    });
};

module.exports = seed;
