import React, {useEffect, useState} from 'react';
import {Button, Flex, Spin, Table, TableProps} from 'antd';
import {ExtraModel} from "../../model/ExtraModel";
import {extraAPI} from "../../service/ExtraService";
import {ExtraModal} from "../../component/dict/ExtraModal";

const ExtraScreen: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [selectedExtra, setSelectedExtra] = useState<ExtraModel | null>(null);
    const [getAll, {
        data: extras,
        isLoading: isExtrasLoading
    }] = extraAPI.useGetAllMutation();

    useEffect(() => {
        getAll();
    }, []);
    useEffect(() => {
        if (!visible) setSelectedExtra(null);
    }, [visible]);

    const columns: TableProps<ExtraModel>['columns'] = [
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
    ]

    if (isExtrasLoading)
        return <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100vw'}}>
            <Spin size={'large'}/>
        </div>
    return (
        <Flex vertical={true}>
            {visible && <ExtraModal selectedExtra={selectedExtra} visible={visible} setVisible={setVisible} refresh={getAll}/>}
            <Button type={'primary'} onClick={() => setVisible(true)} style={{width: 100, margin: 10}}>Добавить</Button>
            <Table
                style={{width: '100vw'}}
                columns={columns}
                dataSource={extras}
                pagination={{
                    defaultPageSize: 100,
                }}
                onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: (e) => {
                            setVisible(true);
                            setSelectedExtra(record);
                        },
                    };
                }}
            />
        </Flex>
    );
};

export default ExtraScreen;