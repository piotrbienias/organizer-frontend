import React from 'react';
import {
    Tabs,
    Row
} from 'antd';

import MyAccountAPI from './api/MyAccountAPI';
import MyAccountForm from './form/MyAccountForm';
import ChangePasswordForm from './password/ChangePasswordForm';
import Auth from '../utils/auth';


const TabPane = Tabs.TabPane;


class MyAccount extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: {}
        };
    }

    componentWillMount() {
        var user = Auth.getCurrentUser();

        MyAccountAPI.getUserData(user.id)
            .then(response => {
                this.setState({ user: response.data });
            }).catch(e => {
                console.log(e);
            });
    }

    render() {
        return (
            <Row className="topRow">
                <Tabs
                    defaultActiveKey="myData">
                    <TabPane tab="Moje dane" key="myData">
                        <MyAccountForm
                            user={this.state.user} />
                    </TabPane>
                    <TabPane tab="Zmień hasło" key="changePassword">
                        <ChangePasswordForm
                            user={this.state.user} />
                    </TabPane>
                </Tabs>
            </Row>
        )
    }

}


export default MyAccount