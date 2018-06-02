import React, { Component } from 'react';
import { Row } from 'antd';

import CarActivityAPI from './api/CarActivityAPI';
import CarActivityTable from './CarActivityTable';
import CarActivityModal from './carActivityModal/CarActivityModal';

import Auth from './../utils/auth';
import NotAuthorized from './../common/NotAuthorized';


class Car extends Component {

    state = {
        data: [],
        currentActivity: {},
        showModal: false
    };

    constructor() {
        super();

        this.updateCarData = this.updateCarData;
    }

    removeCarData = (dataId) => {
        this.state.data.forEach((singleData, index) => {
            if (singleData.id === dataId) {
                this.state.data.splice(index, 1);
                this.setState({ data: this.state.data });
            }
        });
    }

    addCarData = (data) => {
        data.key = data.id;
        this.state.data.unshift(data);
        this.setState({ data: this.state.data });
    }

    updateCarData = (data) => {
        var existingObjArr = this.state.data.filter(activity => {
            return activity.key === data.id
        });

        if (existingObjArr.length === 1) {
            var existingObj = {};
            var tempState = {};
            
            Object.assign(tempState, this.state);
            Object.assign(existingObj, existingObjArr[0]);

            this.state.data.forEach((activity, i) => {
                if (activity.key === existingObj.key){
                    data.key = data.id;
                    tempState.data[i] = data;
                }
            });

            tempState.showModal = false;
            this.setState(tempState);
        }
    }

    componentDidMount() {
        CarActivityAPI.getCarActivities()
            .then(response => {
                response.data.map(activity => {
                    activity.key = activity.id;
                    return activity;
                })

                this.setState({ data: response.data });
            });
        
    }

    showModalAndSetData = (record) => {
        this.setState({ currentActivity: record, showModal: true });
    }

    render() {
        const { data } = this.state;
        var currentUser = Auth.getCurrentUser();
        var userCanManageCarActivities = currentUser.permissions ? currentUser.permissions.findIndex(permission => {
            return permission.label === 'can-manage-car-activities';
        }) : undefined;

        return typeof userCanManageCarActivities !== 'undefined' && userCanManageCarActivities >= 0 ? (
            <Row>
                <Row type="flex" justify="end" className="topRow">
                    <CarActivityModal
                        currentActivity={this.state.currentActivity}
                        updateCarData={this.updateCarData}
                        addCarData={this.addCarData}
                        showModal={this.state.showModal} />
                </Row>
                <Row>
                    <CarActivityTable
                        data={data}
                        showModalAndSetData={this.showModalAndSetData}
                        removeCarData={this.removeCarData} />
                </Row>
            </Row>
        ) : <NotAuthorized />
    }

}


export default Car;