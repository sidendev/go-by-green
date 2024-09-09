import axios from "axios";


const getRoutesByUserId = (userId) => {
  let baseURL = `https://go-by-green.onrender.com/api/users/${userId}/user_routes`

  return axios.get(baseURL).then((response) => { return response.data })
    .catch((err) => {
      console.log(err, 'error from getting user routes.')
    })
}



export { getRoutesByUserId }