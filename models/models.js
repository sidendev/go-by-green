const db = require('../db/connection')

exports.selectUsers = async () => {
    const sqlQuery = "SELECT * FROM users;"
    const users = await db.query(sqlQuery)
    return users.rows
}

exports.selectUserById = async (user_id) => {
    const sqlQuery = `SELECT * FROM users WHERE user_id = $1;`   
    const user = await db.query(sqlQuery, [user_id])
    return user.rows[0]
}

exports.selectUserRoutes = async (user_id) => {
    const sqlQuery = `SELECT * FROM user_routes WHERE user_id = $1;` // needs to add a foreign key to join 
    const routes = await db.query(sqlQuery, [user_id])
    return routes.rows
}

exports.selectRouteById = async () => {
    
}

exports.makeUser = async (name, username, profile_url) => {
    const sqlQuery = `INSERT INTO users (name, username, profile_url)
   VALUES ($1, $2, $3) RETURNING *;`
   const user = await db.query(sqlQuery, [name, username, profile_url])
   return user
}

exports.makeUserRoute = async () => {
    
}

exports.changeUser = async () => {
    
}

exports.changeUserRoute = async () => {
    
}

exports.removeUser = async () => {
    
}

exports.removeUserRoute = async () => {
    
}
