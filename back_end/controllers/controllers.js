const {
  selectUsers,
  selectUserById,
  selectUserRoutes,
  selectRouteById,
  makeUser,
  makeUserRoute,
  changeUser,
  changeUserRoute,
  removeUser,
  removeUserRoute,
} = require("../models/models");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await selectUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    const user = await selectUserById(user_id);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

exports.getUserRoutes = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    const routes = await selectUserRoutes(user_id);
    res.status(200).send({ routes });
  } catch (err) {
    next(err);
  }
};

exports.getRouteById = async (req, res, next) => {
  const { user_id, route_id } = req.params;

  try {
    const route = await selectRouteById(user_id, route_id);
    res.status(200).send({
      route_id: route.route_id,
      user_id: route.user_id,
      origin_address: route.origin_address,
      destination_address: route.destination_address,
      carbon_usage: route.carbon_usage,
      route_distance: route.route_distance,
      mode_of_transport: route.mode_of_transport,
      route_time: route.route_time
    });
  } catch (err) {
    next(err);
  }
};


exports.createUser = async (req, res, next) => {
  const { name, username, profile_url, password } = req.body;
  try {
    const newUserDetails = await makeUser(name, username, profile_url, password);
    res.status(201).send({
      user_id: newUserDetails.user_id,
      username: newUserDetails.username,
      name: newUserDetails.name,
      profile_url: newUserDetails.profile_url,
      total_routes: newUserDetails.total_routes,
      total_carbon: newUserDetails.total_carbon,
      password: newUserDetails.password,
    });
  } catch (err) {
    next(err);
  }
};

exports.createUserRoute = async (req, res, next) => {
  const { user_id } = req.params;
  const { origin_address, destination_address, carbon_usage, route_distance, mode_of_transport, route_time } = req.body;
  try {
    const newRoute = await makeUserRoute(
      user_id,
      origin_address,
      destination_address, 
      carbon_usage,
      route_distance,
      mode_of_transport,
      route_time
    );
    res.status(201).send({
      user_id: newRoute.user_id,
      origin_address: newRoute.origin_address,
      destination_address: newRoute.destination_address,
      carbon_usage: newRoute.carbon_usage,
      route_distance: newRoute.route_distance,
      mode_of_transport: newRoute.mode_of_transport,
      route_time: newRoute.route_time
    });
  } catch (err) {
    next(err);
  }
};

exports.patchUser = async (req, res, next) => {
  const { user_id } = req.params;
  const { username, name, profile_url, password } = req.body;
  try {
    const updatedUser = await changeUser(user_id, name, username, profile_url, password);
    res.status(200).json({
      user_id: updatedUser.user_id,
      name: updatedUser.name,
      username: updatedUser.username,
      profile_url: updatedUser.profile_url,
      total_routes: updatedUser.total_routes,
      total_carbon: updatedUser.total_carbon,
      password: updatedUser.password,
    });
  } catch (err) {
    next(err);
  }
};

exports.patchUserRoute = async (req, res, next) => {
  const { user_id, route_id } = req.params;
  const { origin_address, destination_address, carbon_usage, route_distance, mode_of_transport, route_time } = req.body;

  try {
    const updatedRoute = await changeUserRoute(
      user_id,
      route_id,
      origin_address,
      destination_address, 
      carbon_usage,
      route_distance,
      mode_of_transport,
      route_time
    );
    res.status(200).send({
      user_id: updatedRoute.user_id,
      route_id: updatedRoute.route_id,
      origin_address: updatedRoute.origin_address,
      destination_address: updatedRoute.destination_address,
      carbon_usage: updatedRoute.carbon_usage,
      route_distance: updatedRoute.route_distance,
      mode_of_transport: updatedRoute.mode_of_transport,
      route_time: updatedRoute.route_time
    });;
  } catch (err) {
    console.error("Controller error:", err);
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    await removeUser(user_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.deleteUserRoute = async (req, res, next) => {
  const { user_id, route_id } = req.params;
  try {
    await removeUserRoute(user_id, route_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
