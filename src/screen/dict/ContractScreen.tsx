import React, {useEffect, useState} from 'react';
import {Button, Flex, Spin, Table, TableProps} from 'antd';
import {ContractModel} from "../../model/ContractModel";
import {contractAPI} from "../../service/ContractService";
import {ContractModal} from "../../component/dict/ContractModal";
import {host} from "../../config/constants";

const ContractScreen: React.FC = () => {

    // States
    const [visible, setVisible] = useState(false);
    const [selectedContract, setSelectedContract] = useState<ContractModel | null>(null);
    const [contracts, setContracts] = useState<ContractModel[]>([]);
    // -----

    // Web requests
    const [getAll, {
        data: contractsData,
        isLoading: isContractsLoading
    }] = contractAPI.useGetAllMutation();
    const [getAllSilent, {
        data: contractsDataSilent,
    }] = contractAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        getAll();
    }, []);
    useEffect(() => {
        if (contractsData) setContracts(contractsData);
    }, [contractsData]);
    useEffect(() => {
        if (!visible) setSelectedContract(null);
    }, [visible]);
    useEffect(() => {
        if (contractsDataSilent) setContracts(contractsDataSilent);
    }, [contractsDataSilent]);
    // -----

    const columns: TableProps<ContractModel>['columns'] = [
        {
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend',
        },
        {
            title: 'Филиал',
            dataIndex: 'filial',
            key: 'filial',
            filters: contracts?.reduce((acc: { text: string, value: string }[], contract: ContractModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === contract.filial) === undefined)
                    return acc.concat({text: contract.filial, value: contract.filial});
                return acc;
            }, []),
            onFilter: (value: any, record: ContractModel) => {
                return record.filial.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Общежитие',
            dataIndex: 'hotel',
            key: 'hotel',
            filters: contracts?.reduce((acc: { text: string, value: string }[], contract: ContractModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === contract.hotel) === undefined)
                    return acc.concat({text: contract.hotel, value: contract.hotel});
                return acc;
            }, []),
            onFilter: (value: any, record: ContractModel) => {
                if (record.hotel === null && value === null) return true;
                return record.hotel?.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Организация',
            dataIndex: 'organization',
            key: 'organization',
            filters: contracts?.reduce((acc: { text: string, value: string }[], contract: ContractModel) => {
                if (contract.organization)
                    if (acc.find((g: { text: string, value: string }) => g.text === contract.organization) === undefined)
                        return acc.concat({text: contract.organization, value: contract.organization});
                return acc;
            }, []),
            onFilter: (value: any, record: ContractModel) => {
                if (record.organization === null && value === null) return true;
                return record.organization?.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Номер договора',
            dataIndex: 'docnum',
            key: 'docnum',
            filters: contracts?.reduce((acc: { text: string, value: string }[], contract: ContractModel) => {
                if (contract.docnum)
                    if (acc.find((g: { text: string, value: string }) => g.text === contract.docnum) === undefined)
                        return acc.concat({text: contract.docnum, value: contract.docnum});
                return acc;
            }, []),
            onFilter: (value: any, record: ContractModel) => {
                if (record.docnum === null && value === null) return true;
                return record.docnum?.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Стоимость',
            dataIndex: 'cost',
            key: 'cost',
            sorter: (a, b) => a.cost - b.cost,
        },
        {
            title: 'Основание',
            dataIndex: 'reason',
            key: 'reason',
            filters: contracts?.reduce((acc: { text: string, value: string }[], contract: ContractModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === contract.reason) === undefined)
                    return acc.concat({text: contract.reason ?? "", value: contract.reason ?? ""});
                return acc;
            }, []),
            onFilter: (value: any, record: ContractModel) => {
                return record.reason?.indexOf(value) === 0
            },
        },
        {
            title: 'Расчет',
            dataIndex: 'billing',
            key: 'billing',
            filters: contracts?.reduce((acc: { text: string, value: string }[], contract: ContractModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === contract.billing) === undefined)
                    return acc.concat({text: contract.billing ?? "", value: contract.billing ?? ""});
                return acc;
            }, []),
            onFilter: (value: any, record: ContractModel) => {
                return record.billing?.indexOf(value) === 0
            },
        },
        {
            title: 'Примечание',
            dataIndex: 'note',
            key: 'note',
            filters: contracts?.reduce((acc: { text: string, value: string }[], contract: ContractModel) => {
                if (contract.note)
                    if (acc.find((g: { text: string, value: string }) => g.text === contract.note) === undefined)
                        return acc.concat({text: contract.note, value: contract.note});
                return acc;
            }, []),
            onFilter: (value: any, record: ContractModel) => {
                return record.note.indexOf(value) === 0
            },
        },
        {
            title: 'Год',
            dataIndex: 'year',
            key: 'year',
            filters: contracts?.reduce((acc: { text: string, value: string }[], contract: ContractModel) => {
                if (contract.year)
                    if (acc.find((g: { text: string, value: string }) => g.text === contract.year.toString()) === undefined)
                        return acc.concat({text: contract.year.toString(), value: contract.year.toString()});
                return acc;
            }, []),
            onFilter: (value: any, record: ContractModel) => {
                return record.year.toString().indexOf(value) === 0
            },
        },
        {
            title: 'Комната',
            dataIndex: 'roomNumber',
            key: 'roomNumber',
            filters: contracts?.reduce((acc: { text: string, value: string }[], contract: ContractModel) => {
                if (contract.roomNumber)
                    if (acc.find((g: { text: string, value: string }) => g.text === contract.roomNumber?.toString()) === undefined)
                        return acc.concat({text: contract.roomNumber?.toString(), value: contract.roomNumber?.toString()});
                return acc;
            }, []),
            onFilter: (value: any, record: ContractModel) => {
                return record.roomNumber?.toString().indexOf(value) === 0
            },
        },
    ]

    if (isContractsLoading)
        return <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100vw'}}>
            <Spin size={'large'}/>
        </div>
    return (
        <Flex vertical={true}>
            {visible && <ContractModal selectedContract={selectedContract} visible={visible} setVisible={setVisible} refresh={getAllSilent}/>}
            <Flex justify={'space-between'}>
                <Button type={'primary'} onClick={() => setVisible(true)} style={{width: 100, margin: 10}}>Добавить</Button>
                <Button type={'primary'} onClick={() => {
                    let tmpButton = document.createElement('a');
                    tmpButton.href = `${host}/hotels/api/contract/getAllReport`
                    tmpButton.click();
                }} style={{width: 100, margin: 10}}>Отчет</Button>
            </Flex>
            <Table
                style={{width: '100vw'}}
                columns={columns}
                dataSource={contracts}
                pagination={{
                    defaultPageSize: 100,
                }}
                onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: (e) => {
                            setVisible(true);
                            setSelectedContract(record);
                        },
                    };
                }}
            />
        </Flex>
    );
};

export default ContractScreen;