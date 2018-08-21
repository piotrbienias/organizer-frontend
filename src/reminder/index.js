import React from 'react';
import {
    Row,
    Button
} from 'antd';

import RemindersTable from './list/RemindersTable';
import ReminderModal from './modal/ReminderModal';

import EventsCalendarAPI from './../calendar/api/EventsCalendarAPI';
import CarActivityAPI from './../car/api/CarActivityAPI';
import UsersAPI from './../users/api/UsersAPI';

import NotAuthorized from './../common/NotAuthorized';
import Auth from './../utils/auth';


class Reminder extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showReminderModal: false,
            selectedReminder: null,
            events: [],
            carActivities: [],
            users: [],
            updateList: false
        };
    }

    componentWillMount() {
        this.getAllEvents();
        this.getAllCarActivities();
        this.getAllUsers();        
    }

    getAllUsers = () => {
        UsersAPI.getUsers()
            .then(response => {
                this.setState({ users: response.data });
            }).catch(e => {
                console.log(e);
            });
    }

    getAllEvents = () => {
        EventsCalendarAPI.getEvents()
            .then(response => {
                this.setState({ events: response.data });
            }).catch(e => {
                console.log(e);
            });
    }

    getAllCarActivities = () => {
        CarActivityAPI.getCarActivities()
            .then(response => {
                this.setState({ carActivities: response.data });
            }).catch(e => {
                console.log(e);
            });
    }

    showReminderModal = (reminderId) => {
        this.setState({ showReminderModal: true, selectedReminder: reminderId });
    }

    hideReminderModal = () => {
        this.setState({ showReminderModal: false, selectedReminder: null });
    }

    updateList = () => {
        this.setState({ updateList: !this.state.updateList });
    }

    render() {
        return Auth.isAllowedToComponent('can-manage-reminders') ? (
            <Row>
                <Row type="flex" justify="end" className="topRow">
                    <Button
                        type="primary"
                        onClick={() => this.showReminderModal()}>Dodaj</Button>
                    <ReminderModal
                        visible={this.state.showReminderModal}
                        reminderId={this.state.selectedReminder}
                        hideReminderModal={this.hideReminderModal}
                        events={this.state.events}
                        carActivities={this.state.carActivities}
                        users={this.state.users}
                        updateList={this.updateList} />
                </Row>
                <Row>
                    <RemindersTable
                        showReminderModal={this.showReminderModal}
                        updateList={this.state.updateList} />
                </Row>
            </Row>
        ) : <NotAuthorized />
    }

}


export default Reminder;