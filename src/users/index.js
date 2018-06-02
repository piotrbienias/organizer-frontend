import React, { Component } from 'react';
import { Row, Button } from 'antd';

import UsersAPI from './api/UsersAPI';
import UsersTable from './list/UsersTable';
import UserModal from './modal/UserModal';

import Auth from './../utils/auth';
import NotAuthorized from './../common/NotAuthorized';
import socketIOClient from 'socket.io-client';



class Users extends Component {

    constructor() {
        super();

        this.state = {
            currentUser: {},
            showModal: false,
        };
    }

    showModal = (user) => {
        this.setState({ showModal: true, currentUser: user ? user : {} });
    }

    render() {
        var currentUser = Auth.getCurrentUser();
        var userCanManageUsers = currentUser.permissions ? currentUser.permissions.findIndex(permission => {
            return permission.label === 'can-manage-users'
        }) : undefined;

        return typeof userCanManageUsers !== 'undefined' && userCanManageUsers >= 0 ? (
            <Row>
                <Row type="flex" justify="end" className="topRow">
                    <Button
                        type="primary"
                        onClick={this.showModal}>Dodaj</Button>
                    <UserModal
                        currentUser={this.state.currentUser}
                        visible={this.state.showModal} />
                </Row>
                <Row>
                    <UsersTable
                        showEditUserModal={this.showModal} />
                </Row>
            </Row>
        ) : <NotAuthorized />
    }

}


export default Users;