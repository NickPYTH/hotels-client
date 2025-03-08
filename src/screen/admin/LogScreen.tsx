import React, {useEffect} from 'react';
import {Flex, Spin, Table, TableProps, Tag} from 'antd';
import {RootStateType} from "../../store/store";
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {logAPI} from "../../service/LogService";
import {LogModel} from "../../model/LogModel";

const LogScreen: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = useSelector((state: RootStateType) => state.currentUser.user);
    if (currentUser.roleId !== 1 && currentUser.roleId !== 999) navigate(`../hotels/`);
    const [getAll, {
        data: logs,
        isLoading: isLogsLoading
    }] = logAPI.useGetAllMutation();

    useEffect(() => {
        getAll();
    }, []);

    const columns: TableProps<LogModel>['columns'] = [
        {
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend'
        },
        {
            title: 'Дата',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Пользователь',
            dataIndex: 'user',
            key: 'user',
            filters: logs?.reduce((acc: { text: string, value: string }[], logModel: LogModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === logModel.user) === undefined)
                    return acc.concat({text: logModel.user, value: logModel.user});
                return acc;
            }, []),
            onFilter: (value: any, record: LogModel) => {
                return record.user?.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (e) => (<Tag color={e==='OK'?'green':'error'}>{e}</Tag>),
            filters: logs?.reduce((acc: { text: string, value: string }[], logModel: LogModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === logModel.status) === undefined)
                    return acc.concat({text: logModel.status, value: logModel.status});
                return acc;
            }, []),
            onFilter: (value: any, record: LogModel) => {
                return record.status.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Путь',
            dataIndex: 'path',
            key: 'path',
            filters: logs?.reduce((acc: { text: string, value: string }[], logModel: LogModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === logModel.path) === undefined)
                    return acc.concat({text: logModel.path, value: logModel.path});
                return acc;
            }, []),
            onFilter: (value: any, record: LogModel) => {
                return record.path.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Длительность запроса',
            dataIndex: 'duration',
            key: 'duration',
            sorter: (a, b) => a.duration - b.duration,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Информация',
            dataIndex: 'message',
            key: 'message',
        },
    ]

    if (isLogsLoading)
        return <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100vw'}}>
            <Spin size={'large'}/>
        </div>
    return (
        <Flex vertical={true}>
            <Table
                style={{width: '100vw'}}
                columns={columns}
                dataSource={logs}
                pagination={{
                    defaultPageSize: 100,
                }}
            />
        </Flex>
    );
};

export default LogScreen;