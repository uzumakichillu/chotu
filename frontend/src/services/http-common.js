import axios from "axios"

//creating a base URL for axios instance
const instance =  axios.create({
    baseURL : "http://localhost:5000/api/",
    headers : {
        "Content-type" : "application/json"
    }
})

export default instance;