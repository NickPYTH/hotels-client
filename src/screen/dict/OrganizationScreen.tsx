import React, {useEffect, useState} from 'react';
import {Button, Flex, Spin, Table, TableProps} from 'antd';
import {organizationAPI} from "../../service/OrganizationService";
import {OrganizationModel} from "../../model/OrganizationModel";
import {OrganizationModal} from "../../component/dict/OrganizationModal";
import {ContractModel} from "../../model/ContractModel";

const OrganizationScreen: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [selectedOrganization, setSelectedOrganization] = useState<OrganizationModel | null>(null);
    const [getAll, {
        data: organizations,
        isLoading: isOrganizationsLoading
    }] = organizationAPI.useGetAllMutation();

    useEffect(() => {
        getAll();
    }, []);
    useEffect(() => {
        if (!visible) setSelectedOrganization(null);
    }, [visible]);

    const columns: TableProps<OrganizationModel>['columns'] = [
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
            filters: organizations?.reduce((acc: { text: string, value: string }[], org: OrganizationModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === org.name) === undefined)
                    return acc.concat({text: org.name, value: org.name});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: OrganizationModel) => {
                return record.name.indexOf(value) === 0
            },
        },
    ]

    if (isOrganizationsLoading)
        return <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100vw'}}>
            <Spin size={'large'}/>
        </div>
    return (
        <Flex vertical={true}>
            {visible && <OrganizationModal selectedOrganization={selectedOrganization} visible={visible} setVisible={setVisible} refresh={getAll}/>}
            <Button type={'primary'} onClick={() => setVisible(true)} style={{width: 100, margin: 10}}>Добавить</Button>
            <Table
                style={{width: '100vw'}}
                columns={columns}
                dataSource={organizations}
                pagination={{
                    defaultPageSize: 100,
                }}
                onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: (e) => {
                            setVisible(true);
                            setSelectedOrganization(record);
                        },
                    };
                }}
            />
        </Flex>
    );
};

export default OrganizationScreen;