import React, {useEffect, useState} from 'react';
import {Button, Flex, Table, TableProps} from 'antd';
import {ExtraModel} from "../../model/ExtraModel";
import {extraAPI} from "../../service/ExtraService";
import {ExtraModal} from "../../component/dict/ExtraModal";

const ExtraScreen: React.FC = () => {

    // States
    const [isVisibleExtraModal, setIsVisibleExtraModal] = useState(false);
    const [selectedExtra, setSelectedExtra] = useState<ExtraModel | null>(null);
    // -----

    // Web requests
    const [getAll, {
        data: extras,
        isLoading: isExtrasLoading
    }] = extraAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        getAll();
    }, []);
    useEffect(() => {
        if (!isVisibleExtraModal) setSelectedExtra(null);
    }, [isVisibleExtraModal]);
    // -----

    // Useful utils
    const columns: TableProps<ExtraModel>['columns'] = [
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
            filters: extras?.reduce((acc: { text: string, value: string }[], org: ExtraModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === org.name) === undefined)
                    return acc.concat({text: org.name, value: org.name});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: ExtraModel) => {
                return record.name.indexOf(value) === 0
            },
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            filters: extras?.reduce((acc: { text: string, value: string }[], org: ExtraModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === org.description) === undefined)
                    return acc.concat({text: org.description, value: org.description});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: ExtraModel) => {
                return record.description.indexOf(value) === 0
            },
        },
        {
            title: 'Стоимость',
            dataIndex: 'cost',
            key: 'cost',
            sorter: (a, b) => a.cost - b.cost,
            sortDirections: ['descend', 'ascend'],
        },
    ];
    // -----

    return (
        <Flex vertical={true}>
            {isVisibleExtraModal && <ExtraModal selectedExtra={selectedExtra} visible={isVisibleExtraModal} setVisible={setIsVisibleExtraModal} refresh={getAll}/>}
            <Button type={'primary'} onClick={() => setIsVisibleExtraModal(true)} style={{width: 100, margin: 10}}>Добавить</Button>
            <Table
                style={{width: '100vw'}}
                columns={columns}
                dataSource={extras}
                loading={isExtrasLoading}
                pagination={{
                    defaultPageSize: 100,
                }}
                onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: (e) => {
                            setIsVisibleExtraModal(true);
                            setSelectedExtra(record);
                        },
                    };
                }}
            />
        </Flex>
    );
};

export default ExtraScreen;