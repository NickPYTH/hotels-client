import React, {useEffect, useState} from 'react';
import {Button, ConfigProvider, Flex, Table, TableProps} from 'antd';
import {EventKindModel} from "entities/EventKindModel";
import {eventKindAPI} from "service/EventKindService";
import {TableTitleRender} from "shared/component/TableTitleRender";

import {EventKindModal} from "./EventKindModal";

export interface DataType extends EventKindModel {
    key: React.Key;
    children?: any;
}

const EventKindPage: React.FC = () => {

    // States
    const [isVisibleEventModal, setIsVisibleEventModal] = useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useState<EventKindModel | null>(null);
    // -----

    // Web requests
    const [getAll, {
        data: events,
        isLoading: isEventsLoading
    }] = eventKindAPI.useGetAllMutation();
    // -----

    // Useful utils
    const columns: TableProps<EventKindModel>['columns'] = [
        {
            title: <TableTitleRender title={'ИД'}/>,
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => (a.id && b.id) ? a.id - b.id : 0,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend',
            width: 70,
        },
        {
            title: <TableTitleRender title={'Наименование'}/>,
            dataIndex: 'name',
            key: 'name',
            filters: events?.reduce((acc: { text: string, value: string }[], event: EventKindModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === event.name) === undefined)
                    return acc.concat({text: event.name, value: event.name});
                else return acc;
            }, []),
            onFilter: (value: any, event: EventKindModel) => {
                return event.name.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: <TableTitleRender title={'Описание'}/>,
            dataIndex: 'description',
            key: 'description',
            filters: events?.reduce((acc: { text: string, value: string }[], event: EventKindModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === event.description) === undefined)
                    return acc.concat({text: event.description, value: event.description});
                else return acc;
            }, []),
            onFilter: (value: any, event: EventKindModel) => {
                return event.description.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: <TableTitleRender title={'Тип'}/>,
            dataIndex: 'type',
            key: 'type',
            render: (_, record) => (<div>{record.type.name}</div>),
            filters: events?.reduce((acc: { text: string, value: string }[], event: EventKindModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === event.type.name) === undefined)
                    return acc.concat({text: event.type.name, value: event.type.name});
                else return acc;
            }, []),
            onFilter: (value: any, event: EventKindModel) => {
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
        if (!isVisibleEventModal) setSelectedEvent(null);
    }, [isVisibleEventModal]);
    // -----

    return (
        <Flex style={{marginTop: 5}} vertical={true}>
            {isVisibleEventModal && <EventKindModal selectedEvent={selectedEvent} visible={isVisibleEventModal} setVisible={setIsVisibleEventModal} refresh={getAll}/>}
            <Button type={'primary'} onClick={() => setIsVisibleEventModal(true)} style={{width: 100, margin: 10}}>Добавить</Button>
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
                    loading={isEventsLoading}
                    onRow={(record, rowIndex) => {
                        return {
                            onDoubleClick: (e) => {
                                setIsVisibleEventModal(true);
                                setSelectedEvent(record);
                            },
                        };
                    }}
                />
            </ConfigProvider>
        </Flex>
    );
};

export default EventKindPage;