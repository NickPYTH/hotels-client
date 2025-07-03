import React, {useEffect, useState} from 'react';
import {Button, ConfigProvider, Flex, Table, TableProps} from 'antd';
import {EventKindModel} from "entities/EventKindModel";
import {TableTitleRender} from "shared/component/TableTitleRender";

import {EventModal} from "./EventModal";
import {eventAPI} from "service/EventService";
import {EventModel} from "entities/EventModel";
import dayjs from "dayjs";

export interface DataType extends EventKindModel {
    key: React.Key;
    children?: any;
}

const EventPage: React.FC = () => {

    // States
    const [isVisibleEventModal, setIsVisibleEventModal] = useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useState<EventModel | null>(null);
    // -----

    // Web requests
    const [getAll, {
        data: events,
        isLoading: isEventsLoading
    }] = eventAPI.useGetAllMutation();
    // -----

    // Useful utils
    const columns: TableProps<EventModel>['columns'] = [
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
            title: <TableTitleRender title={'Вид мероприятия'}/>,
            dataIndex: 'kind',
            key: 'kind',
            render: (_, record) => (<div>{record.kind.name}</div>),
        },
        {
            title: <TableTitleRender title={'Филиал'}/>,
            dataIndex: 'hotel',
            key: 'hotel',
            render: (_, record) => (<div>{record.hotel.filial.name}</div>),
        },
        {
            title: <TableTitleRender title={'Общежитие'}/>,
            dataIndex: 'hotel',
            key: 'hotel',
            render: (_, record) => (<div>{record.hotel.name}</div>),
        },
        {
            title: <TableTitleRender title={'Дата начала'}/>,
            dataIndex: 'dateStart',
            key: 'dateStart',
            render: (_, record) => (<div>{dayjs(record.dateStart).format("DD-MM-YYYY")}</div>),
        },
        {
            title: <TableTitleRender title={'Дата окончания'}/>,
            dataIndex: 'dateFinish',
            key: 'dateFinish',
            render: (_, record) => (<div>{dayjs(record.dateFinish).format("DD-MM-YYYY")}</div>),
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
            {isVisibleEventModal && <EventModal selectedEvent={selectedEvent} visible={isVisibleEventModal} setVisible={setIsVisibleEventModal} refresh={getAll}/>}
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

export default EventPage;