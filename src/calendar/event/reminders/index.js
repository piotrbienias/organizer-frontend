import React from 'react';
import {
    message
} from 'antd';
import moment from 'moment';

import EventAPI from './../api/EventAPI';
import './style.css';


class EventReminders extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            event: props.event || {},
            reminders: []
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if ( nextProps.event && nextProps.event.id !== prevState.event.id ) {
            return {
                event: nextProps.event
            };
        }

        return null;
    }

    componentDidMount() {
        if (this.state.event.id) {
            this.fetchEventReminders();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.event.id !== prevState.event.id){
            this.fetchEventReminders();
        }
    }

    fetchEventReminders = () => {
        EventAPI.getEventReminders(this.state.event.id)
            .then(response => {
                this.setState({ reminders: response.data });
            }).catch(e => {
                message.error('Wystąpił błąd podczas zwracania danych');
            });
    }

    getRemindersHTML = () => {
        var remindersHTML = [];

        this.state.reminders.forEach(reminder => {
            remindersHTML.push(
                <p className="single-reminder" key={reminder.id}>
                    <strong>{moment(reminder.date).format('YYYY-MM-YY HH:mm')}</strong> {reminder.name} - {reminder.description}
                    <span style={{ marginLeft: '45px', display: 'none' }}><a href="#">Edytuj</a></span>
                </p>
            )
        });

        return remindersHTML;
    }

    render() {
        return (
            <div>
                {this.getRemindersHTML()}
            </div>
        )
    }

}


export default EventReminders;