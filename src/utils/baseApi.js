import AxiosAPI from './axios';


class BaseAPI {

    constructor() {
        this.api = AxiosAPI.getInstance().getApi();
    }

}


export default BaseAPI;