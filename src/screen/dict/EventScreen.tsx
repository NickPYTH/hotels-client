import React, {useEffect, useRef, useState} from 'react';
import {Button, ConfigProvider, Flex, Input, InputRef, Space, Spin, Table, TableProps} from 'antd';
import {FilterConfirmProps} from "antd/es/table/interface";
import {ColumnType} from "antd/es/table";
import {SearchOutlined} from "@ant-design/icons";
import {EventModel} from "../../model/EventModel";
import {eventAPI} from "../../service/EventService";
import {EventModal} from "../../component/event/EventModal";
import {TableTitleRender} from "../../component/TableTitleRender";

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