import React from 'react';
import {Modal, Table, TableProps} from 'antd';
import {HistoryModel} from "../../model/HistoryModel";

type ModalProps = {
    visible: boolean,
    setVisible: Function,
    history: HistoryModel[]
}
export const HistoryModal = (props: ModalProps) => {
    const columns: TableProps<HistoryModel>['columns'] = [
        {
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend'
        },
        {
            title: 'ИД записи проживания',
            dataIndex: 'entityId',
            key: 'entityId',
        },
        {
            title: 'ИД запроса',
            render: (record, i) => (<div>{record.request.id}</div>)
        },
        {
            title: 'Дата',
            render: (record, i) => (<div>{record.request.date}</div>)
        },
        {
            title: 'Пользователь',
            render: (record, i) => (<div>{record.request.user}</div>)
        },
        {
            title: 'Состояние до изменения',
            dataIndex: 'stateBefore',
            key: 'stateBefore',
            hidden: true
        },
        {
            title: 'Состояние после изменения',
            dataIndex: 'stateAfter',
            key: 'stateAfter',
            hidden: true
        },
    ]
    return (
        <Modal title={"История"}
               open={props.visible}
               onCancel={() => props.setVisible(false)}
               width={window.innerWidth - 50}
        >
            <Table
                style={{width: '100vw'}}
                columns={columns}
                dataSource={props.history.map((h: HistoryModel) => ({...h, key: h.id}))}
                pagination={{
                    defaultPageSize: 100,
                }}
                onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: (e) => {

                        },
                    };
                }}
                expandable={{
                    expandedRowRender: (record) => <p style={{margin: 0}}>
                        <div>Измененные свойства:</div>
                        <div>{JSON.parse(record.stateBefore).tabnum != JSON.parse(record.stateAfter).tabnum && `Табельный номер: ${JSON.parse(record.stateBefore).tabnum} ---> ${JSON.parse(record.stateAfter).tabnum}`}</div>
                        <div>{JSON.parse(record.stateBefore).firstname != JSON.parse(record.stateAfter).firstname && `Имя: ${JSON.parse(record.stateBefore).firstname} ---> ${JSON.parse(record.stateAfter).firstname}`}</div>
                        <div>{JSON.parse(record.stateBefore).lastname != JSON.parse(record.stateAfter).lastname && `Фамилия: ${JSON.parse(record.stateBefore).lastname} ---> ${JSON.parse(record.stateAfter).lastname}`}</div>
                        <div>{JSON.parse(record.stateBefore).secondName != JSON.parse(record.stateAfter).secondName && `Отчество: ${JSON.parse(record.stateBefore).secondName} ---> ${JSON.parse(record.stateAfter).secondName}`}</div>
                        <div>{JSON.parse(record.stateBefore).dateStart != JSON.parse(record.stateAfter).dateStart && `Дата заселения: ${JSON.parse(record.stateBefore).dateStart} ---> ${JSON.parse(record.stateAfter).dateStart}`}</div>
                        <div>{JSON.parse(record.stateBefore).dateFinish != JSON.parse(record.stateAfter).dateFinish && `Дата выселения: ${JSON.parse(record.stateBefore).dateFinish} ---> ${JSON.parse(record.stateAfter).dateFinish}`}</div>
                        <div>{JSON.parse(record.stateBefore).male != JSON.parse(record.stateAfter).male && `Пол: ${JSON.parse(record.stateBefore).male} ---> ${JSON.parse(record.stateAfter).male}`}</div>
                        <div>{JSON.parse(record.stateBefore).contractId != JSON.parse(record.stateAfter).contractId && `ИД договора: ${JSON.parse(record.stateBefore).contractId} ---> ${JSON.parse(record.stateAfter).contractId}`}</div>
                        <div>{JSON.parse(record.stateBefore).memo != JSON.parse(record.stateAfter).memo && `Номер марш. листа / служебного задания: ${JSON.parse(record.stateBefore).memo} ---> ${JSON.parse(record.stateAfter).memo}`}</div>
                        <div>{JSON.parse(record.stateBefore).billing != JSON.parse(record.stateAfter).billing && `Вид оплаты: ${JSON.parse(record.stateBefore).billing} ---> ${JSON.parse(record.stateAfter).billing}`}</div>
                        <div>{JSON.parse(record.stateBefore).reason != JSON.parse(record.stateAfter).reason && `Основание: ${JSON.parse(record.stateBefore).reason} ---> ${JSON.parse(record.stateAfter).reason}`}</div>
                        <div>{JSON.parse(record.stateBefore).regPoMestu != JSON.parse(record.stateAfter).regPoMestu && `Рег. по месту пребывания: ${JSON.parse(record.stateBefore).regPoMestu} ---> ${JSON.parse(record.stateAfter).regPoMestu}`}</div>
                        <div>{JSON.parse(record.stateBefore).filialId != JSON.parse(record.stateAfter).filialId && `ИД филиала: ${JSON.parse(record.stateBefore).filialId} ---> ${JSON.parse(record.stateAfter).filialId}`}</div>
                        <div>{JSON.parse(record.stateBefore).hotelId != JSON.parse(record.stateAfter).hotelId && `ИД общежития: ${JSON.parse(record.stateBefore).hotelId} ---> ${JSON.parse(record.stateAfter).hotelId}`}</div>
                        <div>{JSON.parse(record.stateBefore).flatId != JSON.parse(record.stateAfter).flatId && `ИД секции: ${JSON.parse(record.stateBefore).flatId} ---> ${JSON.parse(record.stateAfter).flatId}`}</div>
                        <div>{JSON.parse(record.stateBefore).roomId != JSON.parse(record.stateAfter).roomId && `ИД комнаты: ${JSON.parse(record.stateBefore).roomId} ---> ${JSON.parse(record.stateAfter).roomId}`}</div>
                        <div>{JSON.parse(record.stateBefore).bedName != JSON.parse(record.stateAfter).bedName && `Имя места: ${JSON.parse(record.stateBefore).bedName} ---> ${JSON.parse(record.stateAfter).bedName}`}</div>


                    </p>,
                    rowExpandable: (record) => true,
                }}
            />
        </Modal>
    );
};
