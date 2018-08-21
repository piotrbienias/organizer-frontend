import React from 'react';
import {
    Form,
    Checkbox,
    Button,
    Modal
} from 'antd';

import EventAPI from './../api/EventAPI';


const confirmModal = Modal.confirm;


class DeleteEventForm extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            event: {},
            deleteAll: false
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.event.id !== prevState.event.id) {
            return {
                event: nextProps.event
            };
        }

        return null;
    }
    

    markDeleteAll = () => {
        this.setState({ deleteAll: !this.state.deleteAll });
    }

    handleSubmit = (e) => {
        const form = this.props.form;

        form.validateFields((err, values) => {
            
            EventAPI.deleteEvent(this.state.event.id, values['deleteAll'])
                .then(response => {
                    console.log(response);
                }).catch(e => {
                    console.log(e);
                });
        });
    }

    showConfirmModal = () => {
        var self = this;

        confirmModal({
            title: 'Usuń wydarzenie',
            content: `Czy na pewno chcesz usunąć ${this.state.event.name}?`,
            okText: 'Usuń',
            okType: 'danger',
            cancelText: 'Anuluj',
            onOk() {
                self.handleSubmit();
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form>
                <Form.Item>
                    {getFieldDecorator('deleteAll', {
                        rules: []
                    })(
                        <Checkbox
                            checked={this.state.deleteAll}
                            onChange={this.markDeleteAll}>Usuń równiez powtarzające się wydarzenia</Checkbox>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button
                        type="danger"
                        onClick={this.showConfirmModal}>Usuń</Button>
                </Form.Item>
            </Form>
        )
    }

}


export default Form.create()(DeleteEventForm);