import BaseAPI from './../../utils/baseApi';


class CarActivityAPI extends BaseAPI {

    getCarActivities() {
        return this.api.get('/car_activities/');
    }

    getSingleCarActivity(carActivityId) {
        return this.api.get(`/car_activities/${carActivityId}/`);
    }

    updateCarActivity(carActivityId, carActivityData) {
        return this.api.put(`/car_activities/${carActivityId}/`, carActivityData);
    }

    createCarActivity(carActivityData) {
        return this.api.post('/car_activities/', carActivityData);
    }

    deleteCarActivity(carActivityId) {
        return this.api.delete(`/car_activities/${carActivityId}/`);
    }

}


export default new CarActivityAPI();