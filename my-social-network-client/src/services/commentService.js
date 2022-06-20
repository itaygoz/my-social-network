import { urlApi } from '../config.json';
import http from './httpService';

const apiEndpoint = urlApi + '/posts/comment/';

export function createComment(postId, content) {
    return http.post(apiEndpoint+postId, {content});
}