import React, {useEffect, useState} from 'react';
import {Button, Flex, message, Popconfirm, Table, TableProps} from 'antd';
import {ReservationModel} from "../../model/ReservationModel";
import {reservationAPI} from "../../service/ReservationService";
import dayjs from "dayjs";
import {BedModel} from "../../model/BedModel";
import {EventModel} from "../../model/EventModel";
import {FilialModel} from "../../model/FilialModel";
import {ReservationModal} from "../../component/dict/ReservationModal";
import {UserAddOutlined, UsergroupAddOutlined} from "@ant-design/icons";
import {GroupReservationModal} from "../../component/hotel/GroupReservationModal";
import {TableTitleRender} from "../../component/TableTitleRender";

const ReservationScreen: React.FC = () => {

    // States
    const [isVisibleReservationModal, setIsVisibleReservationModal] = useState(false);
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
    const [messageApi, messageContextHolder] = message.useMessage();
    const showWarningMsg = (msg: string) => {
        messageApi.warning(msg);
    };
    // -----

    // Effects
    useEffect(() => {
        getAll();
    }, []);
    useEffect(() => {
        if (!isVisibleReservationModal) setSelectedReservation(null);
    }, [isVisibleReservationModal]);
    useEffect(() => {
        if (deletedReservation) getAll();
    }, [deletedReservation]);
    // -----

    // Useful utils
    const columns: TableProps<ReservationModel>['columns'] = [
        {
            title: <TableTitleRender title={"ИД"} />,
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend'
        },
        {
            title: <TableTitleRender title={"Тип мероприятия"} /> ,
            dataIndex: 'event',
            key: 'eventType',
            render: (val: EventModel, record: ReservationModel) => (<div>{val.type.name}</div>),
            filters: reservations?.reduce((acc: { text: string, value: string }[], reservation: ReservationModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === reservation.event.type.name) === undefined)
                    return acc.concat({text: reservation.event.type.name, value: reservation.event.type.name});
                else return acc;
            }, []),
            onFilter: (value: any, record: ReservationModel) => {
                return record.event.type.name.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: <TableTitleRender title={'Мероприятие'} />,
            dataIndex: 'event',
            key: 'event',
            render: (val: EventModel, record: ReservationModel) => (<div>{val.name}</div>),
            filters: reservations?.reduce((acc: { text: string, value: string }[], reservation: ReservationModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === reservation.event.name) === undefined)
                    return acc.concat({text: reservation.event.name, value: reservation.event.name});
                else return acc;
            }, []),
            onFilter: (value: any, record: ReservationModel) => {
                return record.event.name.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: <TableTitleRender title={'Филиал заказчик'} />,
            dataIndex: 'fromFilial',
            key: 'fromFilial',
            render: (val: FilialModel, record: ReservationModel) => (<div>{val.name}</div>),
            filters: reservations?.reduce((acc: { text: string, value: string }[], reservation: ReservationModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === reservation.fromFilial.name) === undefined)
                    return acc.concat({text: reservation.fromFilial.name, value: reservation.fromFilial.name});
                else return acc;
            }, []),
            onFilter: (value: any, record: ReservationModel) => {
                return record.fromFilial.name.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: <TableTitleRender title={'Табельный номер'} />,
            dataIndex: 'tabnum',
            key: 'tabnum',
            sorter: (a, b) => a.tabnum - b.tabnum,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: <TableTitleRender title={'Дата заезда'} />,
            dataIndex: 'dateStart',
            key: 'dateStart',
            sorter: (a, b) => dayjs(a.dateStart, 'DD-MM-YYYY').diff(dayjs(b.dateStart, 'DD-MM-YYYY')),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: <TableTitleRender title={'Дата выезда'} />,
            dataIndex: 'dateFinish',
            key: 'dateFinish',
            sorter: (a, b) => dayjs(a.dateFinish, 'DD-MM-YYYY').diff(dayjs(b.dateFinish, 'DD-MM-YYYY')),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: <TableTitleRender title={'Филиал'} />,
            dataIndex: 'bed',
            key: 'filial',
            render: (val: BedModel, record: ReservationModel) => (<div>{val.room?.flat?.hotel?.filial?.name}</div>),
            filters: reservations?.reduce((acc: { text: string, value: string }[], reservation: ReservationModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === reservation.bed?.room.flat.hotel.filial.name) === undefined)
                    return acc.concat({text: reservation.bed?.room.flat.hotel.filial.name, value: reservation.bed?.room.flat.hotel.filial.name});
                else return acc;
            }, []),
            onFilter: (value: any, record: ReservationModel) => {
                return record.bed?.room.flat.hotel.filial.name.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: <TableTitleRender title={'Общежитие'} />,
            dataIndex: 'bed',
            key: 'hotel',
            render: (val: BedModel, record: ReservationModel) => (<div>{val.room?.flat?.hotel?.name}</div>),
            filters: reservations?.reduce((acc: { text: string, value: string }[], reservation: ReservationModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === reservation.bed?.room.flat.hotel.name) === undefined)
                    return acc.concat({text: reservation.bed?.room.flat.hotel.name, value: reservation.bed?.room.flat.hotel.name});
                else return acc;
            }, []),
            onFilter: (value: any, record: ReservationModel) => {
                return record.bed?.room.flat.hotel.name.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: <TableTitleRender title={'Секция'} />,
            dataIndex: 'bed',
            key: 'flat',
            render: (val: BedModel, record: ReservationModel) => (<div>{val.room?.flat?.name}</div>),
            filters: reservations?.reduce((acc: { text: string, value: string }[], reservation: ReservationModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === reservation.bed?.room.flat.name) === undefined)
                    return acc.concat({text: reservation.bed?.room.flat.name, value: reservation.bed?.room.flat.name});
                else return acc;
            }, []),
            onFilter: (value: any, record: ReservationModel) => {
                return record.bed?.room.flat.name.indexOf(value) === 0
            },
            filterSearch: true,
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

    return (
        <Flex vertical={true}>
            {messageContextHolder}
            {isVisibleReservationModal && <ReservationModal selectedReservation={selectedReservation} visible={isVisibleReservationModal} setVisible={setIsVisibleReservationModal} refresh={getAll}/>}
            {visibleGroupReservationModal && <GroupReservationModal visible={visibleGroupReservationModal} setVisible={setVisibleGroupReservationModal} refresh={getAll} showWarningMsg={showWarningMsg}/>}
            <Flex>
                <Button icon={<UserAddOutlined />} type={'primary'} onClick={() => setIsVisibleReservationModal(true)} style={{width: 180, margin: 10}}>Добавить бронь</Button>
                <Button icon={<UsergroupAddOutlined />} type={'primary'} onClick={() => setVisibleGroupReservationModal(true)} style={{width: 210, margin: 10}}>Групповое бронирование</Button>
            </Flex>
            <Table
                style={{width: '100vw'}}
                columns={columns}
                dataSource={reservations}
                loading={isReservationsLoading}
                pagination={{
                    defaultPageSize: 100,
                }}
                onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: (e) => {
                            setIsVisibleReservationModal(true);
                            setSelectedReservation(record);
                        },
                    };
                }}
            />
        </Flex>
    );
};

export default ReservationScreen;