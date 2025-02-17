import React, {useEffect, useRef, useState} from 'react';
import {Button, ConfigProvider, Flex, Input, InputRef, Space, Spin, Table, TableProps} from 'antd';
import {FilterConfirmProps} from "antd/es/table/interface";
import {ColumnType} from "antd/es/table";
import {SearchOutlined} from "@ant-design/icons";
import {EventModel} from "../model/EventModel";
import {eventAPI} from "../service/EventService";
import dayjs from "dayjs";
import {EventModal} from "../component/event/EventModal";

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
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend',
            ...getColumnSearchProps('id'),
            width: 70,
        },
        {
            title: 'Наименование',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            ...getColumnSearchProps('description'),
        },
        {
            title: 'Тип',
            dataIndex: 'type',
            key: 'type',
            render: (_, record) => (<div>{record.type.name}</div>)
        },
        {
            title: 'Филиал',
            dataIndex: 'hotel',
            key: 'filial',
            render: (_, record) => (<div>{record.hotel.filialName}</div>)
        },
        {
            title: 'Общежитие',
            dataIndex: 'hotel',
            key: 'hotel',
            render: (_, record) => (<div>{record.hotel.name}</div>)
        },
        {
            title: 'Дата начала',
            dataIndex: 'dateStart',
            key: 'dateStart',
            ...getColumnSearchProps('dateStart'),
            render: (_, record) => (<div>{dayjs(record.dateStart).format("DD-MM-YYYY")}</div>),
            width: 140,
        },
        {
            title: 'Дата окончания',
            dataIndex: 'dateFinish',
            key: 'dateFinish',
            ...getColumnSearchProps('dateFinish'),
            render: (_, record) => (<div>{dayjs(record.dateFinish).format("DD-MM-YYYY")}</div>),
            width: 140,
        },
        {
            title: 'Кол-во мужчин',
            dataIndex: 'manCount',
            key: 'manCount',
            width: 120,
        },
        {
            title: 'Кол-во женщин',
            dataIndex: 'womenCount',
            key: 'womenCount',
            width: 120,
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