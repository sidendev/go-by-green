const express = require('express')

const {getUsers, getUserById, getUserRoutes, getRouteById, createUser, createUserRoute, patchUser, patchUserRoute, deleteUser, deleteUserRoute} = require("./controllers/controllers")

const app = express();
app.use(express.json()); 

//endpoints
app.get('/api/users', getUsers);
app.get('/api/users/:user_id', getUserById)
app.get('/api/users/:user_id/saved_user_routes', getUserRoutes)
app.get('/api/users/:user_id/user_routes/:saved_user_route', getRouteById)

app.post('/api/users', createUser)
app.post('/api/users/:user_id/saved_user_routes', createUserRoute)

app.patch('/api/users/:user_id', patchUser)
app.patch('/api/users/:user_id/user_routes/:saved_user_route', patchUserRoute)

app.delete('/api/users/:user_id', deleteUser)
app.delete('/api/users/:user_id/user_routes/:saved_user_route', deleteUserRoute)

module.exports = app