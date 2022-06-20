import { urlApi } from '../config.json';
import http from './httpService';

const apiEndpoint = urlApi + '/users';

export function getUserById(id) {
    return http.get(apiEndpoint+'/'+id);
}

export function register(formData) {
    console.log(formData)

    return http.post(apiEndpoint, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
