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

}


export default new EventAPI();