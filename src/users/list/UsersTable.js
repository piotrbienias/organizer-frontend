import React, { Component } from 'react';
import { Table, Divider, Popconfirm, message } from 'antd';
import socketIOClient from 'socket.io-client';

import UsersAPI from '../api/UsersAPI';


class UsersTable extends Component {

    static RESTORE_USER_QUESTION = 'Czy chcesz przywrócić tego uzytkownika?';
    static DELETE_USER_QUESTION = 'Czy chcesz usunąć tego uzytkownika?';

    static USERS_PER_PAGE = 10;
    static UPDATE_USER_LIST_EVENT = 'UPDATE_USER_LIST';

    columns = [
        {
            title: 'Nazwa uzytkownika',
            dataIndex: 'username',
            key: 'username',
            render: text => <span>{text}</span>
        },
        {
            title: 'Kategoria uzytkownika',
            dataIndex: 'userCategory',
            key: 'userCategory',
            render: userCategory => <span>{userCategory ? userCategory.name : ''}</span>
        },
        {
            title: 'Zarządzaj',
            dataIndex: 'manage',
            key: 'manage',
            render: (text, record) => (
                <span>
                    <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => this.props.showEditUserModal(record)}>
                        Edytuj
                    </span>
                    <Divider type="vertical" />
                    <Popconfirm
                        title={record.isDeleted ? UsersTable.RESTORE_USER_QUESTION : UsersTable.DELETE_USER_QUESTION}
                        onConfirm={() => this.deleteUser(record) }
                        onCancel={() => console.log('canceled')}
                        okText={record.isDeleted ? 'Przywróć' : 'Usuń'}
                        cancelText="Anuluj">
                        <a href="javascript:;">{record.isDeleted ? 'Przywróc' : 'Usuń'}</a>
                    </Popconfirm>
                </span>
            )
        }
    ];

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            pagination: {},
            loading: false,
            total: null,
            currentPage: null
        };

        const socket = socketIOClient('http://localhost:3000');

        socket.on(UsersTable.UPDATE_USER_LIST_EVENT, (user) => {
            this.fetchUsers({ page: this.state.currentPage });
        });

    }

    deleteUser = (user) => {
        var method = user.isDeleted ? 'restoreUser' : 'deleteUser';
        var successMessage = user.isDeleted ? 'Uzytkownik został przywrócony' : 'Uzytkownik został usunięty';

        UsersAPI[method](user.id)
            .then(response => {
                message.success(successMessage);
            }).catch(e => {
                message.error('Wystąpił błąd podczas edycji uzytkownika');
            });
    }

    handleTableChange = (pagination) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;

        this.setState({ pagination: pager, currentPage: pagination.current });

        this.fetchUsers({
            perPage: UsersTable.USERS_PER_PAGE,
            page: pagination.current
        });
    }

    fetchUsers = (params = {}) => {
        this.setState({ loading: true });
        UsersAPI.getUsers(params)
            .then(response => {

                const pagination = { ...this.state.pagination };
                pagination.total = this.state.total;

                this.setState({
                    data: response.data,
                    loading: false,
                    pagination
                })
            })
    }

    componentDidMount() {
        this.getUsersCount();
        this.fetchUsers({ perPage: UsersTable.USERS_PER_PAGE });
    }

    getUsersCount = () => {
        UsersAPI.getUsersCount()
            .then(response => {
                const pagination = { ...this.state.pagination };
                pagination.total = response.data.numberOfRows;
                this.setState({ total: response.data.numberOfRows, pagination });
            });
    }

    render() {
        return (
            <Table
                pagination={this.state.pagination}
                rowKey={record => record.id}
                columns={this.columns}
                loading={this.state.loading}
                dataSource={this.state.data}
                onChange={this.handleTableChange}
                rowClassName={(record) => { return record.isDeleted ? 'deleted-record' : ''; }}/>
        )
    }

}


export default UsersTable;