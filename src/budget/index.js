import React from 'react';
import {
    Row,
    Button
} from 'antd';

import MonthlyBudgetTable from './list/MonthlyBudgetTable';
import Auth from './../utils/auth';
import NotAuthorized from '../common/NotAuthorized';
import MonthlyBudgetModal from './modals/MonthlyBudgetModal';


class Budget extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            monthlyBudgetModalVisible: false,
            monthlyBudget: {}
        };
    }

    showMonthlyBudgetModal = (monthlyBudget = {}) => {
        this.setState({ monthlyBudgetModalVisible: true, monthlyBudget: monthlyBudget });
    }

    render() {
        var currentUser = Auth.getCurrentUser();
        var hasProperPermission = currentUser.permissions ? currentUser.permissions.findIndex(permission => {
            return permission.label === 'can-manage-monthly-budgets';
        }) : undefined;

        return typeof hasProperPermission !== 'undefined' && hasProperPermission >= 0 ? (
            <Row>
                <Row type="flex" justify="end" className="topRow">
                    <Button
                        type="primary"
                        onClick={this.showMonthlyBudgetModal}>Dodaj</Button>
                    <MonthlyBudgetModal
                        visible={this.state.monthlyBudgetModalVisible}
                        monthlyBudget={this.state.monthlyBudget} />
                </Row>
                <Row>
                    <MonthlyBudgetTable
                        showMonthlyBudgetModal={this.showMonthlyBudgetModal} />
                </Row>
            </Row>
        ) : <NotAuthorized />
    }

}


export default Budget;