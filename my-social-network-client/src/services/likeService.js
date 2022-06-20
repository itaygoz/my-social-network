import { urlApi } from '../config.json';
import http from './httpService';
import _ from 'lodash';

const apiEndpoint = urlApi + '/likes';

export function getLikes(postId) {
    return http.get(apiEndpoint + '/' + postId);
}

export function postLike(postId) {
    return http.post(apiEndpoint, { postId });
}