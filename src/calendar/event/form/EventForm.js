import React from 'react';
import {
    Form,
    Input,
    InputNumber,
    DatePicker,
    Select,
    Icon,
    Checkbox,
    message,
    Button
} from 'antd';
import moment from 'moment';

import UsersAPI from './../../../users/api/UsersAPI';
import Auth from './../../../utils/auth';


const FormItem  = Form.Item;
const TextArea  = Input.TextArea;
const Option    = Select.Option;


class EventForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            event: props.event || {},
            users: [],
            loadingUsers: true,
            hideSubmit: props.hideSubmit
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.event && nextProps.event.id !== prevState.event.id) {
            return {
                event: nextProps.event,
                hideSubmit: nextProps.hideSubmit
            };
        }

        return null;
    }

    componentDidMount() {
        this.fetchUsers();
    }

    fetchUsers = () => {
        UsersAPI.getUsers()
            .then(response => {
                if (Array.isArray(response.data)) {
                    var users = [];
                    
                    response.data.forEach(user => {
                        users.push(
                            <Option
                                key={`${user.id}`}
                                value={`${user.id}`}>{user.username} ({user.email})</Option>
                        );
                    });

                    this.setState({ users: users, loadingUsers: false });
                }
            }).catch(e => {
                message.error('Wystąpił błąd podczas zwracania wyników');
            });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const form = this.props.form;

        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            console.log(values);
        });
    }

    updateAllCheckbox = () => {
        const { getFieldDecorator } = this.props.form;

        if (this.state.event.id) {
            return (
                <FormItem
                    wrapperCol={{ sm: { span: 24, offset: 4 } }}>
                    {getFieldDecorator('updateAll', {
                        rules: []
                    })(
                        <Checkbox>Aktualizuj wszystkie powtórzenia</Checkbox>
                    )}
                </FormItem>
            )
        }
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
                sm: { span: 4, offset: this.props.fieldsOffset }
            }
        };

        const submitItemLayout = {
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        };

        return this.state.loadingUsers ? <Icon type="loading" /> : (
            <Form
                onSubmit={this.handleSubmit}>
                <FormItem>
                    {getFieldDecorator('id', {
                        rules: [],
                        initialValue: this.state.event ? this.state.event.id : ''
                    })(
                        <Input type="hidden" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Nazwa">
                    {getFieldDecorator('name', {
                        rules: [
                            { required: true, message: 'Proszę podać nazwę wydarzenia' }
                        ],
                        initialValue: this.state.event ? this.state.event.name : ''
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Opis">
                    {getFieldDecorator('description', {
                        rules: [],
                        initialValue: this.state.event ? this.state.event.description : ''
                    })(
                        <TextArea row={4} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Data">
                    {getFieldDecorator('date', {
                        rules: [
                            { required: true, message: 'Proszę wybrać datę' }
                        ],
                        initialValue: this.state.event ? moment(this.state.event.date) : moment()
                    })(
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="Data" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Lokalizacja">
                    {getFieldDecorator('location', {
                        rules: [],
                        initialValue: this.state.event ? this.state.event.location : ''
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Czas trwania">
                    {getFieldDecorator('duration', {
                        rules: [
                            { required: true, message: 'Proszę podać czas trwania' }
                        ],
                        initialValue: this.state.event ? this.state.event.duration : ''
                    })(
                        <InputNumber
                            min={1}
                            step={1}
                            formatter={value => `${value} min.`}
                            parser={value => value.replace(' min.', '')} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Uczestnicy">
                    {getFieldDecorator('members', {
                        rules: [],
                        initialValue: this.state.event.members ? this.state.event.members.map(member => { return `${member.id}`; }) : []
                    })(
                        <Select
                            mode="multiple">
                            {this.state.users}
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Powtarzaj co">
                    {getFieldDecorator('repeatInterval', {
                        rules: [],
                        initialValue: this.state.event.repeatInterval ? this.state.event.repeatInterval : '0'
                    })(
                        <InputNumber
                            min={0}
                            step={1}
                            formatter={value => `${value} ${value == 1 ? 'dzień' : 'dni'}`}
                            parser={value => value.replace(/[^d\.]/g, '')} />
                    )}
                </FormItem>
                { !this.state.event.id ? 
                    <FormItem
                        {...formItemLayout}
                        label="Powtarzaj do">
                        {getFieldDecorator('endDate', {
                            rules: []
                        })(
                            <DatePicker />
                        )}
                    </FormItem>
                : ''}
                <FormItem
                    {...formItemLayout}
                    label="Organizator">
                    {getFieldDecorator('organizer', {
                        rules: [],
                        initialValue: this.state.event.organizer ? this.state.event.organizer.id.toString() : Auth.getCurrentUser().id.toString()
                    })(
                        <Select disabled>
                            {this.state.users}
                        </Select>
                    )}
                </FormItem>
                {this.updateAllCheckbox()}
                {!this.state.hideSubmit ?
                    <FormItem
                        {...submitItemLayout}>
                        <Button type="primary" style={{ float: 'right' }} htmlType="submit">Zapisz</Button>
                    </FormItem>
                : ''}
            </Form>
        )
    }

}


export default Form.create()(EventForm);