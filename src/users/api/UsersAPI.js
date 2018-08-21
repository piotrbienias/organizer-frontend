import BaseAPI from './../../utils/baseApi';


class UsersAPI extends BaseAPI {

    getUsersCount() {
        return this.api.get('/users/count/');
    }

    getUsers(options = {}) {
        var url = '/users';

        if (options.perPage) {
            url += `?perPage=${options.perPage}`;
        }

        if (options.page) {
            url += url.indexOf('?') > 0 ? `&page=${options.page}` : `?page=${options.page}`;
        }

        return this.api.get(url);
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