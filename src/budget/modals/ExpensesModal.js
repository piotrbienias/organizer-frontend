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
import MonthlyBudgetTable from './../list/MonthlyBudgetTable';


class ExpensesModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            monthlyBudget: {},
            expenses: [],
            deletedExpenses: []
        };
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.visible !== prevState.visible) {
            return {
                visible: nextProps.visible,
                monthlyBudget: nextProps.monthlyBudget,
                deletedExpenses: []
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
        MonthlyBudgetAPI.getMonthlyBudgetExpenses(this.state.monthlyBudget.id)
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
            
            MonthlyBudgetAPI.setMonthlyBudgetExpenses(monthlyBudgetId, filteredExpenses, this.state.deletedExpenses)
                .then(response => {
                    message.success('Budzet został zaktualizowany');
                    this.setState({ visible: false, deletedExpenses: [] });
                    this.props.triggerFetchMonthlyBudgets();
                }).catch(e => {
                    message.error('Wystąpił błąd podczas wykonywania operacji');
                });
        });
    }

    addDeletedExpense = (expenseId) => {
        if (expenseId) {
            this.setState({ deletedExpenses: this.state.deletedExpenses.concat(expenseId) });
        }
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    getModalTitle = () => {
        var title = 'Wydatki z danego miesiąca';

        if (this.state.monthlyBudget.id) {
            var month = MonthlyBudgetTable.MONTHS[this.state.monthlyBudget.month];
            title = `Wydatki - ${month} ${this.state.monthlyBudget.year}`;
        }

        return title;
    }

    render() {
        return (
            <Modal
                title={this.getModalTitle()}
                visible={this.state.visible}
                onCancel={this.hideModal}
                onOk={this.handleSubmit}
                width="750px">
                <ExpensesForm
                    wrappedComponentRef={this.saveFormRef}
                    monthlyBudgetId={this.state.monthlyBudget.id}
                    expenses={this.state.expenses}
                    addDeletedExpense={this.addDeletedExpense} />
            </Modal>

        );
    }

}


export default ExpensesModal;