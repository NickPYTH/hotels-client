import React, {useEffect, useRef, useState} from 'react';
import {SearchOutlined, UserAddOutlined, UsergroupAddOutlined} from "@ant-design/icons";
import {Button, Flex, Input, InputRef, message, Popconfirm, Space, Table, TableProps} from 'antd';
import {ReservationModel} from "entities/ReservationModel";
import {reservationAPI} from "service/ReservationService";
import dayjs from "dayjs";
import {BedModel} from "entities/BedModel";
import {EventKindModel} from "entities/EventKindModel";
import {FilialModel} from "entities/FilialModel";
import {ReservationModal} from "shared/component/ReservationModal";
import {TableTitleRender} from "shared/component/TableTitleRender";
import {GroupReservationModal} from "shared/component/GroupReservationModal";
import {CustomDateFilter} from "shared/component/CustomDateFilter";
import {GuestModel} from "entities/GuestModel";
import {FilterConfirmProps} from "antd/es/table/interface";
import {ColumnType} from "antd/es/table";

export interface DataType extends ReservationModel {
    key: React.Key;
    children?: any;
}

type DataIndex = keyof DataType;

const ReservationPage: React.FC = () => {

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
    const searchInput = useRef<InputRef>(null);
    const getColumnSearchProps = (dataIndex: any): ColumnType<any> => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
            <div style={{padding: 8}} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Поиск`}
                    value={selectedKeys[0]}
                    onChange={(e: any) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Поиск
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{width: 90}}
                    >
                        Сбросить
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Закрыть
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{color: filtered ? '#1677ff' : undefined}}/>
        ),
        onFilter: (value, record) => {
            if (record[dataIndex])
                try {
                    return record[dataIndex]
                        .toString()
                        .toLowerCase()
                        .includes((value as string).toLowerCase())
                } catch (e) {
                    return !!record.children.find((child: any) => child[dataIndex]
                        .toString()
                        .toLowerCase()
                        .includes((value as string).toLowerCase()));
                }
        },
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) => (<div>{text}</div>)
    });
    const columns: TableProps<ReservationModel>['columns'] = [
        {
            title: <TableTitleRender title={"ИД"}/>,
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id && b.id ? a.id - b.id : 0,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend'
        },
        {
            title: <TableTitleRender title={"Тип мероприятия"}/>,
            dataIndex: 'event',
            key: 'eventType',
            render: (val: EventKindModel, record: ReservationModel) => (<div>{val.type.name}</div>),
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
            title: <TableTitleRender title={'Мероприятие'}/>,
            dataIndex: 'event',
            key: 'event',
            render: (val: EventKindModel, record: ReservationModel) => (<div>{val.name}</div>),
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
            title: <TableTitleRender title={'Филиал заказчик'}/>,
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
            title: <TableTitleRender title={'Табельный номер'}/>,
            dataIndex: 'tabnum',
            key: 'tabnum',
            sorter: (a, b) => (a.tabnum && b.tabnum) ? a.tabnum - b.tabnum : 0,
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('tabnum'),
        },
        {
            title: <TableTitleRender title={'ФИО'}/>,
            render: (value: any, reservation)=> (<div>{reservation.lastname} {reservation.firstname} {reservation.secondName}</div>),
            dataIndex: 'fio',
            key: 'fio',
            sorter: (a, b) => {
                if (!a.lastname || !b.lastname) return 0;
                else return a.lastname.charCodeAt(0) - b.lastname.charCodeAt(0);
            },
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('fio'),
        },
        {
            title: <TableTitleRender title={'Дата заезда'}/>,
            dataIndex: 'dateStart',
            key: 'dateStart',
            sorter: (a, b) => dayjs(a.dateStart, 'DD-MM-YYYY').diff(dayjs(b.dateStart, 'DD-MM-YYYY')),
            sortDirections: ['descend', 'ascend'],
            filterDropdown: CustomDateFilter,
            onFilter: (value: any, record: ReservationModel) => {
                if (value.date == null) return true;
                if (!value.date) return false;
                if (!record.dateStart) return false;
                const recordDate = dayjs(record.dateStart, 'DD-MM-YYYY');
                const filterDate = value.date;
                switch (value.operator) {
                    case '=':
                        return recordDate.isSame(filterDate, 'day');
                    case '>':
                        return recordDate.isAfter(filterDate, 'day');
                    case '<':
                        return recordDate.isBefore(filterDate, 'day');
                    case '>=':
                        return recordDate.isSame(filterDate, 'day') || recordDate.isAfter(filterDate, 'day');
                    case '<=':
                        return recordDate.isSame(filterDate, 'day') || recordDate.isBefore(filterDate, 'day');
                    default:
                        return false;
                }
            },
        },
        {
            title: <TableTitleRender title={'Дата выезда'}/>,
            dataIndex: 'dateFinish',
            key: 'dateFinish',
            sorter: (a, b) => dayjs(a.dateFinish, 'DD-MM-YYYY').diff(dayjs(b.dateFinish, 'DD-MM-YYYY')),
            sortDirections: ['descend', 'ascend'],
            filterDropdown: CustomDateFilter,
            onFilter: (value: any, record: ReservationModel) => {
                if (value.date == null) return true;
                if (!value.date) return false;
                if (!record.dateFinish) return false;
                const recordDate = dayjs(record.dateFinish, 'DD-MM-YYYY');
                const filterDate = value.date;
                switch (value.operator) {
                    case '=':
                        return recordDate.isSame(filterDate, 'day');
                    case '>':
                        return recordDate.isAfter(filterDate, 'day');
                    case '<':
                        return recordDate.isBefore(filterDate, 'day');
                    case '>=':
                        return recordDate.isSame(filterDate, 'day') || recordDate.isAfter(filterDate, 'day');
                    case '<=':
                        return recordDate.isSame(filterDate, 'day') || recordDate.isBefore(filterDate, 'day');
                    default:
                        return false;
                }
            },
        },
        {
            title: <TableTitleRender title={'Филиал'}/>,
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
            title: <TableTitleRender title={'Общежитие'}/>,
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
            title: <TableTitleRender title={'Секция'}/>,
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
                <Popconfirm title={"Удалить бронь?"} onConfirm={() => record.id ? deleteReservation(record.id) : console.error("Reservation id error")}>
                    <Button style={{margin: 3}} danger={true}>Удалить</Button>
                </Popconfirm>
            )
        },
    ];
    // -----

    // Handlers
    const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
        confirm();
    };
    const handleReset = (clearFilters: () => void) => {
        clearFilters();
    };
    // -----

    return (
        <Flex vertical={true}>
            {messageContextHolder}
            {isVisibleReservationModal && <ReservationModal selectedReservation={selectedReservation} visible={isVisibleReservationModal} setVisible={setIsVisibleReservationModal} refresh={getAll}/>}
            {visibleGroupReservationModal &&
                <GroupReservationModal visible={visibleGroupReservationModal} setVisible={setVisibleGroupReservationModal} refresh={getAll} showWarningMsg={showWarningMsg}/>}
            <Flex vertical={true}>
                <h3 style={{marginLeft: 15}}>Записи о бронировании</h3>
                <Flex>
                    <Button icon={<UserAddOutlined/>} type={'primary'} onClick={() => setIsVisibleReservationModal(true)} style={{width: 180, margin: 10}}>Добавить бронь</Button>
                    <Button icon={<UsergroupAddOutlined/>} type={'primary'} onClick={() => setVisibleGroupReservationModal(true)} style={{width: 210, margin: 10}}>Групповое бронирование</Button>
                </Flex>
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

export default ReservationPage;