import axios from 'axios';

const client = function(){
    return axios.create({
        baseURL: '',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('auth-token'),
        }
    });
}

export {
    client
}

export default {
    client
}