import React, { Component } from 'react';
import { Menu } from 'antd';
import { withRouter } from 'react-router-dom';

import Auth from './../utils/auth';
import { checkIfPermissionExists } from './../utils/functions';


class SideMenu extends Component {

    static PERMISION_CAN_MANAGE_USERS               = 'can-manage-users';
    static PERMISSION_CAN_MANAGE_CAR_ACTIVITIES     = 'can-manage-car-activities';
    static PERMISSION_CAN_MANAGE_MONTHLY_BUDGETS    = 'can-manage-monthly-budgets';

    constructor() {
        super();

        this.state = { current: 'uzytkownicy' };
    }

    componentDidMount() {
        var pathname = this.props.location.pathname;
        pathname = pathname.substr(1, pathname.length);
        this.setState({ current: pathname });
    }

    handleClick = (item) => {
        if (item.key){
            this.props.history.push('/' + item.key);
            this.setState({ current: item.key });
        }
    }

    generateMenuBasedOnAuth = () => {
        var currentUser = Auth.getCurrentUser();
        var menuElements = [];

        if (currentUser && Array.isArray(currentUser.permissions)) {
            var permissions = currentUser.permissions;

            if (checkIfPermissionExists(permissions, SideMenu.PERMISION_CAN_MANAGE_USERS)) {
                menuElements.push(
                    <Menu.Item key="uzytkownicy">
                        <span href="/uzytkownicy/" rel="noopener noreferrer">Uzytkownicy</span>
                    </Menu.Item>
                );
            }

            if (checkIfPermissionExists(permissions, SideMenu.PERMISSION_CAN_MANAGE_CAR_ACTIVITIES)) {
                menuElements.push(
                    <Menu.Item key="samochod">
                        <span href="/samochod/" rel="noopener noreferrer">Samochód</span>
                    </Menu.Item>
                );
            }

            if (checkIfPermissionExists(permissions, SideMenu.PERMISSION_CAN_MANAGE_MONTHLY_BUDGETS)) {
                menuElements.push(
                    <Menu.Item key="wydatki">
                        <span href="/wydatki/" rel="noopener noreferrer">Wydatki</span>
                    </Menu.Item>
                )
            }
        }

        return menuElements;
    }

    render() {
        return (
            <div style={{ height: '100%', borderRight: '1px solid #d9d9d9' }}>
                <div
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 30, paddingBottom: 30 }}>
                    <img
                        src="https://cdn.worldvectorlogo.com/logos/react.svg"
                        style={{ width: 100, height: 'auto' }}
                        alt="React logo" />
                </div>
                <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    theme="light"
                    mode="inline"
                    style={{ height: '100%' }}>
                    {this.generateMenuBasedOnAuth()}
                </Menu>
            </div>
        )
    }

}


export default withRouter(SideMenu);
