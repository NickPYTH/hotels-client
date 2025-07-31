import React from 'react';
import {Flex, Modal, Table, TableProps} from 'antd';
import {HistoryModel} from "entities/HistoryModel";
import {GuestModel} from "entities/GuestModel";

type ModalProps = {
    visible: boolean,
    setVisible: Function,
    history: HistoryModel[]
}

const Item = (props: { title: string, valueBefore: any, valueAfter: any }) => (
    <Flex style={{border: "1px solid #f0f0f0"}}>
        <Flex style={{width: 200}}>
            {props.title}
        </Flex>
        <Flex style={{width: 200}}>
            {props.valueBefore ? props.valueBefore : "Пусто"}
        </Flex>
        <Flex style={{width: 200}}>
            {props.valueAfter ? props.valueAfter : "Пусто"}
        </Flex>
    </Flex>
)

export const HistoryModal = (props: ModalProps) => {
    const columns: TableProps<HistoryModel>['columns'] = [
        {
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => (a.id && b.id) ? a.id - b.id : 0,
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
            render: (record, i) => (<div>{record.request?.id}</div>)
        },
        {
            title: 'Дата',
            render: (record, i) => (<div>{record.request?.date}</div>)
        },
        {
            title: 'Пользователь',
            render: (record, i) => (<div>{record.request?.user}</div>)
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
                    expandedRowRender: (row) => {
                        let stateBefore: GuestModel = JSON.parse(row.stateBefore);
                        let stateAfter: GuestModel = JSON.parse(row.stateAfter);
                        return (<p style={{margin: 0}}>
                            <Flex vertical>
                                <Flex>
                                    <Flex style={{width: 200, fontSize: 16, fontWeight: 700}}>
                                        Свойство
                                    </Flex>
                                    <Flex style={{width: 200, fontSize: 16, fontWeight: 700}}>
                                        Значение ДО
                                    </Flex>
                                    <Flex style={{width: 200, fontSize: 16, fontWeight: 700}}>
                                        Значение ПОСЛЕ
                                    </Flex>
                                </Flex>
                                <Item title={'Табельный номер'} valueBefore={stateBefore.tabnum} valueAfter={stateAfter.tabnum}/>
                                <Item title={'Фамилия'} valueBefore={stateBefore.lastname} valueAfter={stateAfter.lastname}/>
                                <Item title={'Имя'} valueBefore={stateBefore.firstname} valueAfter={stateAfter.firstname}/>
                                <Item title={'Отчество'} valueBefore={stateBefore.secondName} valueAfter={stateAfter.secondName}/>
                                <Item title={'Дата заселения'} valueBefore={stateBefore.dateStart} valueAfter={stateAfter.dateStart}/>
                                <Item title={'Дата выселения'} valueBefore={stateBefore.dateFinish} valueAfter={stateAfter.dateFinish}/>
                                <Item title={'Пол'} valueBefore={stateBefore.male ? "Мужской" : "Женский"} valueAfter={stateAfter.male ? "Мужской" : "Женский"}/>
                                <Item title={'Договор'} valueBefore={stateBefore.contract ? stateBefore.contract.docnum : "Пусто"}
                                      valueAfter={stateAfter.contract ? stateAfter.contract.docnum : "Пусто"}/>
                                <Item title={'Вид оплаты'} valueBefore={stateBefore.contract ? stateBefore.contract.billing : "Пусто"}
                                      valueAfter={stateAfter.contract ? stateAfter.contract.billing : "Пусто"}/>
                                <Item title={'Основание'} valueBefore={stateBefore.contract ? stateBefore.contract.reason.name : "Пусто"}
                                      valueAfter={stateAfter.contract ? stateAfter.contract.reason.name : "Пусто"}/>
                                <Item title={'Номер СЗ'} valueBefore={stateBefore.memo} valueAfter={stateAfter.memo}/>
                                <Item title={'Рег. по месту пребывания'} valueBefore={stateBefore.regPoMestu ? "Да" : "Нет"} valueAfter={stateAfter.regPoMestu ? "Да" : "Нет"}/>
                                <Item title={'Филиал'} valueBefore={stateBefore?.bed?.room?.flat.hotel.filial.name} valueAfter={stateAfter?.bed?.room?.flat.hotel.filial.name}/>
                                <Item title={'Общежитие'} valueBefore={stateBefore?.bed?.room.flat.hotel.name} valueAfter={stateAfter?.bed?.room.flat.hotel.name}/>
                                <Item title={'Секция'} valueBefore={stateBefore?.bed?.room.flat.name} valueAfter={stateAfter?.bed?.room.flat.name}/>
                                <Item title={'Комната'} valueBefore={stateBefore?.bed?.room.name} valueAfter={stateAfter?.bed?.room.name}/>
                                <Item title={'Место'} valueBefore={stateBefore?.bed?.name} valueAfter={stateAfter?.bed?.name}/>
                                <Item title={'Примечание'} valueBefore={stateBefore?.note} valueAfter={stateAfter?.note}/>
                            </Flex>
                        </p>)
                    },
                    rowExpandable: (record) => true,
                }}
            />
        </Modal>
    );
};
