import React, { Component } from 'react';
import {
    Form,
    Input,
    Select,
    Modal
} from 'antd';

import UsersAPI from '../api/UsersAPI';

const FormItem = Form.Item;
const Option = Select.Option;


class UserForm extends Component {

    static ADD_NEW_USER_TITLE = 'Dodaj nowego uzytkownika';
    static EDIT_USER_TITLE = 'Edytuj uzytkownika';

    state = {
        userCategories: [],
        permissions: [],
        currentUser: {},
        title: UserForm.ADD_NEW_USER_TITLE
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            currentUser: nextProps.currentUser,
            visible: nextProps.visible,
            title: nextProps.currentUser.id ? UserForm.EDIT_USER_TITLE : UserForm.ADD_NEW_USER_TITLE
        };
    }

    setUserCategories() {
        UsersAPI.getUserCategories()
            .then(response => {

                var tempUserCategories = [];
                response.data.forEach(userCategory => {
                    tempUserCategories.push(
                        <Option value={userCategory.id} key={userCategory.id}>{userCategory.name}</Option>
                    );
                });

                this.setState({ userCategories: tempUserCategories });
            }).catch(e => {
                console.log(e);
            });
    }

    setPermissions() {
        UsersAPI.getPermissions()
            .then(response => {

                var tempPermissions = [];
                response.data.forEach(permission => {
                    tempPermissions.push(
                        <Option value={permission.id.toString()} key={permission.id.toString()}>{permission.name}</Option>
                    );
                });

                this.setState({ permissions: tempPermissions });
            }).catch(e => {
                console.log(e);
            });
    }

    componentDidMount() {               
        this.setUserCategories();
        this.setPermissions();
    }

    comparePasswords = (rule, value, callback) => {
        const form = this.props.form;

        if (value && value !== form.getFieldValue('password')) {
            callback('Hasło i jego potwierdzenie są niezgodne!')
        } else {
            callback();
        }
    }

    comparePasswordWithConfirm = (rule, value, callback) => {
        const form = this.props.form;

        if (value) {
            form.validateFields(['confirmPassword'], { force: true });
        }
        
        callback();
    }

    getPermissionsIDs() {
        var permissions = this.state.currentUser.permissions;

        if (permissions && Array.isArray(permissions)) {
            var mappedPermissions = permissions.map(permission => {
                return permission.id.toString();
            });

            return mappedPermissions;
        } else {
            return [];
        }
    }

    render() {
        const { visible, form, onCancel, onOk } = this.props;
        const { getFieldDecorator } = form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        };

        return (
            <div>
                <Modal
                    title={this.state.title}
                    visible={visible}
                    onCancel={onCancel}
                    onOk={onOk}
                    cancelText="Anuluj"
                    okText="Dodaj"
                    width="700px">
                    <Form>
                        <FormItem
                            {...formItemLayout}>
                            {getFieldDecorator('id', {
                                initialValue: this.state.currentUser.id
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
                                initialValue: this.state.currentUser.username
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Kategoria uzytkownika">
                            {getFieldDecorator('userCategory', {
                                rules: [
                                    { required: true, message: 'Proszę wybrać kategorię uzytkownika' }
                                ],
                                initialValue: this.state.currentUser.userCategory ? this.state.currentUser.userCategory.id : ''
                            })(
                                <Select>
                                    {this.state.userCategories}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Hasło">
                            {getFieldDecorator('password', {
                                rules: [
                                    { validator: this.comparePasswordWithConfirm }
                                ]
                            })(
                                <Input type="password" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Powtórz hasło">
                            {getFieldDecorator('confirmPassword', {
                                rules: [
                                    { validator: this.comparePasswords }
                                ]
                            })(
                                <Input type="password" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Adres e-mail">
                            {getFieldDecorator('email', {
                                rules: [
                                    { type: 'email', message: 'Proszę podać prawidłowy adres e-mail' },
                                    { required: true, message: 'Proszę podać adres e-mail' }
                                ],
                                initialValue: this.state.currentUser.email
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Uprawnienia">
                            {getFieldDecorator('permissions', {
                                initialValue: this.getPermissionsIDs()
                            })(
                                <Select
                                    mode="multiple">
                                    {this.state.permissions}
                                </Select>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }

}


export default Form.create()(UserForm);