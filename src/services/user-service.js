import { myAxios } from "./helper";

export const SignUp=async (user)=>{
    const response = await myAxios
        .post('/api/v1/usercheck', user);
    return response.data;
}
export const UserLogin=async (loginDetails)=>{
    const response = await myAxios
        .post('/api/v1/auth/login', loginDetails,{ timeout: 10000 });
    return response.data;
}
