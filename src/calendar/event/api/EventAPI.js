import BaseAPI from './../../../utils/baseApi';


class EventAPI extends BaseAPI {

    getEvent(eventId) {
        return this.api.get(`/events/${eventId}/`);
    }

    createEvent(event) {
        return this.api.post('/events', event);
    }

    deleteEvent(eventId, deleteAll) {
        deleteAll = typeof deleteAll === 'undefined' || !deleteAll ? false : true;
        return this.api.delete(`/events/${eventId}?deleteAll=${deleteAll}`, { deleteAll: deleteAll });
    }

    updateEvent(eventId, data) {
        return this.api.put(`/events/${eventId}`, data);
    }

    deleteCycle(eventId) {
        return this.api.put(`/events/${eventId}/delete_cycle`);
    }

    updateCycle(eventId, data) {
        return this.api.put(`/events/${eventId}/update_cycle`, data);
    }

    getEventReminders(eventId) {
        return this.api.get(`/events/${eventId}/reminders`);
    }

}


export default new EventAPI();