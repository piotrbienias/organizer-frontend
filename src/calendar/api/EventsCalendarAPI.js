import React from 'react';

import BaseAPI from './../../utils/baseApi';


class EventsCalendarAPI extends BaseAPI {

    getEventsByMonth(month) {
        return this.api.get(`/events?month=${month}`);
    }

}


export default new EventsCalendarAPI();