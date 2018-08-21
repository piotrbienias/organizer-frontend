import React from 'react';
import {
    Modal,
    message
} from 'antd';

import ReminderAPI from './../api/ReminderAPI';
import ReminderForm from './../form/ReminderForm';


class ReminderModal extends React.Component {

    static modalDefaultTitle = 'Dodaj przypomnienie';
    static modalDefaultOkText = 'Dodaj';

    constructor(props) {
        super(props);

        this.state = {
            reminderId: null,
            reminder: {},
            title: ReminderModal.modalDefaultTitle,
            okText: ReminderModal.modalDefaultOkText,
            visible: false,
            events: [],
            carActivities: [],
            users: []
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if ( nextProps.visible !== prevState.visible ) {
            return {
                reminderId: nextProps.reminderId,
                visible: nextProps.visible,
                events: nextProps.events,
                carActivities: nextProps.carActivities,
                users: nextProps.users
            };
        }

        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.reminderId && this.state.reminderId !== prevState.reminderId) {
            this.fetchReminder();
        }
    }

    fetchReminder = () => {
        ReminderAPI.getReminder(this.state.reminderId)
            .then(response => {
                this.setState({ reminder: response.data, title: 'Edytuj przypomnienie', okText: 'Zapisz' });
            }).catch(e => {
                message.error('Wystąpił błąd podczas pobierania danych');
            });
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            reminderId: null,
            title: ReminderModal.modalDefaultTitle,
            okText: ReminderModal.modalDefaultOkText,
            reminder: {}
        });
        this.props.hideReminderModal();
        this.formRef.props.form.resetFields();
    }

    handleSubmit = () => {
        var form = this.formRef.props.form;

        form.validateFields((err, values) => {
            if ( err ) return;

            if ( values.id !== undefined ) {
                this.updateReminder(values.id, values);
            } else {
                this.createReminder(values);
            }

        });
    }

    createReminder = (data) => {
        ReminderAPI.createReminder(data)
            .then(response => {
                this.props.updateList();
                this.handleCancel();
                message.success('Przypomnienie zostało zapisane');
            }).catch(e => {
                console.log(e);
                message.error('Wystąpił błąd podczas wykonywania operacji');
            });
    }

    updateReminder = (id, data) => {
        ReminderAPI.updateReminder(id, data)
            .then(response => {
                this.props.updateList();
                this.handleCancel();
                message.success('Przypomnienie zostało zapisane');
            }).catch(e => {
                message.error('Wystąpił błąd podczas wykonywania operacji');
            });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render() {
        return (
            <Modal
                title={this.state.title}
                visible={this.state.visible}
                onCancel={this.handleCancel}
                onOk={this.handleSubmit}
                okText={this.state.okText}
                cancelText="Anuluj">
                <ReminderForm
                    wrappedComponentRef={this.saveFormRef}
                    reminder={this.state.reminder}
                    events={this.state.events}
                    carActivities={this.state.carActivities}
                    users={this.state.users} />
            </Modal>
        )
    }

}


export default ReminderModal;