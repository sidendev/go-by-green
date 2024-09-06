import axios from "axios";

const findUser = () => {
    let baseUrl = 'https://gobygreen.onrender.com/api/users/'

    return axios.get(baseUrl).then((response)=>{return response.data})
    .catch((err)=>{
        console.log(err, 'error from finding user.')
    })
}

export {findUser}