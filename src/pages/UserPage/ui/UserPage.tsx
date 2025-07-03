import React, {useEffect, useState} from 'react';
import {Button, Flex, Table, TableProps} from 'antd';
import {userAPI} from "service/UserService";
import {UserModel} from "entities/UserModel";
import {UserModal} from "./UserModal";
import {ResponsibilityModel} from "entities/ResponsibilityModel";

const UserPage: React.FC = () => {

    // States
    const [isVisibleUserModal, setIsVisibleUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);
    // -----

    // Web requests
    const [getAll, {
        data: users,
        isLoading: isUsersLoading
    }] = userAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        getAll();
    }, []);
    useEffect(() => {
        if (!isVisibleUserModal) setSelectedUser(null);
    }, [isVisibleUserModal]);
    // -----

    // Useful utils
    const columns: TableProps<UserModel>['columns'] = [
        {
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => (a.id && b.id) ? a.id - b.id : 0,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend'
        },
        {
            title: 'Логин',
            dataIndex: 'username',
            key: 'username',
            filters: users?.reduce((acc: { text: string, value: string }[], userModel: UserModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === userModel.username) === undefined)
                    return acc.concat({text: userModel.username, value: userModel.username});
                return acc;
            }, []),
            onFilter: (value: any, record: UserModel) => {
                return record.username.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Табельный',
            dataIndex: 'tabnum',
            key: 'tabnum',
            filters: users?.reduce((acc: { text: string, value: string }[], userModel: UserModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === userModel.tabnum.toString()) === undefined)
                    return acc.concat({text: userModel.tabnum.toString(), value: userModel.tabnum.toString()});
                return acc;
            }, []),
            onFilter: (value: any, record: UserModel) => {
                return record.tabnum?.toString().indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'ФИО',
            dataIndex: 'fio',
            key: 'fio',
            sorter: (a, b) => a.fio.length - b.fio.length,
            sortDirections: ['descend', 'ascend'],
            filters: users?.reduce((acc: { text: string, value: string }[], userModel: UserModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === userModel.fio) === undefined)
                    return acc.concat({text: userModel.fio, value: userModel.fio});
                return acc;
            }, []),
            onFilter: (value: any, record: UserModel) => {
                return record.fio?.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Филиал',
            dataIndex: 'filial',
            key: 'filial',
            sorter: (a, b) => a.filial.length - b.filial.length,
            sortDirections: ['descend', 'ascend'],
            filters: users?.reduce((acc: { text: string, value: string }[], userModel: UserModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === userModel.filial) === undefined)
                    return acc.concat({text: userModel.filial, value: userModel.filial});
                return acc;
            }, []),
            onFilter: (value: any, record: UserModel) => {
                return record.filial?.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Роль',
            dataIndex: 'roleName',
            key: 'roleName',
            sorter: (a, b) => a.roleName.length - b.roleName.length,
            sortDirections: ['descend', 'ascend'],
            filters: users?.reduce((acc: { text: string, value: string }[], userModel: UserModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === userModel.roleName) === undefined)
                    return acc.concat({text: userModel.roleName, value: userModel.roleName});
                return acc;
            }, []),
            onFilter: (value: any, record: UserModel) => {
                return record.roleName?.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Альт. должность',
            dataIndex: 'customPost',
            key: 'customPost',
            filters: users?.reduce((acc: { text: string, value: string }[], userModel: UserModel) => {
                if (userModel.customPost) {
                    if (acc.find((g: { text: string, value: string }) => g.text === userModel.customPost) === undefined)
                        return acc.concat({text: userModel.customPost, value: userModel.customPost});
                }
                return acc;
            }, []),
            onFilter: (value: any, record: UserModel) => {
                return record.customPost?.indexOf(value) === 0
            },
            filterSearch: true,
        },
    ]
    // -----

    return (
        <Flex vertical={true}>
            {isVisibleUserModal && <UserModal selectedUser={selectedUser} visible={isVisibleUserModal} setVisible={setIsVisibleUserModal} refresh={getAll}/>}
            <Button type={'primary'} onClick={() => setIsVisibleUserModal(true)} style={{width: 100, margin: 10}}>Добавить</Button>
            <Table
                style={{width: '100vw'}}
                columns={columns}
                dataSource={users}
                loading={isUsersLoading}
                onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: (e) => {
                            setIsVisibleUserModal(true);
                            setSelectedUser(record);
                        },
                    };
                }}
                pagination={{
                    defaultPageSize: 100,
                }}
            />
        </Flex>
    );
};

export default UserPage;