import {strapi} from "@strapi/client";

const url = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'; // Fallback URL
const key = process.env.STRAPI_JWT_KEY;
const token = process.env.STRAPI_API_TOKEN;
const strapiSDK = strapi({
    baseURL: url+'/api',
    auth:token
});


export default strapiSDK;
