import React, {useEffect, useState} from 'react';
import {Button, Flex, Table, TableProps} from 'antd';
import {ContractModel} from "../../model/ContractModel";
import {contractAPI} from "../../service/ContractService";
import {ContractModal} from "../../component/dict/ContractModal";
import {host} from "../../config/constants";

const ContractScreen: React.FC = () => {

    // States
    const [isVisibleContractModal, setIsVisibleContractModal] = useState(false);
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
        if (contractsDataSilent) setContracts(contractsDataSilent);
    }, [contractsDataSilent]);
    useEffect(() => {
        if (!isVisibleContractModal) setSelectedContract(null);
    }, [isVisibleContractModal]);
    // -----

    // Useful utils
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
            filters: contracts?.reduce((acc: { text: string, value: string }[], contract: ContractModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === contract.cost?.toString()) === undefined)
                    return acc.concat({text: contract.cost.toString(), value: contract.cost.toString()});
                return acc;
            }, []),
            onFilter: (value: any, record: ContractModel) => {
                return record.cost?.toString().indexOf(value) === 0
            },
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
                return record.note?.indexOf(value) === 0
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
    ]
    // -----

    return (
        <Flex vertical={true}>
            {isVisibleContractModal && <ContractModal selectedContract={selectedContract} visible={isVisibleContractModal} setVisible={setIsVisibleContractModal} refresh={getAllSilent}/>}
            <Flex justify={'space-between'}>
                <Button type={'primary'} onClick={() => setIsVisibleContractModal(true)} style={{width: 100, margin: 10}}>Добавить</Button>
                <Button type={'primary'} onClick={() => {
                    let tmpButton = document.createElement('a');
                    tmpButton.href = `${host}/hotels/api/report/getAllContractReport`
                    tmpButton.click();
                }} style={{width: 100, margin: 10}}>Отчет</Button>
            </Flex>
            <Table
                style={{width: '100vw'}}
                columns={columns}
                dataSource={contracts}
                loading={isContractsLoading}
                pagination={{
                    defaultPageSize: 100,
                }}
                onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: (e) => {
                            setIsVisibleContractModal(true);
                            setSelectedContract(record);
                        },
                    };
                }}
            />
        </Flex>
    );
};

export default ContractScreen;