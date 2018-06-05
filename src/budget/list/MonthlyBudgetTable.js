import React from 'react';
import {
    Table,
    Popconfirm,
    Divider,
    message
} from 'antd';
import socketIOClient from 'socket.io-client';

import MonthlyBudgetAPI from './../api/MonthlyBudgetAPI';
import ExpensesModal from './../modals/ExpensesModal';


class MonthlyBudgetTable extends React.Component {

    static MONTHS = {
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

    static MONTHLY_BUDGETS_PER_PAGE = 10;
    static UPDATE_MONTHLY_BUDGET_LIST = 'UPDATE_MONTHLY_BUDGET_LIST';

    columns = [
        {
            title: 'Miesiąc',
            dataIndex: 'month',
            key: 'month',
            render: (text, record) => {
                return MonthlyBudgetTable.MONTHS[text];
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
                        style={{ cursor: 'pointer' }}
                        onClick={() => this.props.showMonthlyBudgetModal(record)}>
                        Edytuj
                    </span>
                    <Divider type="vertical" />
                    <Popconfirm
                        title={ record.isDeleted ? 'Przywróc budzet miesięczny' : 'Usuń budzet miesięczny' }
                        okText={ record.isDeleted ? 'Przywróć' : 'Usuń' }
                        onConfirm={() => this.deleteOrRestoreMonthlyBudget(record)}
                        cancelText="Anuluj">
                        <a href="javascript:;">{ record.isDeleted ? 'Przywróc' : 'Usuń' }</a>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => this.showExpensesModal(record)}>
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
            pagination: {},
            loading: false,
            expensesModalVisible: false,
            selectedMonthlyBudget: {},
            currentPage: null
        };

        const socket = socketIOClient('http://localhost:3000');

        socket.on(MonthlyBudgetTable.UPDATE_MONTHLY_BUDGET_LIST, () => {
            this.fetchMonthlyBudgets({ page: this.state.currentPage });
        });
    }

    componentWillMount() {
        this.countMonthlyBudgets();
        this.fetchMonthlyBudgets({ perPage: MonthlyBudgetTable.MONTHLY_BUDGETS_PER_PAGE });
    }

    deleteOrRestoreMonthlyBudget = (monthlyBudget) => {
        if (monthlyBudget.isDeleted) {
            this.restoreMonthlyBudget(monthlyBudget.id);
        } else {
            this.deleteMonthlyBudget(monthlyBudget.id);
        }
    }

    restoreMonthlyBudget = (monthlyBudgetId) => {
        MonthlyBudgetAPI.restoreMonthlyBudget(monthlyBudgetId)
            .then(response => {
                message.success('Przywrócono wybrany budzet miesięczny');
            }).catch(e => {
                message.error('Wystąpił błąd podczas wykonywania operacji');
            });
    }

    deleteMonthlyBudget = (monthlyBudgetId) => {
        MonthlyBudgetAPI.deleteMonthlyBudget(monthlyBudgetId)
            .then(response => {
                message.success('Usunięty wybrany budzet miesięczny');
            }).catch(e => {
                message.error('Wystąpił błąd podczas wykonywania operacji');
            });
    }

    fetchMonthlyBudgets = (params = {}) => {
        this.setState({ loading: true })
        MonthlyBudgetAPI.getMonthlyBudgets(params)
            .then(response => {

                const pagination = { ...this.state.pagination };
                pagination.total = this.state.total;

                this.setState({
                    data: response.data,
                    expensesModalVisible: false,
                    loading: false,
                    pagination
                });
            }).catch(e => {
                message.error('Wystąpił błąd podczas zwracania wyników');
            });
    }

    showExpensesModal = (monthlyBudget) => {
        this.setState({
            expensesModalVisible: true,
            selectedMonthlyBudget: monthlyBudget
        });
    }

    countMonthlyBudgets = () => {
        MonthlyBudgetAPI.countMonthlyBudgets()
            .then(response => {
                const pagination = {...this.state.pagination};
                pagination.total = response.data.numberOfRows;
                this.setState({ total: response.data.numberOfRows, pagination });
            });
    }

    handleTableChange = (pagination) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({ pagination: pager, currentPage: pagination.current });
        this.fetchMonthlyBudgets({ page: pagination.current });
    }

    render() {
        return (
            <div>
                <Table
                    rowKey={record => record.id}
                    columns={this.columns}
                    dataSource={this.state.data}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    onChange={this.handleTableChange}
                    rowClassName={(record) => { return record.isDeleted ? 'deleted-record' : ''; }} />
                <ExpensesModal
                    visible={this.state.expensesModalVisible}
                    monthlyBudget={this.state.selectedMonthlyBudget}
                    triggerFetchMonthlyBudgets={this.fetchMonthlyBudgets} />
            </div>
        )
    }

}


export default MonthlyBudgetTable;