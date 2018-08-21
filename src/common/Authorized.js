import React from 'react';
import Cookies from 'universal-cookie';

import LogInForm from './login/LoginForm';
import Auth from './../utils/auth';
import EventsHandler from './../utils/events';

import AxiosAPI from './../utils/axios';


const cookies = new Cookies();



export default function IsAuthorized(WrappedComponent) {

    return class extends React.Component {

        constructor(props) {
            super(props);

            this.state = { isLoggedIn: (!!cookies.get('user') && !!cookies.get('_bat')) };

            if (!!cookies.get('_bat')) {
                AxiosAPI.getInstance().setToken(Auth.decryptToken(cookies.get('_bat')));
            }
        }

        componentWillMount() {
            EventsHandler.getInstance().on('INVALID_TOKEN', this.logOut);
        }

        compnentWillUnmount() {
            EventsHandler.getInstance().removeEventListener('INVALID_TOKEN', this.logOut);
        }

        setAsLoggedIn = (data) => {
            cookies.set('user', Auth.encryptUserData(data.user), { path: '/' });
            cookies.set('_bat', Auth.encryptText(data.token), { path: '/' });
            AxiosAPI.getInstance().setToken(data.token);
            this.setState({ isLoggedIn: true });
        }

        logOut = () => {
            cookies.remove('user');
            cookies.remove('_bat');
            this.setState({ isLoggedIn: false });
            window.location.href = '/';
        }

        updateUserData = (data) => {
            cookies.set('user', Auth.encryptUserData(data), { path: '/' });
        }

        render() {
            return this.state.isLoggedIn ? (
                <WrappedComponent
                    {...this.props}
                    logOut={this.logOut}
                    updateUserData={this.updateUserData} />
            ) : (
                <LogInForm setAsLoggedIn={this.setAsLoggedIn} />
            )
        }

    }
};