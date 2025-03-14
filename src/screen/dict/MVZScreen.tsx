import React, {useEffect, useRef, useState} from 'react';
import {Button, Flex, Input, InputRef, Space, Table, TableProps} from 'antd';
import {MVZAPI} from "../../service/MVZService";
import {MVZModel} from "../../model/MVZModel";
import {MVZModal} from "../../component/dict/MVZModal";
import {FilterConfirmProps} from "antd/es/table/interface";
import {ColumnType} from "antd/es/table";
import {SearchOutlined} from "@ant-design/icons";

export interface DataType extends MVZModel {
    key: React.Key;
    children?: any;
}

type DataIndex = keyof DataType;

const MVZScreen: React.FC = () => {

    // States
    const [isVisibleMvzModal, setIsVisibleMvzModal] = useState<boolean>(false);
    const [selectedMVZ, setSelectedMVZ] = useState<MVZModel | null>(null);
    // -----

    // Web requests
    const [getAll, {
        data: MVZs,
        isLoading: isMVZsLoading
    }] = MVZAPI.useGetAllMutation();
    // -----

    // Handlers
    const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
        confirm();
    };
    const handleReset = (clearFilters: () => void) => {
        clearFilters();
    };
    // -----

    // Useful utils
    const searchInput = useRef<InputRef>(null);
    const getColumnSearchProps = (dataIndex: any): ColumnType<any> => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
            <div style={{padding: 8}} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Поиск`}
                    value={selectedKeys[0]}
                    onChange={(e: any) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Поиск
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{width: 90}}
                    >
                        Сбросить
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Закрыть
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{color: filtered ? '#1677ff' : undefined}}/>
        ),
        onFilter: (value, record) => {
            if (record[dataIndex])
                try {
                    return record[dataIndex]
                        .toString()
                        .toLowerCase()
                        .includes((value as string).toLowerCase())
                } catch (e) {
                    return !!record.children.find((child: any) => child[dataIndex]
                        .toString()
                        .toLowerCase()
                        .includes((value as string).toLowerCase()));
                }
        },
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) => (<div>{text}</div>)
    });
    const columns: TableProps<MVZModel>['columns'] = [
        {
            title: 'Таб.№ проживающего',
            dataIndex: 'employeeTab',
            key: 'employeeTab',
            ...getColumnSearchProps('employeeTab'),
        },
        {
            title: 'ФИО',
            dataIndex: 'employeeFio',
            key: 'employeeFio',
            ...getColumnSearchProps('employeeFio'),
        },
        {
            title: 'МВЗ',
            dataIndex: 'mvz',
            key: 'mvz',
            ...getColumnSearchProps('mvz'),
        },
        {
            title: 'Наименование МВЗ',
            dataIndex: 'mvzName',
            key: 'mvzName',
            ...getColumnSearchProps('mvzName'),
        },
        {
            title: 'Филиал проживающего работника',
            dataIndex: 'filial',
            key: 'filial',
            render: (_, record) => (<div>{record.filial}</div>),
            filters: MVZs?.reduce((acc: { text: string, value: string }[], org: MVZModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === org.filial) === undefined)
                    return acc.concat({text: org.filial, value: org.filial});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: MVZModel) => {
                return record.filial.indexOf(value) === 0
            },
        },
        {
            title: 'Организационная единица работника',
            dataIndex: 'organization',
            key: 'organization',
            render: (_, record) => (<div>{record.organization}</div>),
            ...getColumnSearchProps('organization'),
        },
    ]
    // -----

    // Effects
    useEffect(() => {
        getAll();
    }, []);
    useEffect(() => {
        if (!isVisibleMvzModal) setSelectedMVZ(null);
    }, [isVisibleMvzModal]);
    // -----

    return (
        <Flex style={{marginTop: 5}} vertical={true}>
            {isVisibleMvzModal && <MVZModal selectedMVZ={selectedMVZ} visible={isVisibleMvzModal} setVisible={setIsVisibleMvzModal} refresh={getAll}/>}
            <Button type={'primary'} onClick={() => setIsVisibleMvzModal(true)} style={{width: 100, margin: 10}}>Добавить</Button>
            <Table
                style={{width: '100vw'}}
                columns={columns}
                dataSource={MVZs}
                loading={isMVZsLoading}
                rowKey={'id'}
                scroll={{x: window.innerWidth, y: window.innerHeight - 160}}
                onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: (e) => {
                            setIsVisibleMvzModal(true);
                            setSelectedMVZ(record);
                        },
                    };
                }}
            />
        </Flex>
    );
};

export default MVZScreen;