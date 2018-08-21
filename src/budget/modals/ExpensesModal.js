import React from 'react';

import {
    Modal,
    message
} from 'antd';

import ExpensesForm from './../forms/ExpensesForm';
import MonthlyBudgetAPI from './../api/MonthlyBudgetAPI';
import MonthlyBudgetTable from './../list/MonthlyBudgetTable';


class ExpensesModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expensesModalVisible: false,
            monthlyBudget: {},
            expenses: [],
            deletedExpenses: []
        };
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.expensesModalVisible !== prevState.expensesModalVisible) {
            return {
                expensesModalVisible: nextProps.expensesModalVisible,
                monthlyBudget: nextProps.monthlyBudget,
                deletedExpenses: []
            };
        }

        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.expensesModalVisible && this.state.expensesModalVisible !== prevState.expensesModalVisible) {
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
        this.setState({ expensesModalVisible: false });
        this.props.hideExpensesModal();
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
                    this.setState({ expensesModalVisible: false, deletedExpenses: [] });
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
                visible={this.state.expensesModalVisible}
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