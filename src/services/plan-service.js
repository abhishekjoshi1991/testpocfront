import { privateAxios } from "./helper";


export const PassEmailAnfGetPredictedUrl = async (data) => {
    const response = await privateAxios.post(`/api/v1/pass_email_data`,data);
    return response;
}
export const ModuleStateAgent = async (data) => {
    const response = await privateAxios.post(`/api/v1/sendmoduledata`,data);
    return response;
}
export const PassCorrectSopUrl = async (data) => {
    const response = await privateAxios.post(`/api/v1/pass_validate_data`,data);
    return response;
}
