import axios from "axios"
import { getToken } from "../auth"
// export const BASE_URL ='http://3.109.191.193:1972'//dev Url
export const BASE_URL ='http://127.0.0.1:3000'//local Urls
// export const BASE_URL ='http://192.168.0.101:1972'//Ip

export const myAxios = axios.create({
    baseURL: BASE_URL,
})
export const privateAxios = axios.create({
    baseURL: BASE_URL,
})
privateAxios.interceptors.request.use(config=>{
    const token = getToken();
    if(token){
        config.headers.Authorization = `Bearer ${token}`
        return config;
    }
},error=>Promise.reject(error));