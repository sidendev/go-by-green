import axios from "axios";


const getRoutesByUserId = (userId) => {
    console.log(userId, '<<<<<<<<<<apilog')
    let baseURL = `https://gobygreen.onrender.com/api/users/${userId}/user_routes`

    return axios.get(baseURL).then((response) => { return response.data })
        .catch((err) => {
            console.log(err, 'error from getting user routes.')
        })
}



export { getRoutesByUserId }