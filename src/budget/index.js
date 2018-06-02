import React from 'react';
import {
    Row
} from 'antd';

import MonthlyBudgetTable from './list/MonthlyBudgetTable';
import Auth from './../utils/auth';
import NotAuthorized from '../common/NotAuthorized';


class Budget extends React.Component {

    render() {
        var currentUser = Auth.getCurrentUser();
        var hasProperPermission = currentUser.permissions ? currentUser.permissions.findIndex(permission => {
            return permission.label === 'can-manage-monthly-budgets';
        }) : undefined;

        return typeof hasProperPermission !== 'undefined' && hasProperPermission >= 0 ? (
            <Row>
                <Row>
                    <MonthlyBudgetTable />
                </Row>
            </Row>
        ) : <NotAuthorized />
    }

}


export default Budget;