import React, { Component } from 'react';
import { Button } from 'antd';

import CarActivityAPI from './../api/CarActivityAPI';
import CarActivityForm from './CarActivityForm';


class CarActivityModal extends Component {

    state = {
        visible: false,
        currentActivity: this.props.currentActivity
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            currentActivity: nextProps.currentActivity,
            visible: nextProps.showModal
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.visible !== prevState.visible && this.state.visible ) {
            this.showModal();
        }
    }

    showModal = () => {
        this.setState({ visible: true });
    }

    handleCancel = (e) => {
        const form = this.formRef.props.form;
        form.resetFields();
        this.setState({ visible: false, currentActivity: {} });
    }

    handleSave = (e) => {
        const form = this.formRef.props.form;

        form.validateFields((err, values) => {
            if (err) return;

            var date = values.date;
            values['date'] = date.toISOString();

            if (values.id && values.id !== '') {
                CarActivityAPI.updateCarActivity(values.id, values)
                    .then(response => {
                        form.resetFields();
                        this.setState({ visible: false });
                        this.props.updateCarData(response.data);
                    }).catch(e => {
                        console.log(e);
                    });
            } else {
                CarActivityAPI.createCarActivity(values)
                    .then(response => {
                        form.resetFields();
                        this.setState({ visible: false });
                        this.props.addCarData(response.data);
                    }).catch(e => {
                        console.log(e);
                    });
            }
            
        });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render() {
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>Dodaj</Button>
                <CarActivityForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    currentActivity={this.state.currentActivity}
                    onCancel={this.handleCancel}
                    onSave={this.handleSave} />
            </div>
        )
    }

}


export default CarActivityModal;