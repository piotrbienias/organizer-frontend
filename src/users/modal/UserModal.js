import React from 'react';

import UsersAPI from './../api/UsersAPI';
import UserForm from './../form/UserForm';

import socketIOClient from 'socket.io-client';


class UserModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: props.visible ? props.visible : false,
            currentUser: props.currentUser ? props.currentUser : {},
            socket: socketIOClient('http://localhost:3000')
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.currentUser) {
            return {
                currentUser: nextProps.currentUser,
                visible: nextProps.visible
            };
        }

        return null;
    }

    showModal = () => {
        this.setState({ visible: true });
    }

    hideModal = () => {
        this.componentRef.props.form.resetFields();
        this.setState({ visible: false });
    }

    handleCancel = () => {
        this.hideModal();
    }

    addUser = (data) => {
        UsersAPI.addUser(data)
            .then(response => {
                this.hideModal();
            }).catch(e => {
                console.log(e);
            });
    }

    updateUser = (data) => {
        UsersAPI.updateUser(data.id, data)
            .then(response => {
                this.hideModal();
            }).catch(e => {
                console.log(e);
            });
    }

    handleSubmit = () => {
        const form = this.componentRef.props.form;

        form.validateFields((err, values) => {
            if (err) return;

            delete values['confirmPassword'];

            if (values.id && values.id !== '') {
                this.updateUser(values);
            } else {
                this.addUser(values);
            }
        });
    }

    saveComponentRef = (componentRef) => {
        this.componentRef = componentRef;
    }

    render() {
        return (
            <UserForm
                onCancel={this.handleCancel}
                onOk={this.handleSubmit}
                wrappedComponentRef={this.saveComponentRef}
                currentUser={this.state.currentUser}
                visible={this.state.visible} />
        )
    }

}


export default UserModal;