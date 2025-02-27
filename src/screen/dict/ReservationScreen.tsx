import React, {useEffect, useState} from 'react';
import {Button, Flex, message, Popconfirm, Spin, Table, TableProps} from 'antd';
import {ReservationModel} from "../../model/ReservationModel";
import {reservationAPI} from "../../service/ReservationService";
import dayjs from "dayjs";
import {BedModel} from "../../model/BedModel";
import {EventModel} from "../../model/EventModel";
import {FilialModel} from "../../model/FilialModel";
import {ReservationModal} from "../../component/dict/ReservationModal";
import {UserAddOutlined, UsergroupAddOutlined} from "@ant-design/icons";
import {GroupReservationModal} from "../../component/hotel/GroupReservationModal";

const ReservationScreen: React.FC = () => {

    // States
    const [messageApi, messageContextHolder] = message.useMessage();
    const [visibleSingleReservationModal, setVisibleSingleReservationModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<ReservationModel | null>(null);
    const [visibleGroupReservationModal, setVisibleGroupReservationModal] = useState(false);
    // -----

    // Web requests
    const [getAll, {
        data: reservations,
        isLoading: isReservationsLoading
    }] = reservationAPI.useGetAllMutation();
    const [deleteReservation, {
        data: deletedReservation,
    }] = reservationAPI.useDeleteMutation();
    // -----

    // Useful utils
    const showWarningMsg = (msg: string) => {
        messageApi.warning(msg);
    };
    // -----

    // Effects
    useEffect(() => {
        getAll();
    }, []);
    useEffect(() => {
        if (!visibleSingleReservationModal) setSelectedReservation(null);
    }, [visibleSingleReservationModal]);
    useEffect(() => {
        if (deletedReservation) getAll();
    }, [deletedReservation]);
    // -----

    // Useful utils
    const columns: TableProps<ReservationModel>['columns'] = [
        {
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend'
        },
        {
            title: 'Тип мероприятия',
            dataIndex: 'event',
            key: 'eventType',
            render: (val: EventModel, record: ReservationModel) => (<div>{val.type.name}</div>)
        },
        {
            title: 'Мероприятие',
            dataIndex: 'event',
            key: 'event',
            render: (val: EventModel, record: ReservationModel) => (<div>{val.name}</div>)
        },
        {
            title: 'Филиал заказчик',
            dataIndex: 'fromFilial',
            key: 'fromFilial',
            render: (val: FilialModel, record: ReservationModel) => (<div>{val.name}</div>)
        },
        {
            title: 'Табельный номер',
            dataIndex: 'tabnum',
            key: 'tabnum',
            sorter: (a, b) => a.tabnum - b.tabnum,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Дата заезда',
            dataIndex: 'dateStart',
            key: 'dateStart',
            sorter: (a, b) => dayjs(a.dateStart, 'DD-MM-YYYY').diff(dayjs(b.dateStart, 'DD-MM-YYYY')),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Дата выезда',
            dataIndex: 'dateFinish',
            key: 'dateFinish',
            sorter: (a, b) => dayjs(a.dateFinish, 'DD-MM-YYYY').diff(dayjs(b.dateFinish, 'DD-MM-YYYY')),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Филиал',
            dataIndex: 'bed',
            key: 'filial',
            render: (val: BedModel, record: ReservationModel) => (<div>{val.room?.flat?.hotel?.filial?.name}</div>)
        },
        {
            title: 'Общежитие',
            dataIndex: 'bed',
            key: 'hotel',
            render: (val: BedModel, record: ReservationModel) => (<div>{val.room?.flat?.hotel?.name}</div>)
        },
        {
            title: 'Секция',
            dataIndex: 'bed',
            key: 'flat',
            render: (val: BedModel, record: ReservationModel) => (<div>{val.room?.flat?.name}</div>)
        },
        {
            title: '',
            dataIndex: '',
            key: 'delete',
            render: (val: any, record: ReservationModel) => (
                <Popconfirm title={"Удалить бронь?"} onConfirm={() => deleteReservation(record.id)}>
                    <Button style={{margin: 3}} danger={true}>Удалить</Button>
                </Popconfirm>
            )
        },
    ]
    // -----

    // Handlers

    // -----

    if (isReservationsLoading)
        return <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100vw'}}>
            <Spin size={'large'}/>
        </div>
    return (
        <Flex vertical={true}>
            {messageContextHolder}
            {visibleSingleReservationModal && <ReservationModal selectedReservation={selectedReservation} visible={visibleSingleReservationModal} setVisible={setVisibleSingleReservationModal} refresh={getAll}/>}
            {visibleGroupReservationModal && <GroupReservationModal visible={visibleGroupReservationModal} setVisible={setVisibleGroupReservationModal} refresh={getAll} showWarningMsg={showWarningMsg}/>}
            <Flex>
                <Button icon={<UserAddOutlined />} type={'primary'} onClick={() => setVisibleSingleReservationModal(true)} style={{width: 180, margin: 10}}>Добавить бронь</Button>
                <Button icon={<UsergroupAddOutlined />} type={'primary'} onClick={() => setVisibleGroupReservationModal(true)} style={{width: 210, margin: 10}}>Групповое бронирование</Button>
            </Flex>
            <Table
                style={{width: '100vw'}}
                columns={columns}
                dataSource={reservations}
                pagination={{
                    defaultPageSize: 100,
                }}
                onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: (e) => {
                            setVisibleSingleReservationModal(true);
                            setSelectedReservation(record);
                        },
                    };
                }}
            />
        </Flex>
    );
};

export default ReservationScreen;