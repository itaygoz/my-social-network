import axios from 'axios';
import logger from "./logService";
import { toast } from 'react-toastify';


axios.interceptors.response.use(null, error => {
    const exeptedError = error.response && error.response.status >= 400 && error.response.status < 500;

    if (!exeptedError) {
        logger.log(error);
        toast.error('An unexcepted error occurred!');
    }

    return Promise.reject(error);
});

function setJwt(jwt) {
    axios.defaults.headers.common['x-auth-token'] = jwt;
}

export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    setJwt
};