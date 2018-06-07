import React from 'react';
import {
    Row,
    Tabs,
    message
} from 'antd';

import EventAPI from './api/EventAPI';
import EventForm from './form/EventForm';
import DeleteEventForm from './form/DeleteEventForm';


const TabPane = Tabs.TabPane;


class Event extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            eventId: this.props.match.params.id,
            event: {},
            deleteAll: false
        };
    }

    componentWillMount() {
        this.fetchEvent();
    }

    fetchEvent = () => {
        EventAPI.getEvent(this.state.eventId)
            .then(response => {
                this.setState({
                    event: response.data
                });
            }).catch(e => {
                message.error('Wystąpił błąd podczas pobierania danych');
            });
    }

    markDeleteAll = () => {
        this.setState({
            deleteAll: !this.state.deleteAll
        });
    }

    render() {
        return (
            <Row>
                <Row
                    className="topRow">
                </Row>
                <Row>
                    <Tabs
                        defaultActiveKey="edit">
                        <TabPane
                            tab="Edycja"
                            key="edit">
                            <EventForm
                                event={this.state.event} />
                        </TabPane>
                        <TabPane
                            tab="Usuwanie"
                            key="delete">
                            <DeleteEventForm
                                eventId={this.state.event.id} />
                        </TabPane>
                    </Tabs>
                </Row>
            </Row>
        )
    }

}


export default Event;