import React, {useEffect, useState} from 'react';
import {Button, Flex, Table, TableProps} from 'antd';
import {organizationAPI} from "service/OrganizationService";
import {OrganizationModel} from "entities/OrganizationModel";
import {OrganizationModal} from "./OrganizationModal";

const OrganizationPage: React.FC = () => {

    // States
    const [isVisibleOrganizationModal, setIsVisibleOrganizationModal] = useState(false);
    const [selectedOrganization, setSelectedOrganization] = useState<OrganizationModel | null>(null);
    // -----

    // Web requests
    const [getAll, {
        data: organizations,
        isLoading: isOrganizationsLoading
    }] = organizationAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        getAll();
    }, []);
    useEffect(() => {
        if (!isVisibleOrganizationModal) setSelectedOrganization(null);
    }, [isVisibleOrganizationModal]);
    // -----

    // Useful utils
    const columns: TableProps<OrganizationModel>['columns'] = [
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
    // -----

    return (
        <Flex vertical={true}>
            {isVisibleOrganizationModal &&
                <OrganizationModal selectedOrganization={selectedOrganization} visible={isVisibleOrganizationModal}
                                   setVisible={setIsVisibleOrganizationModal} refresh={getAll}/>}
            <Flex vertical={true}>
                <h3 style={{marginLeft: 15}}>Организации</h3>
                <Button type={'primary'} onClick={() => setIsVisibleOrganizationModal(true)}
                        style={{width: 100, margin: 10}}>Добавить</Button>
            </Flex>
            <Table
                style={{width: '100vw'}}
                columns={columns}
                dataSource={organizations}
                loading={isOrganizationsLoading}
                pagination={{
                    defaultPageSize: 100,
                }}
                onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: (e) => {
                            setIsVisibleOrganizationModal(true);
                            setSelectedOrganization(record);
                        },
                    };
                }}
            />
        </Flex>
    );
};

export default OrganizationPage;