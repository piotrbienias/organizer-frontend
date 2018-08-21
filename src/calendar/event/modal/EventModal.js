import React from 'react';
import {
    Modal,
    message
} from 'antd';

import EventForm from './../form/EventForm';
import EventAPI from './../api/EventAPI';


class EventModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            visible: nextProps.visible
        };
    }

    handleCancel = () => {
        const form = this.formRef.props.form;
        form.resetFields();
        this.setState({ visible: false });
        this.props.hideForm();
    }

    handleSubmit = () => {
        const form = this.formRef.props.form;

        form.validateFields((err, values) => {
            if (err) return;

            values['repeatInterval'] = values['repeatInterval'] === '0' ? null : values['repeatInterval'];
            console.log(values);

            EventAPI.createEvent(values)
                .then(response => {
                    this.props.fetchEvents();
                    this.handleCancel();
                    message.success('Dodano nowe wydarzenie');
                }).catch(e => {
                    message.error('Wystąpił błąd podczas wykonywania operacji');
                });
        });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render() {
        return (
            <Modal
                title="Dodaj wydarzenie"
                visible={this.state.visible}
                onCancel={this.handleCancel}
                onOk={this.handleSubmit}
                width={650}
                okText="Dodaj"
                cancelText="Anuluj">
                <EventForm
                    wrappedComponentRef={this.saveFormRef}
                    hideSubmit={true}
                    fieldsOffset={4} />
            </Modal>
        )
    }

}


export default EventModal;