import React, {useEffect, useState} from 'react';
import {Button, Flex, Table, TableProps} from 'antd';
import {EventTypeModel} from "../../model/EventTypeModel";
import {eventTypeAPI} from "../../service/EventTypeService";
import {EventTypeModal} from "../../component/dict/EventTypeModal";

const EventTypesScreen: React.FC = () => {

    // States
    const [isVisibleEventTypeModal, setIsVisibleEventTypeModal] = useState(false);
    const [selectedEventType, setSelectedEventType] = useState<EventTypeModel | null>(null);
    // -----

    // Web requests
    const [getAll, {
        data: eventTypes,
        isLoading: isEventTypesLoading
    }] = eventTypeAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        getAll();
    }, []);
    useEffect(() => {
        if (!isVisibleEventTypeModal) setSelectedEventType(null);
    }, [isVisibleEventTypeModal]);
    // -----

    // Useful utils
    const columns: TableProps<EventTypeModel>['columns'] = [
        {
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend'
        },
        {
            title: 'Наименование',
            dataIndex: 'name',
            key: 'name',
            filters: eventTypes?.reduce((acc: { text: string, value: string }[], org: EventTypeModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === org.name) === undefined)
                    return acc.concat({text: org.name, value: org.name});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: EventTypeModel) => {
                return record.name.indexOf(value) === 0
            },
        },
    ]
    // -----

    return (
        <Flex vertical={true}>
            {isVisibleEventTypeModal && <EventTypeModal selectedEventType={selectedEventType} visible={isVisibleEventTypeModal} setVisible={setIsVisibleEventTypeModal} refresh={getAll}/>}
            <Button type={'primary'} onClick={() => setIsVisibleEventTypeModal(true)} style={{width: 100, margin: 10}}>Добавить</Button>
            <Table
                style={{width: '100vw'}}
                columns={columns}
                dataSource={eventTypes}
                loading={isEventTypesLoading}
                pagination={{
                    defaultPageSize: 100,
                }}
                onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: (e) => {
                            setIsVisibleEventTypeModal(true);
                            setSelectedEventType(record);
                        },
                    };
                }}
            />
        </Flex>
    );
};

export default EventTypesScreen;