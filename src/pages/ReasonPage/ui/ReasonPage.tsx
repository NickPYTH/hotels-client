import React, {useEffect, useState} from 'react';
import {Button, Flex, Table, TableProps} from 'antd';
import {ReasonModel} from "entities/ReasonModel";
import {reasonAPI} from "service/ReasonService";

import {ReasonModal} from "./ReasonModal";

const ReasonPage: React.FC = () => {

    // States
    const [isVisibleReasonModal, setIsVisibleReasonModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState<ReasonModel | null>(null);
    // -----

    // Web requests
    const [getAll, {
        data: reasons,
        isLoading: isReasonsLoading
    }] = reasonAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        getAll();
    }, []);
    useEffect(() => {
        if (!isVisibleReasonModal) setSelectedReason(null);
    }, [isVisibleReasonModal]);
    // -----

    // Useful utils
    const columns: TableProps<ReasonModel>['columns'] = [
        {
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => (a.id && b.id) ? a.id - b.id : 0,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend'
        },
        {
            title: 'Наименование',
            dataIndex: 'name',
            key: 'name',
            filters: reasons?.reduce((acc: { text: string, value: string }[], org: ReasonModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === org.name) === undefined)
                    return acc.concat({text: org.name, value: org.name});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: ReasonModel) => {
                return record.name.indexOf(value) === 0
            },
        },
        {
            title: 'По умолчанию',
            dataIndex: 'isDefault',
            key: 'isDefault',
            render: (e) => e ? <div>Да</div> : <div>Нет</div>,
        },
    ];
    // -----

    return (
        <Flex vertical={true}>
            {isVisibleReasonModal && <ReasonModal selectedReason={selectedReason} visible={isVisibleReasonModal} setVisible={setIsVisibleReasonModal} refresh={getAll}/>}
            <Button type={'primary'} onClick={() => setIsVisibleReasonModal(true)} style={{width: 100, margin: 10}}>Добавить</Button>
            <Table
                style={{width: '100vw'}}
                columns={columns}
                dataSource={reasons}
                loading={isReasonsLoading}
                pagination={{
                    defaultPageSize: 100,
                }}
                onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: (e) => {
                            setIsVisibleReasonModal(true);
                            setSelectedReason(record);
                        },
                    };
                }}
            />
        </Flex>
    );
};

export default ReasonPage;