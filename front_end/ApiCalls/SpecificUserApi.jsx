import axios from "axios";

const fetchSpecificUser = (userId) =>{
    let baseURL = `https://gobygreen.onrender.com/api/users/${userId}/`

    return axios.get(baseURL).then((response)=>{return response.data})
    .catch((err)=>{
        console.log(err, 'error getting specific user.')
    })
}

export {fetchSpecificUser}