import React from 'react';
import {
    Table,
    Popconfirm,
    Divider,
    message
} from 'antd';

import MonthlyBudgetAPI from './../api/MonthlyBudgetAPI';
import ExpensesModal from './../modals/ExpensesModal';


class MonthlyBudgetTable extends React.Component {

    months = {
        1: 'Styczeń',
        2: 'Luty',
        3: 'Marzec',
        4: 'Kwiecień',
        5: 'Maj',
        6: 'Czerwiec',
        7: 'Lipiec',
        8: 'Sierpień',
        9: 'Wrzesień',
        10: 'Październik',
        11: 'Listopad',
        12: 'Grudzień'
    };

    columns = [
        {
            title: 'Miesiąc',
            dataIndex: 'month',
            key: 'month',
            render: (text, record) => {
                return this.months[text];
            }
        },
        {
            title: 'Rok',
            dataIndex: 'year',
            key: 'year'
        },
        {
            title: 'Budzet',
            dataIndex: 'budget',
            key: 'budget'
        },
        {
            title: 'Wydatki całkowite',
            dataIndex: 'totalExpenses',
            key: 'totalExpenses',
            align: 'center'
        },
        {
            title: 'Budzet pozostały',
            dataIndex: 'budgetLeft',
            key: 'budgetLeft',
            align: 'center'
        },
        {
            title: 'Zarządzaj',
            dataIndex: 'manage',
            key: 'manage',
            render: (text, record) => (
                <span>
                    <span
                        style={{ cursor: 'pointer' }}>
                        Edytuj
                    </span>
                    <Divider type="vertical" />
                    <Popconfirm
                        title={ record.isDeleted ? 'Przywróc budzet miesięczny' : 'Usuń budzet miesięczny' }
                        okText={ record.isDeleted ? 'Przywróć' : 'Usuń' }
                        cancelText="Anuluj">
                        <a href="javascript:;">{ record.isDeleted ? 'Przywróc' : 'Usuń' }</a>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => this.showExpensesModal(record.id)}>
                        Wydatki
                    </span>
                </span>
            )
        }
    ]

    constructor() {
        super();

        this.state = {
            data: [],
            expensesModalVisible: false,
            selectedMonthlyBudget: {}
        };
    }

    componentWillMount() {
        this.fetchMonthlyBudgets();
    }

    fetchMonthlyBudgets = () => {
        MonthlyBudgetAPI.getMonthlyBudgets()
            .then(response => {
                this.setState({ data: response.data });
            }).catch(e => {
                message.error('Wystąpił błąd podczas zwracania wyników');
            });
    }

    showExpensesModal = (monthlyBudgetId) => {
        this.setState({
            expensesModalVisible: true,
            selectedMonthlyBudget: monthlyBudgetId
        });
    }

    render() {
        return (
            <div>
                <Table
                    rowKey={record => record.id}
                    columns={this.columns}
                    dataSource={this.state.data} />
                <ExpensesModal
                    visible={this.state.expensesModalVisible}
                    monthlyBudgetId={this.state.selectedMonthlyBudget} />
            </div>
        )
    }

}


export default MonthlyBudgetTable;