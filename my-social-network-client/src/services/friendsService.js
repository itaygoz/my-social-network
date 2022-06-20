import { urlApi } from '../config.json';
import http from './httpService';

const apiEndpoint = urlApi + '/friends';

export function getAllFriends() {
    return http.get(apiEndpoint);
}

export function getCurrentUserFriends() {
    return http.get(apiEndpoint + "/me");
}

export function getCurrentUserPendings() {
    return http.get(apiEndpoint + '/pendings');
}

export function getCurrentUserRequests() {
    return http.get(apiEndpoint + '/requests');
}

export function getUserFriends(id) {
    return http.get(apiEndpoint + '/' + id);
}

export function sendFriendRequest(userId) {
    return http.post(apiEndpoint + '/request', { userId });
}

export function approveFriendRequest(userId) {
    return http.post(apiEndpoint + '/approve', { userId });
}

export function deletePending(id) {
    return http.delete(apiEndpoint + '/pending/' + id);
}

export function deleteRequest(id) {
    return http.delete(apiEndpoint + '/request/' + id);
}

export function deleteFriend(id) {
    return http.delete(apiEndpoint + '/' + id);
}