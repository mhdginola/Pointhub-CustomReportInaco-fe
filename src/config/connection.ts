import axios from 'axios';
// import https from 'https';

// const agent = new https.Agent({
//     rejectUnauthorized: false,
//     minVersion: 'TLSv1',
//   });
export const client = function(){
    return axios.create({
        baseURL: `${import.meta.env.VITE_BASE_API_URL}`,
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('auth-token'),
        },
        // httpsAgent: agent
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
client.search = function(url: string, params: Object = {}){
    const serialized = serializeObject(params);
    return new Promise((resolve, reject) => {
        client().get(`/${url}${serialized? '?' + serialized: ''}`).then(r => {
            resolve({
                data: r.data.data,
                pagination: r.data.pagination
            });
        }, e => {
            reject(e);
        }).catch(e => {
            reject(e);
        });
    });
}

export const serializeObject = function (obj: any, prefix:string = ''): string{
    const serialized = [];
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const nestedKey = prefix ? `${prefix}[${key}]` : key;
            if (typeof obj[key] === 'object') {
                serialized.push(serializeObject(obj[key], nestedKey));
            } else {
                if(obj[key]){
                    serialized.push(`${(nestedKey)}=${(obj[key])}`);
                }
            }
        }
    }
    return serialized.filter(s => !!s).join('&');
};

export default {
    client,
    serializeObject
}