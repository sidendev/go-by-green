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
      msg: `User not found for user_id: ${user_id}`,
    });
  }
  return user.rows[0];
};

exports.selectUserRoutes = async (user_id) => {
  const sqlQuery = `
        SELECT users.username, user_routes.origin_address, user_routes.destination_address, user_routes.carbon_usage, user_routes.route_distance, user_routes.mode_of_transport, user_routes.route_time 
        FROM users
        JOIN user_routes ON users.user_id = user_routes.user_id 
        WHERE users.user_id = $1;
    `;

  try {
    const routes = await db.query(sqlQuery, [user_id]);
    if (routes.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `User not found for user_id: ${user_id}`,
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
    const userCheckQuery = 'SELECT * FROM users WHERE user_id = $1;';
    const userCheckResult = await db.query(userCheckQuery, [user_id]);
    if (userCheckResult.rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: `User not found for user_id: ${user_id}`,
      });
    }

    const routeCheckQuery = 'SELECT * FROM user_routes WHERE user_id = $1 AND route_id = $2;';
    const routeCheckResult = await db.query(routeCheckQuery, [user_id, route_id]);
    if (routeCheckResult.rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: `Route not found for route_id: ${route_id}`,
      });
    }

    return routeCheckResult.rows[0];
  } catch (error) {
    console.error("Error fetching user routes by id:", error);
    throw error;
  }
};

exports.makeUser = async (name, username, profile_url, password) => {
  if (!name || !username || !profile_url || !password) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (
    typeof name !== "string" ||
    typeof username !== "string" ||
    typeof profile_url !== "string" ||
    typeof password !== "string"
  ) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: invalid data format",
    });
  }

  const sqlQuery = `
        INSERT INTO users (name, username, profile_url, password)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
  try {
    const user = await db.query(sqlQuery, [name, username, profile_url, password]);
    return user.rows[0];
  } catch (error) {
    console.error("Error making new user:", error);
    throw error;
  }
};

exports.makeUserRoute = async (
  user_id,
  route_address,
  carbon_usage,
  route_distance,
  mode_of_transport
) => {
  if (!route_address || !carbon_usage || !route_distance || !mode_of_transport) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: must include a route address, carbon usage, route distance and mode of transport",
    });
  }
  if (
    typeof route_address !== "string" ||
    typeof carbon_usage !== "number" ||
    typeof route_distance !== "number" ||
    typeof mode_of_transport!== "string"
  ) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: invalid data format (eg route_address)",
    });
  }

  const checkUser = await db.query(`SELECT * FROM users WHERE user_id = $1;`, [
    user_id,
  ]);
  if (!checkUser.rows.length) {
    return Promise.reject({
      status: 404,
      msg: `User_id does not exist: ${user_id}`,
    });
  }

  const sqlQuery = `
    INSERT INTO user_routes (user_id, route_address, carbon_usage, route_distance, mode_of_transport) VALUES ($1, $2, $3, $4, $5)
    RETURNING *`;

  try {
    const user_route = await db.query(sqlQuery, [
      user_id,
      route_address,
      carbon_usage,
      route_distance,
      mode_of_transport,
    ]);
    return user_route.rows[0];
  } catch (error) {
    console.error("Error adding new route:", error);
    throw error;
  }
};

exports.changeUser = async (user_id, name, username, profile_url, password) => {
  if (!name && !username && !profile_url && !password) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: you need to include changes to your user profile",
    });
  }

  const checkUser = await db.query(`SELECT * FROM users WHERE user_id = $1;`, [
    user_id,
  ]);

  if (!checkUser.rows.length) {
    return Promise.reject({
      status: 404,
      msg: `User_id does not exist: ${user_id}`,
    });
  }

  if (
    (name && typeof name !== "string") ||
    (username && typeof username !== "string") ||
    (profile_url && typeof profile_url !== "string") ||
    (password && typeof password !== "string")
  ) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: invalid data format",
    });
  }

  try {
    const sqlQuery = `
      UPDATE users
      SET
        name = COALESCE($2, name),
        username = COALESCE($3, username),
        profile_url = COALESCE($4, profile_url),
        password = COALESCE($5, password)
      WHERE user_id = $1
      RETURNING *;
    `;
    const queryValues = [user_id, name, username, profile_url, password];

    console.log("Executing query:", sqlQuery, "with values:", queryValues);
    const result = await db.query(sqlQuery, queryValues);
    console.log("Query result:", result.rows);

    return result.rows[0];
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
  route_distance,
  mode_of_transport,
) => {
  console.log("Received parameters:", { user_id, route_id, route_address, carbon_usage, route_distance, mode_of_transport });

  if (!route_address && !carbon_usage && !route_distance && !mode_of_transport) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: you need to include changes to your user profile",
    });
  }

  const checkUser = await db.query(`SELECT * FROM users WHERE user_id = $1;`, [user_id]);
  if (!checkUser.rows.length) {
    return Promise.reject({
      status: 404,
      msg: `User_id does not exist: ${user_id}`,
    });
  }

  const checkRoute = await db.query(`SELECT * FROM user_routes WHERE route_id = $1;`, [route_id]);
  if (!checkRoute.rows.length) {
    return Promise.reject({
      status: 404,
      msg: `Route_id does not exist: ${route_id}`,
    });
  }

  if (
    (route_address && typeof route_address !== "string") ||
    (carbon_usage && typeof carbon_usage !== "number") ||
    (route_distance && typeof route_distance !== "number") ||
    (mode_of_transport && typeof mode_of_transport !== "string")
  ) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: invalid data format",
    });
  }

  try {
    const sqlQuery = `
      UPDATE user_routes
      SET
        route_address = COALESCE($3, route_address),
        carbon_usage = COALESCE($4, carbon_usage),
        route_distance = COALESCE($5, route_distance),
        mode_of_transport = COALESCE($6, mode_of_transport)
      WHERE route_id = $1 AND user_id = $2
      RETURNING *;
    `;
    const queryValues = [user_id, route_id, route_address, carbon_usage, route_distance, mode_of_transport];

    console.log("Executing query:", sqlQuery, "with values:", queryValues);
    const updatedRoute = await db.query(sqlQuery, queryValues);
    console.log("Query result:", updatedRoute.rows);

    return updatedRoute.rows[0];
  } catch (error) {
    console.error("Error changing route", error);
    throw error;
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
  if (isNaN(route_id)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: route_id must be a number"
    });
  }

  try {
    const userCheckQuery = 'SELECT * FROM users WHERE user_id = $1;';
    const userCheckResult = await db.query(userCheckQuery, [user_id]);
    if (userCheckResult.rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: `User not found for user_id: ${user_id}`,
      });
    }

    const routeCheckQuery = 'SELECT * FROM user_routes WHERE user_id = $1 AND route_id = $2;';
    const routeCheckResult = await db.query(routeCheckQuery, [user_id, route_id]);
    if (routeCheckResult.rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: `Route not found for route_id: ${route_id}`,
      });
    }

    const deleteQuery = `DELETE FROM user_routes WHERE user_id = $1 AND route_id = $2 RETURNING *;`;
    const deleteResult = await db.query(deleteQuery, [user_id, route_id]);
    return deleteResult.rows[0];
  } 
  catch (error) {
    console.error("psql error for deleting route", error);
    throw error;
  }
};

