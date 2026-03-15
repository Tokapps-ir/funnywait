import {strapi} from "@strapi/client";

const url = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'; // Fallback URL
const key = import.meta.env.VITE_STRAPI_JWT_KEY;
const token = import.meta.env.VITE_STRAPI_API_TOKEN;
const strapiSDK = strapi({
    baseURL: url+'/api',
    auth:token
});


export default strapiSDK;
