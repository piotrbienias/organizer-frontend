import React, { Component } from 'react';
import {
    Table,
    Divider,
    Popover,
    Icon,
    Popconfirm,
    message
} from 'antd';

import CarActivityAPI from './api/CarActivityAPI';


class CarActivityTable extends Component {

    columns = [
        {
            title: 'Czynność',
            dataIndex: 'activityName',
            key: 'activity',
        },
        {
            title: 'Data',
            dataIndex: 'date',
            key: 'date',
            render: text => (
                <span>{new Date(text).toLocaleDateString()}</span>
            )
        },
        {
            title: 'Koszt',
            dataIndex: 'price',
            key: 'price'
        },
        {
            title: 'Miejsce naprawy',
            dataIndex: 'place',
            key: 'place'
        },
        {
            title: 'Przebieg',
            dataIndex: 'currentCourse',
            key: 'course'
        },
        {
            title: 'Dodatkowe informacje',
            dataIndex: 'additionalInfo',
            key: 'info',
            render: (text, record) => (
                <Popover
                    content={text}
                    title="Dodatkowe informacje"
                    trigger="click"
                    overlayStyle={{ width: '250px' }}>
                    <Icon
                        style={{ cursor: 'pointer' }}
                        type="info-circle-o" />
                </Popover>
            )
        },
        {
            title: 'Zarządzaj',
            dataIndex: 'manage',
            key: 'manage',
            render: (text, record) => (
                <span>
                    <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => this.props.showModalAndSetData(record)}>
                        Edytuj
                    </span>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="Czy chcesz usunąć wybraną aktywność?"
                        onConfirm={() => this.confirmDelete(record.id)}
                        onCancel={this.cancelDelete}
                        okText="Usuń"
                        cancelText="Anuluj">
                        <a href="#">Usuń</a>
                    </Popconfirm>
                </span>
            )
        }
    ];

    confirmDelete = (activityId) => {
        CarActivityAPI.deleteCarActivity(activityId)
            .then(response => {
                this.props.removeCarData(activityId);
                message.success('Wybrana aktywność została usunięta');
            }).catch(e => {
                console.log(e);
                message.error('Wystąpił błąd podczas usuwania aktywności');
            });
    }

    cancelDelete = (e, a) => {
        console.log(e);
    }

    render() {
        return (
            <Table columns={this.columns} dataSource={this.props.data} />
        )
    }

}


export default CarActivityTable;