import React from 'react';
import {
    Row,
    Tabs,
    message
} from 'antd';
import { withRouter } from 'react-router-dom';

import EventAPI from './api/EventAPI';
import EventForm from './form/EventForm';
import DeleteEventForm from './form/DeleteEventForm';
import RepeatEventForm from './form/RepeatEventForm';
import EventReminders from './reminders';


const TabPane = Tabs.TabPane;


class Event extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            eventId: this.props.match.params.id,
            event: {},
            deleteAll: false,
            activeKey: 'edit'
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

    changeActiveKey = (activeKey) => {
        this.setState({ activeKey: activeKey });
    }

    reloadEvent = () => {
        this.changeActiveKey('edit');
        this.fetchEvent();        
    }

    render() {
        return (
            <Row>
                <Row
                    className="topRow">
                </Row>
                <Row>
                    <Tabs
                        activeKey={this.state.activeKey}
                        onTabClick={this.changeActiveKey}>
                        <TabPane
                            tab="Edycja"
                            key="edit">
                            <EventForm
                                event={this.state.event} />
                        </TabPane>
                        <TabPane
                            tab="Cykl"
                            key="cycle">
                            <RepeatEventForm
                                event={this.state.event}
                                history={this.props.history}
                                reloadEvent={this.reloadEvent} />
                        </TabPane>
                        <TabPane
                            tab="Przypomnienia"
                            key="reminders">
                            <EventReminders
                                event={this.state.event} />
                        </TabPane>
                        <TabPane
                            tab="Usuwanie"
                            key="delete">
                            <DeleteEventForm
                                event={this.state.event} />
                        </TabPane>
                    </Tabs>
                </Row>
            </Row>
        )
    }

}


export default withRouter(Event);