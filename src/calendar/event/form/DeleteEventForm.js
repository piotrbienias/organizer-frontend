import React from 'react';
import {
    Form,
    Checkbox,
    Button
} from 'antd';

import EventAPI from './../api/EventAPI';


class DeleteEventForm extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            eventId: null,
            deleteAll: false
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.eventId !== prevState.eventId) {
            return {
                eventId: nextProps.eventId
            };
        }

        return null;
    }
    

    markDeleteAll = () => {
        this.setState({ deleteAll: !this.state.deleteAll });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const form = this.props.form;

        form.validateFields((err, values) => {
            
            EventAPI.deleteEvent(this.state.eventId, values['deleteAll'])
                .then(response => {
                    console.log(response);
                }).catch(e => {
                    console.log(e);
                });
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 }
            },
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 }
            }
        };

        return (
            <Form
                onSubmit={this.handleSubmit}>
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
                        htmlType="submit">Usuń</Button>
                </Form.Item>
            </Form>
        )
    }

}


export default Form.create()(DeleteEventForm);