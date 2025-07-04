import React, {useEffect, useState} from 'react';
import {Button, Flex, Modal, Table, TableProps} from 'antd';
import {guestAPI} from "service/GuestService";
import {GuestModel} from "entities/GuestModel";
import dayjs from 'dayjs';
import {OrganizationModel} from "entities/OrganizationModel";

type ModalProps = {
    visible: boolean,
    setVisible: Function,
    showSuccessMsg: Function,
    selectedOrganization: OrganizationModel,
    organizations: OrganizationModel[],
    setFirstname: Function,
    setLastname: Function,
    setSecondName: Function,
    setMale: Function,
}
export const SelectGuestFromOrgModal = (props: ModalProps) => {

    // States
    const [selectedRecord, setSelectedRecord] = useState<GuestModel | null>(null);
    // -----

    // Web requests
    const [getGuests, {
        data: guests,
        isLoading: isGuestsLoading
    }] = guestAPI.useGetAllByOrganizationIdMutation();
    // -----

    // Useful utils
    const columns: TableProps<GuestModel>['columns'] = [
        {
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => (a.id && b.id) ? a.id - b.id : 0,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend',
        },
        {
            title: 'Выселен',
            dataIndex: 'checkouted',
            key: 'checkouted',
            render: (val) => (<>{val ? "Да" : "Нет"}</>)
        },
        {
            title: 'Фамилия',
            dataIndex: 'lastname',
            key: 'lastname',
            sorter: (a, b) => (a.lastname ? a.lastname.length : 0) - (b.lastname ? b.lastname.length : 0),
            sortDirections: ['descend', 'ascend'],
            filters: guests?.reduce((acc: { text: string, value: string }[], guest: GuestModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === guest.lastname) === undefined)
                    return acc.concat({text: guest.lastname ?? "", value: guest.lastname ?? ""});
                else return acc;
            }, []),
            onFilter: (value: any, record: GuestModel) => {
                return record.lastname?.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Имя',
            dataIndex: 'firstname',
            key: 'firstname',
            sorter: (a, b) => (a.firstname ? a.firstname.length : 0) - (b.firstname ? b.firstname.length : 0),
            sortDirections: ['descend', 'ascend'],
            filters: guests?.reduce((acc: { text: string, value: string }[], guest: GuestModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === guest.firstname) === undefined)
                    return acc.concat({text: guest.firstname ?? "", value: guest.firstname ?? ""});
                else return acc;
            }, []),
            onFilter: (value: any, record: GuestModel) => {
                return record.firstname?.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Отчество',
            dataIndex: 'secondName',
            key: 'secondName',
            sorter: (a, b) =>  (a.secondName ? a.secondName.length : 0) - (b.secondName ? b.secondName.length : 0),
            sortDirections: ['descend', 'ascend'],
            filters: guests?.reduce((acc: { text: string, value: string }[], guest: GuestModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === guest.secondName) === undefined)
                    return acc.concat({text: guest.secondName ?? "", value: guest.secondName ?? ""});
                else return acc;
            }, []),
            onFilter: (value: any, record: GuestModel) => {
                return record.secondName?.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Дата заезда',
            dataIndex: 'dateStart',
            key: 'dateStart',
            sorter: (a, b) => {
                let date1 = dayjs(a.dateStart, "dd-MM-yyyy").unix();
                let date2 = dayjs(b.dateStart, "dd-MM-yyyy").unix();
                return date1 - date2;
            },
        },
        {
            title: 'Дата выезда',
            dataIndex: 'dateFinish',
            key: 'dateFinish',
            sorter: (a, b) => {
                let date1 = dayjs(a.dateFinish, "dd-MM-yyyy").unix();
                let date2 = dayjs(b.dateFinish, "dd-MM-yyyy").unix();
                return date1 - date2;
            },
        },
    ];
    // -----

    // Effects
    useEffect(() => {
        getGuests(props.selectedOrganization.id);
    }, []);
    // -----

    return (
        <Modal title={"Перечень жильцов"}
               open={props.visible}
               loading={isGuestsLoading}
               onCancel={() => props.setVisible(false)}
               width={window.innerWidth - 50}
               maskClosable={false}
               footer={() => {
               }}
        >
            <Flex vertical>
                <Button style={{width: 250, marginBottom: 10}} disabled={!selectedRecord} onClick={() => {
                    if (selectedRecord) {
                        props.setFirstname(selectedRecord.firstname);
                        props.setLastname(selectedRecord.lastname);
                        props.setSecondName(selectedRecord.secondName);
                        props.setMale(selectedRecord.male);
                        props.setVisible(false);
                    }
                }}>Взять данные выбранного жильца</Button>
                {guests &&
                    <Table
                        style={{width: window.innerWidth - 70}}
                        columns={columns}
                        dataSource={guests.map((guest: GuestModel) => ({...guest, key: guest.id}))}
                        pagination={{
                            defaultPageSize: 20,
                        }}
                        rowSelection={{
                            type: 'radio',
                            onChange: (selectedRowKeys, record) => {
                                setSelectedRecord(record[0]);
                            }
                        }}
                    />
                }
            </Flex>
        </Modal>
    );
};
