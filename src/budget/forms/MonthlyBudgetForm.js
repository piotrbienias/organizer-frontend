import React from 'react';
import {
    Form,
    InputNumber,
    Select,
    Input
} from 'antd';

import MonthlyBudgetTable from './../list/MonthlyBudgetTable';


const FormItem = Form.Item;
const Option = Select.Option;


class MonthlyBudgetForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            monthlyBudget: props.monthlyBudget || {}
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            monthlyBudget: nextProps.monthlyBudget
        };
    }

    getMonthSelectOptions = () => {
        var options = [];
        for(var i = 1; i <= 12; i++) {
            options.push(
                <Option key={`month_${i}`} value={i}>{MonthlyBudgetTable.MONTHS[i]}</Option>
            );
        }

        return options;
    }

    render() {
        const { getFieldDecorator } = this.props.form;

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
            <Form>
                <FormItem>
                    {getFieldDecorator('id', {
                        rules: [],
                        initialValue: this.state.monthlyBudget ? this.state.monthlyBudget.id : ''
                    })(
                        <Input type="hidden" />
                    )}
                </FormItem>
                <FormItem
                    label="Miesiąc"
                    {...formItemLayout}>
                    {getFieldDecorator('month', {
                        rules: [
                            { required: true, message: 'Proszę wybrać miesiąc' }
                        ],
                        initialValue: this.state.monthlyBudget ? this.state.monthlyBudget.month : ''
                    })(
                        <Select>
                            {this.getMonthSelectOptions()}
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    label="Rok"
                    {...formItemLayout}>
                    {getFieldDecorator('year', {
                        rules: [
                            { required: true, message: 'Proszę podać rok' }
                        ],
                        initialValue: this.state.monthlyBudget ? this.state.monthlyBudget.year : ''
                    })(
                        <InputNumber min={0} step={1} max={9999} />
                    )}
                </FormItem>
                <FormItem
                    label="Budzet"
                    {...formItemLayout}>
                    {getFieldDecorator('budget', {
                        rules: [
                            { required: true, message: 'Proszę podać budzet' }
                        ],
                        initialValue: this.state.monthlyBudget ? this.state.monthlyBudget.budget : ''
                    })(
                        <InputNumber min={0} step={0.01} />
                    )}
                </FormItem>
            </Form>
        )
    }

}


export default Form.create()(MonthlyBudgetForm);