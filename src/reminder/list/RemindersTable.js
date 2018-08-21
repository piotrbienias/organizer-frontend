import React from 'react';
import {
    Table,
    message,
    Popover,
    Divider
} from 'antd';
import moment from 'moment';

import ReminderAPI from './../api/ReminderAPI';


class RemindersTable extends React.Component {

    columns = [
        {
            title: 'Data',
            dataIndex: 'date',
            key: 'date',
            render: (text, record) => {
                return moment(record.date).format('DD-MM-YYYY H:mm');
            }
        },
        {
            title: 'Nazwa',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Zarządzaj',
            dataIndex: 'manage',
            key: 'manage',
            render: (text, record) => {
                return (
                    <div>
                    {record.targetModel !== null ? (
                        <span>
                            <Popover
                                content={this.state.targetDataContent}
                                trigger="click"
                                title={this.state.popoverTitle}>
                                <a
                                    href="#"
                                    onClick={() => this.getTargetData(record)}>Pobierz dane</a>
                            </Popover>
                            <Divider type="vertical" />
                        </span>
                    ) : ''}
                        <span
                            style={{ cursor: 'pointer' }}
                            onClick={() => this.props.showReminderModal(record.id)}>Edytuj</span>
                    </div>
                ) 
            }
        }
    ];

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            loading: false,
            pagination: {
                pageSize: 5
            },
            updateList: false,
            targetDataContent: '',
            popoverTitle: 'Informacje o wydarzeniu'
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if ( nextProps.updateList !== prevState.updateList ) {
            return {
                updateList: nextProps.updateList
            };
        }

        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if ( this.state.updateList !== prevState.updateList ) {
            this.countAllReminders();
        }
    }

    componentDidMount() {
        this.countAllReminders();
    }

    getTargetData = (reminder) => {
        ReminderAPI.getTargetData(reminder.id)
            .then(response => {
                if (reminder.targetModel === 'Event') {
                    this.printEventData(response.data, reminder)
                } else if (reminder.targetModel === 'CarActivity') {
                    this.printCarActivityData(response.data, reminder);
                }
            }).catch(e => {
                message.error('Wystąpił błąd podczas wykonywania operacji');
            });
    }

    printCarActivityData = (carActivity, reminder) => {
        var carActivityHref = `/samochod/${carActivity.id}`;

        this.setState({
            popoverTitle: 'Czynność związana z samochodem',
            targetDataContent: (
                <div>
                    <p><strong>Aktywność: </strong>{carActivity.activityName}</p>
                    <p><strong>Dodatkowe informacje: </strong>{carActivity.additionalInfo}</p>
                    <p><strong>Data: </strong>{moment(carActivity.date).format('DD-MM-YYYY H:MM')}</p>
                    <a href={carActivityHref}>Przejdź do aktywności</a>
                    <hr />
                    <p><strong>Treść przypomnienia: </strong>{reminder.description}</p>
                </div>
            )
        });
    }

    printEventData = (event, reminder) => {
        var eventHref = `/kalendarz/wydarzenia/${event.id}`;

        this.setState({
            popoverTitle: 'Wydarzenie z kalendarza',
            targetDataContent: (
                <div>
                    <p><strong>Wydarzenie: </strong>{event.name}</p>
                    <p><strong>Opis wydarzenia: </strong>{event.description}</p>
                    <p><strong>Czas trwania: </strong>{event.duration} min.</p>
                    <p><strong>Data: </strong>{moment(event.date).format('DD-MM-YYYY H:MM')}</p>
                    <p><strong>Lokalizacja: </strong>{event.location}</p>
                    <a href={eventHref}>Przejdź do wydarzenia</a>
                    <hr />
                    <p><strong>Treść przypomnienia: </strong>{reminder.description}</p>
                </div>
            )
        })
    }

    getReminderTargetURL(reminder) {
        var targetURL;

        if ( reminder.target && reminder.targetModel ) {
            if ( reminder.targetModel === 'Event' ) {
                targetURL = `/kalendarz/wydarzenia/${reminder.target}`;
            } else if ( reminder.targetModel === 'CarActivity' ) {
                targetURL = '/samochod';
            }
        }

        return targetURL;
    }

    countAllReminders = () => {
        this.setState({ loading: true });
        ReminderAPI.count()
            .then(response => {
                const pagination = { ...this.state.pagination };
                pagination.total = response.data.count;

                this.setState({ pagination });
                this.fetchReminders();
            }).catch(e => {
                message.error('Wystąpił błąd podczas wykonywania operacji');
            });
    }

    fetchReminders = (perPage = this.state.pagination.pageSize, page = 1) => {
        ReminderAPI.getReminders(perPage, page)
            .then(response => {
                this.setState({ data: response.data, loading: false });
            }).catch(e => {
                message.error('Wystąpił bład podczas zwracania wyników');
            });
    }

    handleTableChange = (pagination) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;

        this.setState({ pagination: pager });
        this.fetchReminders(this.state.pagination.pageSize, pagination.current);
    }

    render() {
        return (
            <Table
                columns={this.columns}
                rowKey={record => record.id}
                loading={this.state.loading}
                onChange={this.handleTableChange}
                dataSource={this.state.data}
                pagination={this.state.pagination} />
        );
    }

}


export default RemindersTable;