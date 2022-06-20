import { urlApi } from '../config.json';
import http from './httpService';

const apiEndpoint = urlApi + '/users/avatar';

export function getAvatar(id) {
    return http.get(apiEndpoint + '/' + id);
}

export function getCurrentUserAvatar() {
    return http.get(apiEndpoint + '/me');
}

export function createAvatar(avatar) {
    return http.post(apiEndpoint, { avatar });
}

export function updateAvatar(avatar) {
    return http.put(apiEndpoint, { avatar });
}

export function deleteAvatar() {
    return http.delete(apiEndpoint);
}

export function adminDeleteAvatar(id) {
    return http.delete(apiEndpoint + '/' + id);
}