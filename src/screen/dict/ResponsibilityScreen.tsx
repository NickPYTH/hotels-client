import React, {useEffect, useState} from 'react';
import {Button, Flex, Spin, Table, TableProps} from 'antd';
import {responsibilityAPI} from "../../service/ResponsibilityService";
import {ResponsibilityModel} from "../../model/ResponsibilityModel";
import {ResponsibilityModal} from "../../component/dict/ResponsibilityModal";

const ResponsibilityScreen: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [selectedResponsibilities, setSelectedResponsibilities] = useState<ResponsibilityModel | null>(null);
    const [getAll, {
        data: responsibilities,
        isLoading: isResponsibilitiesLoading
    }] = responsibilityAPI.useGetAllMutation();

    useEffect(() => {
        getAll();
    }, []);
    useEffect(() => {
        if (!visible) setSelectedResponsibilities(null);
    }, [visible]);

    const columns: TableProps<ResponsibilityModel>['columns'] = [
        {
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend'
        },
        {
            title: 'Табельный номер',
            dataIndex: 'tabnum',
            key: 'tabnum',
            filters: responsibilities?.reduce((acc: { text: string, value: string }[], responsibilityModel: ResponsibilityModel) => {
                if (responsibilityModel.tabnum)
                    if (acc.find((g: { text: string, value: string }) => g.text === responsibilityModel.tabnum.toString()) === undefined)
                        return acc.concat({text: responsibilityModel.tabnum.toString(), value: responsibilityModel.tabnum.toString()});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: ResponsibilityModel) => {
                return record.tabnum?.toString().indexOf(value) === 0
            },
        },
        {
            title: 'ФИО',
            dataIndex: 'fio',
            key: 'fio',
            filters: responsibilities?.reduce((acc: { text: string, value: string }[], responsibilityModel: ResponsibilityModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === responsibilityModel.fio) === undefined)
                    return acc.concat({text: responsibilityModel.fio, value: responsibilityModel.fio});
                return acc;
            }, []),
            onFilter: (value: any, record: ResponsibilityModel) => {
                return record.fio.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Филиал',
            dataIndex: 'filial',
            key: 'filial',
            filters: responsibilities?.reduce((acc: { text: string, value: string }[], responsibilityModel: ResponsibilityModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === responsibilityModel.filial) === undefined)
                    return acc.concat({text: responsibilityModel.filial, value: responsibilityModel.filial});
                return acc;
            }, []),
            onFilter: (value: any, record: ResponsibilityModel) => {
                return record.filial.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Общежитие',
            dataIndex: 'hotel',
            key: 'hotel',
            filters: responsibilities?.reduce((acc: { text: string, value: string }[], responsibilityModel: ResponsibilityModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === responsibilityModel.hotel) === undefined)
                    return acc.concat({text: responsibilityModel.hotel, value: responsibilityModel.hotel});
                return acc;
            }, []),
            filterSearch: true,
            onFilter: (value: any, record: ResponsibilityModel) => {
                return record.hotel.indexOf(value) === 0
            },
        },
    ]

    if (isResponsibilitiesLoading)
        return <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100vw'}}>
            <Spin size={'large'}/>
        </div>
    return (
        <Flex vertical={true}>
            {visible && <ResponsibilityModal selected={selectedResponsibilities} visible={visible} setVisible={setVisible} refresh={getAll}/>}
            <Button type={'primary'} onClick={() => setVisible(true)} style={{width: 100, margin: 10}}>Добавить</Button>
            <Table
                style={{width: '100vw'}}
                columns={columns}
                dataSource={responsibilities}
                pagination={{
                    defaultPageSize: 100,
                }}
                onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: (e) => {
                            setVisible(true);
                            setSelectedResponsibilities(record);
                        },
                    };
                }}
            />
        </Flex>
    );
};

export default ResponsibilityScreen;