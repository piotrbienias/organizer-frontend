import BaseAPI from './../../utils/baseApi';
import UsersAPI from './../../users/api/UsersAPI';


class MyAccountAPI extends BaseAPI {

    getUserData(id) {
        return this.api.get(`/users/${id}/`);
    }

    updateUser(id, data) {
        return UsersAPI.updateUser(id, data);
    }

    updateUserPassword(password) {
        return this.api.put('/account/update_password/', { password: password });
    }

}


export default new MyAccountAPI();