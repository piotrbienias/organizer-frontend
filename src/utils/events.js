import { EventEmitter } from 'events';

class EventsHandler {

    static eventsHandlerInstance = null;

    static getInstance() {
        if (EventsHandler.eventsHandlerInstance == null) {
            EventsHandler.eventsHandlerInstance = new EventsHandler();
        }

        return EventsHandler.eventsHandlerInstance;
    }

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    on(eventName, listener) {
        this.eventEmitter.on(eventName, listener);
    }

    removeEventListener(eventName, listener) {
        this.eventEmitter.removeListener(eventName, listener);
    }

    emit(event, payload, error = false) {
        this.eventEmitter.emit(event, payload, error);
    }

    getEventEmitter() {
        return this.eventEmitter;
    }

}


export default EventsHandler;