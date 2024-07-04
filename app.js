const express = require('express')

const {getUsers, getUserById, getUserRoutes, getRouteById, createUser, createUserRoute, patchUser, patchUserRoute, deleteUser, deleteUserRoute} = require("./controllers/controllers")

const app = express();
app.use(express.json()); 

//endpoints
app.get('/api/users', getUsers);
app.get('/api/users/:user_id', getUserById)
//404 error if the user id does not exist - DONE
//400 if user_id is invalid - DONE
app.get('/api/users/:user_id/user_routes', getUserRoutes)
//404 error if the user id does not exist - DONE
//400 if user_id is invalid -DONE 
app.get('/api/users/:user_id/user_routes/:route_id', getRouteById)
//404 if the user id or route id does not exist -DONE
//400 if user_id or route id  is invalid -DONE
app.post('/api/users', createUser)
//400 when body is malformed or missing -DONE
//400 error when invalid body is given - ???
app.post('/api/users/:user_id/user_routes', createUserRoute)
//400 when body is malformed or missing
//400 error when invalid body is given
//404 if the user id does not exist
//400 if user_id is invalid
app.patch('/api/users/:user_id', patchUser)
//400 when body is malformed or missing
//400 error when invalid body is given
//404 if the user id does not exist
//400 if user_id is invalid
app.patch('/api/users/:user_id/user_routes/:route_id', patchUserRoute)
//400 when body is malformed or missing
//400 error when invalid body is given
//404 if the user id or route id does not exist
//400 if user_id or route id is invalid
app.delete('/api/users/:user_id', deleteUser)
//404 if the user id does not exist
//400 if user_id is invalid
app.delete('/api/users/:user_id/user_routes/:route_id', deleteUserRoute)
//404 if the user id or route id does not exist
//400 if user_id or route id is invalid

//errors in the endpoints
app.all("*", (req, res) => {
    res.status(404).send({ msg: "Not Found" });
  });

  app.use((err, req, res, next) => {
    if (err.code) {
      res.status(400).send({ msg: "Bad Request" });
    } else {
      next(err);
    }
  });
  
  app.use((err, req, res, next) => {
    if (err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      next(err);
    }
  });
  
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send({ msg: "Internal Server Error" });
  });


module.exports = app