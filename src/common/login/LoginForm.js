import React from 'react';
import {
    Form,
    Input,
    Icon,
    Button
} from 'antd';
import axios from 'axios';


const FormItem = Form.Item;


class LogInForm extends React.Component {

    static WRONG_LOGIN_DATA_ERROR = 'Zła nazwa uzytkownika lub hasło';

    getContainerStyling = () => {
        return {
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const form = this.props.form;

        form.validateFields((err, values) => {
            if (err) return;

            axios.post('http://localhost:3000/auth/login/', values)
                .then(response => {
                    this.props.setAsLoggedIn(response.data);

                    form.resetFields();

                    return false;
                }).catch(e => {
                    console.log(e);
                    form.setFields({
                        username: {
                            errors: [new Error(LogInForm.WRONG_LOGIN_DATA_ERROR)]
                        },
                        password: {
                            errors: [new Error(LogInForm.WRONG_LOGIN_DATA_ERROR)]
                        }
                    });
                });
        });
    }

    render() {
        const { form } = this.props;

        const { getFieldDecorator } = form;

        const formItemLayout = {
            wrapperCol: {
                xs: { span: 48 },
                sm: { span: 32 }
            }
        };

        return (
            <div style={this.getContainerStyling()}>
                <div
                    style={{ border: '1px solid #d9d9d9', padding: 20, width: 400 }}>
                    <h1
                        style={{ textAlign: 'center', marginBottom: 30 }}>Organizer</h1>
                    <Form
                        onSubmit={this.handleSubmit}>
                        <FormItem
                            {...formItemLayout}>
                            {getFieldDecorator('username', {
                                rules: [
                                    { required: true, message: 'Proszę podać nazwę uzytkownika' }
                                ]
                            })(
                                <Input prefix={<Icon type="user" />} placeholder="Nazwa uzytkownika" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}>
                            {getFieldDecorator('password', {
                                rules: [
                                    { required: true, message: 'Proszę podać hasło' }
                                ]
                            })(
                                <Input prefix={<Icon type="lock" /> } type="password" placeholder="Hasło" />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ width: '100%' }}>Zaloguj się</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }

}


export default Form.create()(LogInForm);