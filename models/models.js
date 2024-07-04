const db = require("../db/connection");

exports.selectUsers = async () => {
  const sqlQuery = "SELECT * FROM users;";
  const users = await db.query(sqlQuery);
  return users.rows;
};

exports.selectUserById = async (user_id) => {
  const sqlQuery = `SELECT * FROM users WHERE user_id = $1;`;
  const user = await db.query(sqlQuery, [user_id]);
  if (user.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `User_id not found`,
    });
  }
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
    if (routes.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `User_id not found`,
      });
    }
    return routes.rows;
  } catch (error) {
    console.error("Error fetching user routes:", error);
    throw error;
  }
};

exports.selectRouteById = async (user_id, route_id) => {
  try {
    const sqlQuery = `SELECT * from user_routes WHERE user_id = $1 AND route_id = $2;`;
    const queryValues = [user_id, route_id];
    const routeById = await db.query(sqlQuery, queryValues);
    if (routeById.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `User_id or route_id not found`,
      });
    }
    return routeById.rows[0];
  } catch (error) {
    console.error("Error fetching user routes by id:", error);
    throw error;
  }
};

exports.makeUser = async (newUser) => {
  const { name, username, profile_url } = newUser;
  console.log(newUser, "MODEL")
  const sqlQuery = `
        INSERT INTO users (name, username, profile_url)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
  try {
    const user = await db.query(sqlQuery, [name, username, profile_url]);
    console.log(user.rows[0])
    return user.rows[0];
  } catch (error) {
    console.error("Error making new user:", error);
    throw error;
  }
};

exports.makeUserRoute = async (user_id, newRouteInfo) => {
  const sqlQuery = `
    INSERT INTO user_routes (user_id, route_address, carbon_usage, route_distance) VALUES ($1, $2, $3, $4)
    RETURNING *`;

  try {
    const { route_address, carbon_usage, route_distance } = newRouteInfo;
    const user_route = await db.query(sqlQuery, [
      user_id,
      route_address,
      carbon_usage,
      route_distance,
    ]);
    return user_route.rows[0];
  } catch (error) {
    console.error("Error adding new route:", error);
    throw error;
  }
};

exports.changeUser = async (user_id, name, username, profile_url) => {
    if (typeof name === "number") {
        return Promise.reject({
          status: 400,
          msg: "Bad request: name must be a string",
        });
      }
  if (
    name === undefined &&
    username === undefined &&
    profile_url === undefined
  ) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: you need to include changes to your user profile",
    });
  }

  try {
    let sqlQuery = `UPDATE users SET`;
    let setClauses = [];
    let queryValues = [parseIntint(user_id)];
    console.log(queryValues, "NUMBERS")

    if (name) {
      queryValues.push(parseInt(name));
      setClauses.push(`name = $${queryValues.length}`);
    }
    if (username) {
      queryValues.push(parseInt(username));
      setClauses.push(`username = $${queryValues.length}`);
    }
    if (profile_url) {
      queryValues.push(parseInt(profile_url));
      setClauses.push(`profile_url = $${queryValues.length}`);
    }

    sqlQuery += ` ${setClauses.join(", ")} WHERE user_id = $1 RETURNING *;`;

    const updatedUserInfo = await db.query(sqlQuery, queryValues);
    return updatedUserInfo.rows[0];
  } catch (error) {
    console.error("Error changing user information", error);
    throw error;
  }
};

exports.changeUserRoute = async (
  user_id,
  route_id,
  route_address,
  carbon_usage,
  route_distance
) => {
  if (!route_id && !user_id) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: route_id not found - are you signed in?",
    });
  }
  try {
    const sqlQuery = `UPDATE user_routes SET route_address = $3, carbon_usage = $4, route_distance = $5 WHERE route_id = $1 AND user_id = $2 RETURNING *;`;
    const queryValues = [
      user_id,
      route_id,
      route_address,
      carbon_usage,
      route_distance,
    ];
    const updatedRoute = await db.query(sqlQuery, queryValues);
    return updatedRoute.rows[0];
  } catch (error) {
    console.error("Error changing route", error);
  }
};

exports.removeUser = async (user_id) => {
  const sqlQuery = `DELETE FROM users WHERE user_id = $1 RETURNING *;`;
  const queryValues = [user_id];
  const deletedUser = await db.query(sqlQuery, queryValues);
  if (deletedUser.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: `User not found for user_id: ${user_id}`,
    });
  } else {
    return deletedUser.rows[0];
  }
};

exports.removeUserRoute = async (user_id, route_id) => {
  try {
    const sqlQuery = `DELETE FROM user_routes WHERE user_id = $1 AND route_id = $2 RETURNING *;`;
    const queryValues = [user_id, route_id];
    const deletedUser = await db.query(sqlQuery, queryValues);
    if (deletedUser.rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: `User not found for user_id: ${user_id}`,
      });
    } else {
      return deletedUser.rows[0];
    }
  } catch (error) {
    console.error("psql error for deleting route", error);
    throw error;
  }
};
