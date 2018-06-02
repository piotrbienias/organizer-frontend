import React from 'react';

import {
    Modal,
    Row,
    Form,
    Input,
    message
} from 'antd';

import ExpensesForm from './../forms/ExpensesForm';
import MonthlyBudgetAPI from './../api/MonthlyBudgetAPI';


class ExpensesModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            monthlyBudgetId: {},
            expenses: []
        };
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.visible !== prevState.visible) {
            return {
                visible: nextProps.visible,
                monthlyBudgetId: nextProps.monthlyBudgetId
            };
        }

        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.visible && this.state.visible !== prevState.visible) {
            this.getMonthlyBudgetExpenses();
        }
    }

    getMonthlyBudgetExpenses = () => {
        MonthlyBudgetAPI.getMonthlyBudgetExpenses(this.state.monthlyBudgetId)
            .then(response => {
                this.setState({ expenses: response.data });
            }).catch(e => {
                message.error('Wystąpił błąd podczas wykonywania operacji');
            });
    }

    hideModal = () => {
        this.setState({ visible: false });
    }

    handleSubmit = () => {
        const form = this.formRef.props.form;

        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            var monthlyBudgetId = values['monthlyBudgetId'];
            var filteredExpenses = [];
            delete values['monthlyBudgetId'];

            values.expenses.forEach(expense => {
                if (expense){
                    expense.date = expense.date.toISOString();
                    expense.monthlyBudget = monthlyBudgetId;
                    filteredExpenses.push(expense);
                }
            });
            
            MonthlyBudgetAPI.setMonthlyBudgetExpenses(monthlyBudgetId, filteredExpenses)
                .then(response => {
                    message.success('Budzet został zaktualizowany');
                    this.setState({ visible: false });
                }).catch(e => {
                    message.error('Wystąpił błąd podczas wykonywania operacji');
                });
        });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render() {
        return (
            <Modal
                title="Wydatki z danego miesiąca"
                visible={this.state.visible}
                onCancel={this.hideModal}
                onOk={this.handleSubmit}
                width="750px">
                <ExpensesForm
                    wrappedComponentRef={this.saveFormRef}
                    monthlyBudgetId={this.state.monthlyBudgetId}
                    expenses={this.state.expenses} />
            </Modal>

        );
    }

}


export default ExpensesModal;