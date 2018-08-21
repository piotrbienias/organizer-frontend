import React from 'react';
import {
    Form,
    InputNumber,
    Checkbox,
    DatePicker,
    Button,
    Alert,
    Icon,
    message
} from 'antd';
import moment from 'moment';

import EventAPI from '../api/EventAPI';


class RepeatEventForm extends React.Component {

    

    constructor(props) {
        super(props);

        this.state = {
            event: {},
            allowRepeat: false,
            loadingData: true
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.event.id !== prevState.event.id) {
            return {
                event: nextProps.event,
                allowRepeat: !!nextProps.event.repeatInterval,
                loadingData: false
            };
        }
        
        return null;
    }

    allowRepeat = (value) => {
        this.setState({ allowRepeat: !!value.target.checked });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const form = this.props.form;

        form.validateFields(null, { force: true }, (err, values) => {
            if (err) return;


            if (!values['doRepeat']) {
                EventAPI.deleteCycle(this.state.event.id)
                    .then(response => {
                        this.props.reloadEvent();
                        message.success('Wydarzenie zostało zaktualizowane');
                    }).catch(e => {
                        message.error('Wystąpił błąd podczas wykonywania operacji');
                    });
            } else {
                var data = this.state.event;
                Object.assign(data, values);
                
                EventAPI.updateCycle(this.state.event.id, data)
                    .then(response => {
                        console.log(response);
                    }).catch(e => {
                        message.error('Wystąpił błąd podczas wykonywania operacji');
                    });
            }
        });
        
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 }
            }
        };

        const checkboxItemLayout = {
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 6, offset: 4 }
            }
        };

        const submitItemLayout = {
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 10 }
            }
        };

        return this.state.loadingData ? <Icon type="loading" /> : (
            <Form
                onSubmit={this.handleSubmit}>
                <Form.Item
                    help="Odznaczenie tej opcji spowoduje usunięcie pozostałych wydarzeń z cyklu"
                    {...checkboxItemLayout}>
                    {getFieldDecorator('doRepeat', {
                        valuePropName: 'checked',
                        initialValue: this.state.allowRepeat
                    })(
                        <Checkbox
                            onChange={this.allowRepeat}>
                            Powtarzaj to wydarzenie
                        </Checkbox>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="Powtarzaj co">
                    {getFieldDecorator('repeatInterval', {
                        rules: [
                            { required: this.state.allowRepeat, message: 'Proszę podać częstotliwość powtarzania' }
                        ],
                        initialValue: this.state.event.repeatInterval
                    })(
                        <InputNumber
                            disabled={!this.state.allowRepeat}
                            min={0}
                            step={1}
                            formatter={value => `${value} ${value === '1' ? 'dzień' : 'dni'}`}
                            parser={value => value.replace(/[^d.]/g, '')} />
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="Powtarzaj do">
                    {getFieldDecorator('endDate', {
                        rules: [
                            { required: this.state.allowRepeat, message: 'Proszę podać datę ostatniego powtórzenia' }
                        ],
                        initialValue: this.state.event.endDate ? moment(this.state.event.endDate) : null
                    })(
                        <DatePicker
                            disabled={!this.state.allowRepeat} />
                    )}
                </Form.Item>
                <Form.Item
                    wrapperCol={{ xs: { span: 24 }, sm: { span: 10 } }}>
                    <Alert
                        message="UWAGA!"
                        description="Zmiana powyzszych danych spowoduje nadpisanie wszystkich wydarzeń z tego cyklu!"
                        type="error" />
                </Form.Item>
                <Form.Item
                    {...submitItemLayout}>
                    <Button
                        style={{ float: 'right' }}
                        type="primary"
                        htmlType="submit">Zapisz</Button>
                </Form.Item>
            </Form>
        )
    }

}


export default Form.create()(RepeatEventForm);