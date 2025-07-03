import React, {useEffect, useState} from 'react';
import {Button, Flex, Table, TableProps} from 'antd';
import {responsibilityAPI} from "service/ResponsibilityService";
import {ResponsibilityModel} from "entities/ResponsibilityModel";
import {ResponsibilityModal} from "./ResponsibilityModal";

const ResponsibilityPage: React.FC = () => {

    // States
    const [isVisibleResponsibilityModal, setIsVisibleResponsibilityModal] = useState(false);
    const [selectedResponsibility, setSelectedResponsibility] = useState<ResponsibilityModel | null>(null);
    // -----

    // Web requests
    const [getAll, {
        data: responsibilities,
        isLoading: isResponsibilitiesLoading
    }] = responsibilityAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        getAll();
    }, []);
    useEffect(() => {
        if (!isVisibleResponsibilityModal) setSelectedResponsibility(null);
    }, [isVisibleResponsibilityModal]);
    // -----

    // Useful utils
    const columns: TableProps<ResponsibilityModel>['columns'] = [
        {
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => (a.id && b.id) ? a.id - b.id : 0,
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
        }
    ]
    // -----

    return (
        <Flex vertical={true}>
            {isVisibleResponsibilityModal &&
                <ResponsibilityModal selected={selectedResponsibility} visible={isVisibleResponsibilityModal} setVisible={setIsVisibleResponsibilityModal} refresh={getAll}/>}
            <Button type={'primary'} onClick={() => setIsVisibleResponsibilityModal(true)} style={{width: 100, margin: 10}}>Добавить</Button>
            <Table
                style={{width: '100vw'}}
                columns={columns}
                dataSource={responsibilities}
                loading={isResponsibilitiesLoading}
                pagination={{
                    defaultPageSize: 100,
                }}
                onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: (e) => {
                            setIsVisibleResponsibilityModal(true);
                            setSelectedResponsibility(record);
                        },
                    };
                }}
            />
        </Flex>
    );
};

export default ResponsibilityPage;