const db = require("../db/connection");

exports.selectUsers = async () => {
  const sqlQuery = "SELECT * FROM users;";
  const users = await db.query(sqlQuery);
  return users.rows;
};

exports.selectUserById = async (user_id) => {
  const sqlQuery = `SELECT * FROM users WHERE user_id = $1;`;
  const user = await db.query(sqlQuery, [user_id]);
  return user.rows[0];
};

exports.selectUserRoutes = async (user_id) => {
  const sqlQuery = `
        SELECT users.username, user_routes.route_address, user_routes.carbon_usage, user_routes.route_distance 
        FROM users
        JOIN user_routes ON users.user_id = user_routes.user_id 
        WHERE users.user_id = $1;
    `;

  try {
    const routes = await db.query(sqlQuery, [user_id]);
    return routes.rows;
  } catch (error) {
    console.error("Error fetching user routes:", error);
    throw error;
  }
};

exports.selectRouteById = async () => {};

exports.makeUser = async (newUser) => {
  const sqlQuery = `
        INSERT INTO users (name, username, profile_url)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
  try {
    const {name, username, profile_url} = newUser
    const user = await db.query(sqlQuery, [name, username, profile_url]);
    return user.rows[0];
  } catch (error) {
    console.error("Error making new user:", error);
    throw error;
  }
};

exports.makeUserRoute = async (user_id, newRouteInfo) => {
    const sqlQuery = `
    INSERT INTO user_routes (user_id, route_address, carbon_usage, route_distance) VALUES ($1, $2, $3, $4)
    RETURNING *`
    
    try {const {route_address, carbon_usage, route_distance} = newRouteInfo
    const user_route = await db.query(sqlQuery, [user_id, route_address, carbon_usage, route_distance]);
    return user_route.rows[0]
    } catch (error){
        console.error("Error adding new route:",error);
        throw error;
    }
};

exports.changeUser = async (user_id, name, username, profile_url) => {
  if (name === undefined && username === undefined && profile_url === undefined) {
    return Promise.reject({status: 400, msg: "Bad request: you need to include changes to your user profile"})
  }
  let sqlQuery = `UPDATE users`
  let queryValues = [user_id]
  if (name) {
    queryValues.push(name)
    sqlQuery += ` SET name = $2`
  }
  if (username) {
    queryValues.push(username)
    sqlQuery += ` SET username = $3`
  }
  if (profile_url) {
    queryValues.push(profile_url)
    sqlQuery += ` SET profile_url = $4`
  }
  sqlQuery += ` WHERE user_id = $1 RETURNING *;`
  const updatedUserInfo = await db.query(sqlQuery, queryValues)
  return updatedUserInfo.rows[0]
};

exports.changeUserRoute = async () => {};

exports.removeUser = async () => {};

exports.removeUserRoute = async () => {};
