import React, {useEffect, useRef, useState} from 'react';
import {Button, ConfigProvider, Flex, Input, InputRef, Space, Spin, Table, TableProps} from 'antd';
import {FilterConfirmProps} from "antd/es/table/interface";
import {ColumnType} from "antd/es/table";
import {SearchOutlined} from "@ant-design/icons";
import {EventModel} from "../model/EventModel";
import {eventAPI} from "../service/EventService";
import dayjs from "dayjs";
import {EventModal} from "../component/event/EventModal";
import {TableTitleRender} from "../component/TableTitleRender";

export interface DataType extends EventModel {
    key: React.Key;
    children?: any;
}

type DataIndex = keyof DataType;

const EventScreen: React.FC = () => {

    // States
    const searchInput = useRef<InputRef>(null);
    const [eventModalVisible, setEventModalVisible] = useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useState<EventModel | null>(null);
    // -----

    // Web requests
    const [getAll, {
        data: events,
        isLoading: isEventsLoading
    }] = eventAPI.useGetAllMutation();
    // -----

    // Handlers
    const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
        confirm();
    };
    const handleReset = (clearFilters: () => void) => {
        clearFilters();
    };
    // -----

    // Useful utils
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
    const columns: TableProps<EventModel>['columns'] = [
        {
            title: <TableTitleRender title={'ИД'} />,
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend',
            width: 70,
        },
        {
            title: <TableTitleRender title={'Наименование'} />,
            dataIndex: 'name',
            key: 'name',
            filters: events?.reduce((acc: { text: string, value: string }[], event: EventModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === event.name) === undefined)
                    return acc.concat({text: event.name, value: event.name});
                else return acc;
            }, []),
            onFilter: (value: any, event: EventModel) => {
                return event.name.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: <TableTitleRender title={'Описание'} />,
            dataIndex: 'description',
            key: 'description',
            filters: events?.reduce((acc: { text: string, value: string }[], event: EventModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === event.description) === undefined)
                    return acc.concat({text: event.description, value: event.description});
                else return acc;
            }, []),
            onFilter: (value: any, event: EventModel) => {
                return event.description.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: <TableTitleRender title={'Тип'} />,
            dataIndex: 'type',
            key: 'type',
            render: (_, record) => (<div>{record.type.name}</div>),
            filters: events?.reduce((acc: { text: string, value: string }[], event: EventModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === event.type.name) === undefined)
                    return acc.concat({text: event.type.name, value: event.type.name});
                else return acc;
            }, []),
            onFilter: (value: any, event: EventModel) => {
                return event.type.name.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: <TableTitleRender title={'Филиал'} />,
            dataIndex: 'hotel',
            key: 'filial',
            render: (_, record) => (<div>{record.hotel.filialName}</div>),
            filters: events?.reduce((acc: { text: string, value: string }[], event: EventModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === event.hotel.filialName) === undefined)
                    return acc.concat({text: event.hotel.filialName, value: event.hotel.filialName});
                else return acc;
            }, []),
            onFilter: (value: any, event: EventModel) => {
                return event.hotel.filialName.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: <TableTitleRender title={'Общежитие'} />,
            dataIndex: 'hotel',
            key: 'hotel',
            render: (_, record) => (<div>{record.hotel.name}</div>),
            filters: events?.reduce((acc: { text: string, value: string }[], event: EventModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === event.hotel.name) === undefined)
                    return acc.concat({text: event.hotel.name, value: event.hotel.name});
                else return acc;
            }, []),
            onFilter: (value: any, event: EventModel) => {
                return event.hotel.name.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: <TableTitleRender title={'Дата начала'} />,
            dataIndex: 'dateStart',
            key: 'dateStart',
            render: (_, record) => (<div>{dayjs(record.dateStart).format("DD-MM-YYYY")}</div>),
            sorter: (a, b) => dayjs(a.dateStart, 'DD-MM-YYYY').diff(dayjs(b.dateStart, 'DD-MM-YYYY')),
            width: 140,
        },
        {
            title: <TableTitleRender title={'Дата окончания'} />,
            dataIndex: 'dateFinish',
            key: 'dateFinish',
            render: (_, record) => (<div>{dayjs(record.dateFinish).format("DD-MM-YYYY")}</div>),
            sorter: (a, b) => dayjs(a.dateFinish, 'DD-MM-YYYY').diff(dayjs(b.dateFinish, 'DD-MM-YYYY')),
            width: 140,
        },
        {
            title: <TableTitleRender title={'Кол-во мужчин'} />,
            dataIndex: 'manCount',
            key: 'manCount',
            width: 120,
            sorter: (a, b) => a.manCount - b.manCount,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: <TableTitleRender title={'Кол-во женщин'} />,
            dataIndex: 'womenCount',
            key: 'womenCount',
            width: 120,
            sorter: (a, b) => a.womenCount - b.womenCount,
            sortDirections: ['descend', 'ascend'],
        },
    ]
    // -----

    // Effects
    useEffect(() => {
        getAll();
    }, []);
    useEffect(() => {
        if (!eventModalVisible) setSelectedEvent(null);
    }, [eventModalVisible]);
    // -----

    if (isEventsLoading)
        return <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100vw'}}>
            <Spin size={'large'}/>
        </div>
    return (
        <Flex style={{marginTop: 5}} vertical={true}>
            {eventModalVisible && <EventModal selectedEvent={selectedEvent} visible={eventModalVisible} setVisible={setEventModalVisible} refresh={getAll}/>}
            <Button type={'primary'} onClick={() => setEventModalVisible(true)} style={{width: 100, margin: 10}}>Добавить</Button>
            <ConfigProvider
                theme={{
                    components: {
                        Table: {
                            cellPaddingInline: 5,
                            cellPaddingBlock: 5
                        }
                    }
                }}
            >
                <Table
                    bordered
                    style={{width: '100vw'}}
                    columns={columns}
                    dataSource={events}
                    onRow={(record, rowIndex) => {
                        return {
                            onDoubleClick: (e) => {
                                setEventModalVisible(true);
                                setSelectedEvent(record);
                            },
                        };
                    }}
                />
            </ConfigProvider>
        </Flex>
    );
};

export default EventScreen;