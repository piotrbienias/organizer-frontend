import BaseAPI from './../../utils/baseApi';


class StorageAPI extends BaseAPI {

    getObjects(directory) {
        return this.api.get(`/storage/objects?directory=${directory}`);
    }

}


export default new StorageAPI();