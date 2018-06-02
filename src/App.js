import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import {
  Row,
  Col
} from 'antd';
import io from 'socket.io-client';

import './App.css';

import IsAuthorized     from './common/Authorized';

import SideMenu         from './menu/Menu';
import TopMenu          from './menu/TopMenu';
import Users            from './users';
import Car              from './car';
import Dashboard        from './dashboard';
import MyAccount        from './account';
import Budget           from './budget';



class App extends Component {

  render() {
    return (
      <Router>
        <Row className="main__row">
          <Col className="menu__col" span={4}><SideMenu /></Col>
          <Col span={20}>
            <Row>
              <TopMenu
                logOut={this.props.logOut}
                updateUserData={this.props.updateUserData} />
            </Row>
            <Row>
              <Col span={22} offset={1}>
                <Route exact path="/" component={Dashboard} />
                <Route path="/uzytkownicy" component={Users} />
                <Route path="/samochod" component={Car} />
                <Route path="/moje-konto" component={MyAccount} />
                <Route path="/wydatki" component={Budget} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Router>
    )
  }

}



export default IsAuthorized(App);