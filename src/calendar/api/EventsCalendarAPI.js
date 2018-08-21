import BaseAPI from './../../utils/baseApi';


class EventsCalendarAPI extends BaseAPI {

    getEventsByMonth(month) {
        return this.api.get(`/events?month=${month}`);
    }

    getEventsAfter(date) {
        return this.api.get(`/events/after/${date}`);
    }

    getEvents() {
        return this.api.get('/events');
    }

}


export default new EventsCalendarAPI();