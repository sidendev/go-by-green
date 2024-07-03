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
    INSERT INTO user_routes (user_id, route_address) VALUES ($1, $2)
    RETURNING *`
    
    try {const {route_address} = newRouteInfo
    const user_route = await db.query(sqlQuery, [user_id, route_address]);
    } catch (error){
        console.errer("Error adding new route:",error);
        throw error;
    }
};

exports.changeUser = async () => {};

exports.changeUserRoute = async () => {};

exports.removeUser = async () => {};

exports.removeUserRoute = async () => {};
