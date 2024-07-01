const express = require('express')

const {getUsers, getUserById, getUserRoutes, createUser, patchUserRoute, deleteUser} = require("./controllers/controllers")

const app = express();
app.use(express.json()); 

//endpoints
app.get('/api/users', getUsers);
app.get('/api/users/:user_id', getUserById)
app.get('/api/users/:user_id/saved_user_routes', getUserRoutes)

app.post('/api/users/:user_id', createUser)
app.patch('/api/users/:user_id/saved_user_routes', patchUserRoute)
app.delete('/api/users/:user_id', deleteUser)

module.exports = app