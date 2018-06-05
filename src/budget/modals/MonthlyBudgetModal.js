import React from 'react';
import {
    Modal,
    message
} from 'antd';

import MonthlyBudgetTable from './../list/MonthlyBudgetTable';
import MonthlyBudgetForm from './../forms/MonthlyBudgetForm';
import MonthlyBudgetAPI from '../api/MonthlyBudgetAPI';


class MonthlyBudgetModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: props.visible,
            monthlyBudget: props.monthlyBudget
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            visible: nextProps.visible,
            monthlyBudget: nextProps.monthlyBudget
        };
    }

    hideModal = () => {
        this.setState({ visible: false, monthlyBudget: {} });
        this.formRef.props.form.resetFields();
    }

    handleSubmit = () => {
        const form = this.formRef.props.form;

        form.validateFields((err, values) => {
            if (err) return;

            if (values.id && values.id !== '') {
                this.updateMonthlyBudget(values);
            } else {
                this.createMonthlyBudget(values);
            }

            form.resetFields();
            this.setState({ visible: false, monthlyBudget: {} });
        });
    }

    updateMonthlyBudget = (monthlyBudget) => {
        MonthlyBudgetAPI.updateMonthlyBudget(monthlyBudget)
            .then(response => {
                message.success('Budzet miesięczny został zaktualizowany');
            }).catch(e => {
                message.error('Wystąpił błąd podczas wykonywania operacji');
            });
    }

    createMonthlyBudget = (monthlyBudget) => {
        MonthlyBudgetAPI.createMonthlyBudget(monthlyBudget)
            .then(response => {
                message.success('Budzet miesięczny został dodany');
            }).catch(e => {
                message.error('Wystąpił błąd podczas wykonywania operacji');
            });
    }

    getModalTitle = () => {
        if (this.state.monthlyBudget.id) {
            var titlePart = MonthlyBudgetTable.MONTHS[this.state.monthlyBudget.month] + ' ' + this.state.monthlyBudget.year;
            return `Edytuj budzet miesięczny - ${titlePart}`;
        }

        return 'Dodaj budzet miesięczny';
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render() {
        return (
            <Modal
                title={this.getModalTitle()}
                visible={this.state.visible}
                onCancel={this.hideModal}
                onOk={this.handleSubmit}>
                <MonthlyBudgetForm
                    wrappedComponentRef={this.saveFormRef}
                    monthlyBudget={this.state.monthlyBudget} />
            </Modal>
        )
    }

}


export default MonthlyBudgetModal;