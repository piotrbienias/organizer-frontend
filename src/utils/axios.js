import axios from 'axios';
import Cookies from 'universal-cookie';

import EventsHandler from './events';


const cookies = new Cookies();


class AxiosAPI {

    static apiInstance = null;
    static BaseURL = 'http://localhost:3000';

    static getInstance() {
        if (AxiosAPI.apiInstance == null) {
            AxiosAPI.apiInstance = new AxiosAPI();
        }

        return AxiosAPI.apiInstance;
    }

    token = null;
    api = null;

    constructor() {
        this.api = axios.create({
            baseURL: AxiosAPI.BaseURL
        });

        if (this.token) {
            this.api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        }

        this.api.interceptors.response.use(null, (error) => {
            if (error.response.status === 401) {
                EventsHandler.getInstance().emit('INVALID_TOKEN', {});
            }
            return Promise.reject(error);
        });
    }

    getApi() {
        if (!cookies.get('_bat')) {
            EventsHandler.getInstance().emit('INVALID_TOKEN', {});
        }
        return this.api;
    }

    setApi(api) {
        this.api = api;
    }

    getToken() {
        return this.token;
    }

    setToken(token) {
        this.token = token;

        if (token) {
            this.getApi().defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }

}


export default AxiosAPI;