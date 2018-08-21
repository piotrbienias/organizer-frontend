import BaseAPI from './../../utils/baseApi';


class ReminderAPI extends BaseAPI {

    createReminder(data) {
        return this.api.post('/reminders', data);
    }

    updateReminder(id, data) {
        return this.api.put(`/reminders/${id}`, data);
    }

    getReminder(reminderId) {
        return this.api.get(`/reminders/${reminderId}`);
    }

    getReminders(perPage = 10, page = 1) {
        return this.api.get(`/reminders?perPage=${perPage}&page=${page}`);
    }

    getTargetData(reminderId) {
        return this.api.get(`/reminders/${reminderId}/get_target_data`);
    }

    count() {
        return this.api.get('/reminders/count');
    }

}


export default new ReminderAPI();