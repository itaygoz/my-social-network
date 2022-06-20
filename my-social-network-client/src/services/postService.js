import { urlApi } from '../config.json';
import http from './httpService';

const apiEndpoint = urlApi + '/posts';

export function getPosts() {
    return http.get(apiEndpoint);
}
export function getPost(id) {
    return http.get(apiEndpoint + '/' + id);
}
export function getPostImages(id) {
    return http.get(apiEndpoint + '/' + id + '/images');
}

export function getUserPost(userId) {
    return http.get(apiEndpoint + '/user/' + userId);
}

export function getCurrentUserPost() {
    return http.get(apiEndpoint + '/me');
}

export function createPost(postForm) {
    return http.post(apiEndpoint, postForm, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export function updatePost(postForm, id) {
    return http.put(apiEndpoint + '/' + id, postForm, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
export function updatePostPrivate(id) {
    return http.put(apiEndpoint + '/isPrivate/' + id);
}

export function deletePost(id) {
    return http.delete(apiEndpoint + '/' + id);
}