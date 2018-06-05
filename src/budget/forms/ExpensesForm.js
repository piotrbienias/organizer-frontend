import React from 'react';
import {
    Form,
    Row,
    Input,
    DatePicker,
    Button,
    Icon,
    InputNumber
} from 'antd';

import moment from 'moment';


const FormItem = Form.Item;



class ExpensesForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            monthlyBudgetId: null,
            expenses: []
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            monthlyBudgetId: nextProps.monthlyBudgetId,
            expenses: nextProps.expenses
        };
    }

    addNewExpenseHTML = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');

        var expenses = this.state.expenses;
        expenses.push({});

        var newKeys = keys.concat(keys[keys.length - 1] + 1);

        form.setFieldsValue({
            keys: newKeys
        });
    }

    removeExpenseHTML = (index) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');

        var expenses = this.state.expenses;
        if (expenses[index] && expenses[index].id) {
            this.props.addDeletedExpense(expenses[index].id);
        }
        delete expenses[index];

        form.setFieldsValue({
            keys: keys.filter(key => key !== index)
        });
    }

    getExpensesHTML = () => {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 24, offset: 0 }
            }
        };

        let budgetHasExpenses = !!this.state.expenses;
        let expensesHTML = [];

        this.state.expenses.map((expense, index) => {
            expensesHTML.push(
                <Row
                    key={index}
                    style={{ textAlign: 'right' }}>
                    <FormItem>
                        {getFieldDecorator(`expenses[${index}['id']`, {
                            rules: [],
                            initialValue: expense.id
                        })(
                            <Input type="hidden" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}>
                        {getFieldDecorator(`expenses[${index}]['value']`, {
                            rules: [
                                { required: true, message: 'Proszę podać wartość' }
                            ],
                            initialValue: expense.value
                        })(
                            <InputNumber min={0} step={0.01} placeholder="Wartość" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}>
                        {getFieldDecorator(`expenses[${index}]['date']`, {
                            rules: [
                                { required: true, message: 'Proszę podać datę' }
                            ],
                            initialValue: moment(expense.date)
                        })(
                            <DatePicker />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}>
                        {getFieldDecorator(`expenses[${index}['description']`, {
                            rules: [
                                { required: true, message: 'Proszę podać opis' }
                            ],
                            initialValue: expense.description
                        })(
                            <Input style={{ width: '80%' }} placeholder="Opis" />
                        )}
                        {(
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                onClick={() => this.removeExpenseHTML(index)} />
                        )}
                    </FormItem>
                </Row>
            );
        });

        expensesHTML.push(
            <Row
                key="addNewExpenseHTML"
                style={{ textAlign: 'right' }}>
                <FormItem>
                    <Button
                        type="dashed"
                        onClick={this.addNewExpenseHTML}>
                        <Icon type="plus" />Dodaj wydatek
                    </Button>
                </FormItem>
            </Row>
        )

        return expensesHTML;
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        getFieldDecorator('keys', { initialValue: [...this.state.expenses.keys()] });

        return (
            <Form layout="inline">
                <FormItem
                    key="monthlyBudgetId">
                    {getFieldDecorator('monthlyBudgetId', {
                        rules: [],
                        initialValue: this.state.monthlyBudgetId
                    })(
                        <Input type="hidden" />
                    )}
                </FormItem>
                {this.getExpensesHTML()}
            </Form>
        )
    }

}


export default Form.create()(ExpensesForm);