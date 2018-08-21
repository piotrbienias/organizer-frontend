import React from 'react';
import {
    Form,
    Input,
    Select,
    DatePicker
} from 'antd';
import moment from 'moment';



class ReminderForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            reminder: {},
            events: [],
            carActivities: [],
            users: []
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            reminder: nextProps.reminder,
            events: nextProps.events,
            carActivities: nextProps.carActivities,
            users: nextProps.users
        };
    }

    getUsersSelect = () => {
        var usersSelectHTML = [];

        this.state.users.forEach(user => {
            usersSelectHTML.push(
                <Select.Option selected key={user.id} value={user.id.toString()}>{user.username} ({user.email})</Select.Option>
            )
        });

        return usersSelectHTML;
    }

    getTargetModelSelect = () => {
        var targetSelectHTML = [];

        targetSelectHTML.push(
            <Select.Option key={0} value={null}>---------</Select.Option>,
            <Select.Option key={'Event'} value="Event">Wydarzenie</Select.Option>,
            <Select.Option key={'CarActivity'} value="CarActivity">Czynność samochodowa</Select.Option>
        );

        return targetSelectHTML;
    }

    getTargetSelect = () => {
        var eventsSelectHTML = [];
        var form = this.props.form;

        var targetModel = form.getFieldValue('targetModel');
        var targetObjects = [];
        if ( targetModel === 'Event' ) {
            targetObjects = this.state.events;
        } else if ( targetModel === 'CarActivity' ) {
            targetObjects = this.state.carActivities;
        }

        eventsSelectHTML.push(
            <Select.Option key={0} value={null} disabled>---------</Select.Option>
        );
        
        targetObjects.forEach(target => {
            var targetName = targetModel === 'Event' ? target.name : target.activityName;
            eventsSelectHTML.push(
                <Select.Option
                    key={target.id}
                    value={target.id.toString()}>{targetName} - {moment(target.date).format('YYYY-MM-DD HH:mm')}</Select.Option>
            )
        });

        return eventsSelectHTML;
    }

    filterOption = (input, option) => {
        var str = option.props.children;
        if ( Array.isArray(str) ) {
            str = str.join();
        }
        return str.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }

    onTargetModelChange = (value, option) => {
        var form = this.props.form;
        form.setFieldsValue({ target: null });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 8, offset: 0 }
            },
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 16, offset: 0 }
            }
        };
        
        return (
            <Form>
                <Form.Item
                    {...formItemLayout}>
                    {getFieldDecorator('id', {
                        rules: [],
                        initialValue: this.state.reminder.id
                    })(
                        <Input type="hidden" />
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="Nazwa">
                    {getFieldDecorator('name', {
                        rules: [
                            { required: true, message: 'To pole jest wymagane' }
                        ],
                        initialValue: this.state.reminder.name
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="Data">
                    {getFieldDecorator('date', {
                        rules: [
                            { required: true, message: 'To pole jest wymagane' }
                        ],
                        initialValue: this.state.reminder.date ? moment(this.state.reminder.date) : null
                    })(
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm"
                            placeholder="Wybierz datę" />
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="Uzytkownicy">
                    {getFieldDecorator('users', {
                        initialValue: this.state.reminder.users ? this.state.reminder.users.map(user => { return user.id.toString(); }) : []
                    })(
                        <Select
                            mode="multiple">
                            {this.getUsersSelect()}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="Opis">
                    {getFieldDecorator('description', {
                        initialValue: this.state.reminder.description
                    })(
                        <Input.TextArea />
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="Przypisz do">
                    {getFieldDecorator('targetModel', {
                        initialValue: this.state.reminder.targetModel || null
                    })(
                        <Select
                            onChange={this.onTargetModelChange}>
                            {this.getTargetModelSelect()}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="Wydarzenie">
                    {getFieldDecorator('target', {
                        initialValue: this.state.reminder.target ? this.state.reminder.target.toString() : null
                    })(
                        <Select
                            showSearch
                            filterOption={this.filterOption}>
                            {this.getTargetSelect()}
                        </Select>
                    )}
                </Form.Item>
            </Form>
        )
    }

}


export default Form.create()(ReminderForm);