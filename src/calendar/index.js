import React from 'react';
import {
    Calendar,
    Row,
    Popover,
    Button,
    Badge,
    Popconfirm,
    message
} from 'antd';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import EventsCalendarAPI from './api/EventsCalendarAPI';
import EventModal from './event/modal/EventModal';
import NotAuthorized from './../common/NotAuthorized';
import Auth from './../utils/auth';


class EventsCalendar extends React.Component {

    state = {
        value: moment(),
        selectedValue: moment(),
        data: [],
        showModal: false
    };

    componentDidMount() {
        this.fetchEvents();
    }

    onPanelChange = (value) => {
        this.fetchEvents(value.month());
        this.setState({ value });
    }

    fetchEvents = (month, year) => {
        month = month || this.state.value.month();
        year = year || this.state.value.year();

        EventsCalendarAPI.getEventsByMonth(month)
            .then(response => {
                this.setState({ data: response.data });
            }).catch(e => {
                message.error('Wystąpił błąd podczas ładowania danych');
            });
    }

    dateCellRender = (value) => {
        var tempEvents = [];
        this.state.data.forEach(event => {
            var tempDate = moment(event.date);
            if (tempDate.startOf('day').isSame(value.startOf('day'))) {
                tempEvents.push(event);
            }
        });

        return (
            <div>
            {
                tempEvents.map(event => (
                    <Popover
                        content={this.getEventPopoverContent(event)}
                        title={event.name}
                        trigger="click"
                        key={`event_${event.id}`}>
                        <Badge status="success" /><span>{event.name}</span><br />
                    </Popover>
                ))
            }
            </div>
        )
    }

    deleteEvent = (event) => {

    }

    getEventPopoverContent = (event) => {
        return (
            <div style={{ fontSize: '11px' }}>
                <p>{event.description}</p>
                <p><strong>Organizator: </strong>{event.organizer.username}</p>
                <p><strong>Data: </strong>{new Date(event.date).toUTCString()}</p>
                <p><strong>Czas trwania: </strong>{event.duration} min.</p>
                <p><strong>Lokalizacja: </strong>{event.location}</p>
                { event.repeatInterval ? <p><strong>Powtarzaj co: </strong>{event.repeatInterval} dni</p> : ''}
                <p><strong>Uczestnicy: </strong><br />
                {
                    event.members.map(member => (
                        <span key={member.id}>{member.username} (<a href={"mailto:" + member.email}>{member.email}</a>)<br /></span>
                    ))
                }
                </p>
                <p style={{ textAlign: 'right' }}>
                    <Popconfirm
                        title="Chcesz usunąć to wydarzenie?"
                        onConfirm={this.deleteEvent(event)}
                        okText="Usuń"
                        cancelText="Anuluj">
                        <Button type="danger" size="small" style={{ marginRight: '5px' }}>Usuń</Button>
                    </Popconfirm>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => this.goToEdit(event.id)}>Edytuj</Button>
                </p>
            </div>
        )
    }

    goToEdit = (eventId) => {
        this.props.history.push(`/kalendarz/wydarzenia/${eventId}`);
    }

    showEventForm = () => {
        this.setState({
            showModal: true
        });
    }

    hideEventForm = () => {
        this.setState({
            showModal: false
        });
    }

    render() {
        const { value } = this.state;

        return Auth.isAllowedToComponent('can-manage-events') ? (
            <Row>
                <Row className="topRow" type="flex" justify="end">
                    <Button
                        type="primary"
                        onClick={this.showEventForm}>Dodaj</Button>
                </Row>
                <Row>
                    <Calendar
                        value={value}
                        onPanelChange={this.onPanelChange}
                        dateCellRender={this.dateCellRender} />
                    <EventModal
                        visible={this.state.showModal}
                        hideForm={this.hideEventForm}
                        fetchEvents={this.fetchEvents} />
                </Row>
            </Row>
        ) : <NotAuthorized />
    }

}


export default withRouter(EventsCalendar);