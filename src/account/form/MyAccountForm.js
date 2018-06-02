import React from 'react';
import { Form, Input, Button, message } from 'antd';

import MyAccountAPI from './../api/MyAccountAPI';


const FormItem = Form.Item;


class MyAccountForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            user: nextProps.user
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const form = this.props.form;

        form.validateFields((err, values) => {
            if (err) return;

            console.log(values);

            delete values['userCategory'];
            delete values['permissions'];

            MyAccountAPI.updateUser(values.id, values)
                .then(response => {
                    this.setState({ user: response.data });
                    message.success('Twoje konto zostało zaktualizowane');
                }).catch(e => {
                    console.log(e);
                    message.error('Wystąpił błąd podczas wykonywania operacji');
                });
        });
    }

    getUserPermissions() {
        var permissionsOutput = [];
        if (this.state.user.permissions){
            this.state.user.permissions.forEach(permission => {
                permissionsOutput.push(
                    <span key={permission.id}>{permission.name}<br /></span>
                );
            });
        }

        return permissionsOutput;
    }
    

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;

        console.log(this.state.user);

        const formItemLayout = {
            labelCol: {
                xs: { span: 16 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        };

        return (
            <Form
                onSubmit={this.handleSubmit}>
                <FormItem>
                    {getFieldDecorator('id', {
                        initialValue: this.state.user.id
                    })(
                        <Input type="hidden" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Nazwa uzytkownika">
                    {getFieldDecorator('username', {
                        rules: [
                            { required: true, message: 'Proszę podać nazwę uzytkownika' }
                        ],
                        initialValue: this.state.user.username
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Kategoria uzytkownika">
                    {getFieldDecorator('userCategory', {
                        initialValue: this.state.user.userCategory ? this.state.user.userCategory.name : ''
                    })(
                        <Input disabled={true} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Twoje uprawnienia">
                    {this.getUserPermissions()}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Adres e-mail">
                    {getFieldDecorator('email', {
                        rules: [
                            { type: 'email', message: 'Proszę podać prawidłowy adres e-mail' }
                        ],
                        initialValue: this.state.user.email
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ float: 'right' }}>Zapisz</Button>
                </FormItem>
            </Form>
        )
    }

}


export default Form.create()(MyAccountForm);