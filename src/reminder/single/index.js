import React from 'react';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';

import ReminderAPI from './../api/ReminderAPI';
import CarActivityAPI from './../../car/api/CarActivityAPI';
import CalendarAPI from './../../calendar/api/EventsCalendarAPI';
import UserAPI from './../../users/api/UsersAPI';

import NotAuthorized from './../../common/NotAuthorized';
import ReminderForm from './../form/ReminderForm';
import Auth from './../../utils/auth';


class SingleReminder extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: this.props.match.params.id,
            reminder: {},
            users: [],
            carActivities: [],
            events: []
        };
    }

    componentDidMount() {
        this.fetchUsers();
        this.fetchCarActivities();
        this.fetchEvents();
        this.fetchReminder();
    }

    fetchUsers = () => {
        UserAPI.getUsers()
            .then(response => {
                this.setState({ users: response.data });
            }).catch(e => {
                console.log(e);
            });
    }

    fetchCarActivities = () => {
        CarActivityAPI.getCarActivities()
            .then(response => {
                this.setState({ carActivities: response.data });
            });
    }

    fetchEvents = () => {
        CalendarAPI.getEvents()
            .then(response => {
                this.setState({ events: response.data });
            });
    }

    fetchReminder = () => {
        ReminderAPI.getReminder(this.state.id)
            .then(response => {
                this.setState({ reminder: response.data });
            }).catch(e => {
                console.log(e);
                message.error('Wystąpił błąd podczas ładowania danych');
            });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
    
    render() {
        return Auth.isAllowedToComponent('can-manage-reminders') ? (
            <ReminderForm
                wrappedComponentRef={this.saveFormRef}
                users={this.state.users}
                carActivities={this.state.carActivities}
                events={this.state.events}
                reminder={this.state.reminder} />
        ) : <NotAuthorized />
    }

}


export default withRouter(SingleReminder);