import React from 'react';
import { Menu, Icon } from 'antd';
import { withRouter } from 'react-router-dom';


const MenuItem = Menu.Item;


class TopMenu extends React.Component {

    handleLogout = () => {
        this.props.logOut();
    }

    handleClick = (e) => {
        if (e.key === 'logout') {
            this.handleLogout();
        } else if (e.key === 'myAccount') {
            this.props.history.push('/moje-konto');
        }
    }

    render() {
        return (
            <Menu
                mode="horizontal"
                style={{ display: 'flex', justifyContent: 'flex-end' }}
                onClick={this.handleClick}>
                <MenuItem key="myAccount">
                    <Icon type="user" />Moje konto
                </MenuItem>
                <MenuItem key="logout">
                    Wyloguj się
                </MenuItem>
            </Menu>
        );
    }

}


export default withRouter(TopMenu);