import React, { Component } from 'react';
import {
    Form,
    Input,
    Modal,
    DatePicker,
    InputNumber
} from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const TextArea = Input.TextArea;


class CarActivityForm extends Component {

    static ADD_CAR_ACTIVITY_TITLE = 'Dodaj aktywność dot. auta';
    static EDIT_CAR_ACTIVITY_TITLE = 'Edytuj aktywność dot. auta';

    state = {
        currentActivity: {},
        title: CarActivityForm.ADD_CAR_ACTIVITY_TITLE
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.currentActivity.id !== prevState.currentActivity.id) {
            return {
                currentActivity: nextProps.currentActivity,
                title: nextProps.currentActivity.id ? CarActivityForm.EDIT_CAR_ACTIVITY_TITLE : CarActivityForm.ADD_CAR_ACTIVITY_TITLE
            };
        }

        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.currentActivity !== prevState.currentActivity) {
            var activity = {};
            Object.assign(activity, this.state.currentActivity);
            activity.date = moment(activity.date);
            delete activity.key;
            this.props.form.setFieldsValue(activity);
        }
    }

    render() {
        const { visible, onCancel, onSave, form } = this.props;
        const { getFieldDecorator } = form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        };

        return (
            <Modal
                visible={visible}
                title={this.state.title}
                okText="Zapisz"
                cancelText="Anuluj"
                onCancel={onCancel}
                onOk={onSave}>
                <Form>
                    <FormItem
                        {...formItemLayout}>
                        {getFieldDecorator('id', {

                        })(
                            <Input type="hidden" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Aktywność">
                        {getFieldDecorator('activityName', {
                            rules: [
                                {
                                    required: true, message: 'Proszę wpisać nazwę czynności'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Data">
                        {getFieldDecorator('date', {
                            rules: [
                                { required: true, message: 'Proszę wybrać datę' }
                            ]
                        })(
                            <DatePicker placeholder="Wybierz datę" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Koszt">
                        {getFieldDecorator('price', {
                            rules: [
                                { required: true, message: 'Proszę podać kwotę' }
                            ]
                        })(
                            <InputNumber min={0} step={0.01} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Miejsce">
                        {getFieldDecorator('place',{

                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Przebieg (w km.)">
                        {getFieldDecorator('currentCourse', {

                        })(
                            <InputNumber min={0} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Dodatkowe informacje">
                        {getFieldDecorator('additionalInfo', {

                        })(
                            <TextArea rows={4} />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
    
}


export default Form.create()(CarActivityForm);