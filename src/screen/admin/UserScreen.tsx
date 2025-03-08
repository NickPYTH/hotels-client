import React, {useEffect, useState} from 'react';
import {Button, Flex, Spin, Table, TableProps} from 'antd';
import {userAPI} from "../../service/UserService";
import {UserModel} from "../../model/UserModel";
import {UserModal} from "../../component/dict/UserModal";
import {RootStateType} from "../../store/store";
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

const UserScreen: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = useSelector((state: RootStateType) => state.currentUser.user);
    if (currentUser.roleId !== 1 && currentUser.roleId !== 999) navigate(`../hotels/`);
    const [visible, setVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);
    const [getAll, {
        data: users,
        isLoading: isUsersLoading
    }] = userAPI.useGetAllMutation();

    useEffect(() => {
        getAll();
    }, []);
    useEffect(() => {
        if (!visible) setSelectedUser(null);
    }, [visible]);

    const columns: TableProps<UserModel>['columns'] = [
        {
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
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
    ]

    if (isUsersLoading)
        return <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100vw'}}>
            <Spin size={'large'}/>
        </div>
    return (
        <Flex vertical={true}>
            {visible && <UserModal selectedUser={selectedUser} visible={visible} setVisible={setVisible} refresh={getAll}/>}
            <Button type={'primary'} onClick={() => setVisible(true)} style={{width: 100, margin: 10}}>Добавить</Button>
            <Table
                style={{width: '100vw'}}
                columns={columns}
                dataSource={users}
                onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: (e) => {
                            setVisible(true);
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

export default UserScreen;