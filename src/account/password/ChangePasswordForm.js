import React from 'react';
import { Form, Input, Button, message } from 'antd';

import MyAccountAPI from './../api/MyAccountAPI';


const FormItem = Form.Item;


class ChangePasswordForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: props.user
        };
    }
    
    handleSubmit = (e) => {
        e.preventDefault();

        const form = this.props.form;

        form.validateFields((err, values) => {
            if (err) return;

            console.log(values);

            delete values['confirmPassword'];

            MyAccountAPI.updateUserPassword(values['password'])
                .then(response => {
                    console.log(response);
                    message.success('Twoje hasło zostało zmienione');
                }).catch(e => {
                    message.error('Wystąpił błąd podczas wykonywania operacji');
                });
        });
    }

    comparePasswords = (rule, value, callback) => {
        const form = this.props.form;

        if (value && value !== form.getFieldValue('password')) {
            callback('Hasło i jego potwierdzenie są niezgodne')
        } else {
            callback();
        }
    }

    validateCompare = (rule, value, callback) => {
        const form = this.props.form;

        if (value) {
            form.validateFields(['confirmPassword'], { force: true });
        }

        callback();
    }

    render() {
        const { getFieldDecorator } = this.props.form;

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
                <FormItem
                    {...formItemLayout}
                    label="Nowe hasło">
                    {getFieldDecorator('password', {
                        rules: [
                            { required: true, message: 'Proszę podać nowe hasło' },
                            { validator: this.validateCompare }
                        ]
                    })(
                        <Input type="password" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Powtórz nowe hasło">
                    {getFieldDecorator('confirmPassword', {
                        rules: [
                            { required: true, message: 'Proszę podać potwierdzenie hasła' },
                            { validator: this.comparePasswords }
                        ]
                    })(
                        <Input type="password" />
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


export default Form.create()(ChangePasswordForm);