import BaseAPI from './../../utils/baseApi';


class UsersAPI extends BaseAPI {

    getUsersCount() {
        return this.api.get('/users/count/');
    }

    getUsers(options = {}) {
        options.perPage = options.perPage ? options.perPage : 10;
        options.page = options.page ? options.page : 1;

        return this.api.get(`/users?perPage=${options.perPage}&page=${options.page}`);
    }

    getSingleUser(userId) {
        return this.api.get('/users/' + userId + '/');
    }

    getUserCategories() {
        return this.api.get('/user_categories/');
    }

    getSingleUserCategory(userCategoryId) {
        return this.api.get(`/user_categories/${userCategoryId}/`);
    }

    addUser(data) {
        return this.api.post('/users/', data);
    }

    updateUser(id, data) {
        return this.api.put(`/users/${id}/`, data);
    }

    deleteUser(id) {
        return this.api.delete(`/users/${id}`);
    }

    restoreUser(id) {
        return this.api.put(`/users/${id}/restore/`);
    }

    getPermissions() {
        return this.api.get('/permissions/');
    }

}


export default new UsersAPI();