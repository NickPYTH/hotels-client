import React, {useEffect, useState} from 'react';
import {Button, Flex, Modal, Popconfirm, Spin, Table, TableProps} from 'antd';
import dayjs, {Dayjs} from "dayjs";
import {flatAPI} from '../../service/FlatService';
import {GuestModel} from "../../model/GuestModel";
import {host} from "../../config/constants";
import {guestAPI} from "../../service/GuestService";

type ModalProps = {
    selectedDate: Dayjs,
    hotelId: string
    visible: boolean,
    setVisible: Function,
}

type GuestCardProps = {
    guest: GuestModel,
    setSelectedGuest: Function
}

export const NotCheckoutedModal = (props: ModalProps) => {

    // States
    const [data, setData] = useState<GuestModel[]>([]);
    const [selectedGuest, setSelectedGuest] = useState<GuestModel | null>(null);
    // -----

    // Web requests
    const [getGuests, {
        data: guests,
        isLoading,
    }] = flatAPI.useGetAllNotCheckotedBeforeTodayByHotelIdMutation();
    const [checkout, {
        data: checkoutData,
    }] = guestAPI.useCheckoutMutation();
    // -----

    // Effects
    useEffect(() => {
        getGuests({hotelId: props.hotelId, date: props.selectedDate.format("DD-MM-YYYY HH:mm")})
    }, []);
    useEffect(() => {
        if (guests) setData(guests);
    }, [guests]);
    useEffect(() => {
        if (checkoutData) {
            setData(prev => prev.filter((rec: GuestModel) => rec.id !== selectedGuest?.id));
            setSelectedGuest(null);
        }
    }, [checkoutData]);
    // -----

    // Useful utils
    const GuestCard = (props: GuestCardProps) => {
        return (
            <Modal onCancel={() => props.setSelectedGuest(null)} visible={true} footer={<></>} title={`${props.guest.lastname} ${props.guest.firstname ? props.guest.firstname[0]+"." : ""} ${props.guest.secondName ? props.guest.secondName[0]+"." : ""}`}
                   width={450}>
                <div>
                    Филиал: {props.guest?.filialEmployee}
                </div>
                <div>
                    Должность: {props.guest?.post}
                </div>
                <div>
                    № договор: {props.guest?.contractNumber}
                </div>
                <div>
                    Общая стоимость проживания: {props.guest?.cost}
                </div>
                <div>
                    Стоимость проживания за ночь: {props.guest?.costByNight}
                </div>
                <div>
                    Количество ночей: {props.guest?.daysCount}
                </div>
                <div>
                    Дата заселения: {props.guest?.dateStart}
                </div>
                <div>
                    Дата выселения: {props.guest?.dateFinish}
                </div>
                <Flex style={{width: '100%'}} vertical align={'center'}>
                    <Button style={{marginTop: 15, width: 280}} onClick={() => {
                        let tmpButton = document.createElement('a');
                        if (props.guest) {
                            let periodStart = props.guest.dateStart;
                            let periodEnd = props.guest.dateFinish;
                            tmpButton.href = `${host}/hotels/api/report/getCheckoutReport?id=${props.guest.id}&periodStart=${periodStart}&periodEnd=${periodEnd}`;
                            tmpButton.click();
                        }
                    }}>Отчетный документ</Button>

                    <Popconfirm title={"Вы уверены?"} onConfirm={() => {
                        checkout(props.guest.id);
                    }}>
                        <Button style={{marginTop: 5, width: 280}} danger>Выселить</Button>
                    </Popconfirm>
                </Flex>
            </Modal>
        )
    };
    const columns: TableProps<GuestModel>['columns'] = [
        {
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
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
            title: 'Табельный',
            dataIndex: 'tabnum',
            key: 'tabnum',
            filters: guests?.reduce((acc: { text: string, value: string }[], guest: GuestModel) => {
                if (guest.tabnum) {
                    if (acc.find((g: { text: string, value: string }) => g.text === guest.tabnum?.toString()) === undefined)
                        return acc.concat({text: guest.tabnum.toString(), value: guest.tabnum.toString()});
                }
                return acc;
            }, []),
            onFilter: (value: any, record: GuestModel) => {
                return record.tabnum?.toString().indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Фамилия',
            dataIndex: 'lastname',
            key: 'lastname',
            sorter: (a, b) => a.lastname.length - b.lastname.length,
            sortDirections: ['descend', 'ascend'],
            filters: guests?.reduce((acc: { text: string, value: string }[], guest: GuestModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === guest.lastname) === undefined)
                    return acc.concat({text: guest.lastname, value: guest.lastname});
                else return acc;
            }, []),
            onFilter: (value: any, record: GuestModel) => {
                return record.lastname.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Имя',
            dataIndex: 'firstname',
            key: 'firstname',
            sorter: (a, b) => a.firstname.length - b.firstname.length,
            sortDirections: ['descend', 'ascend'],
            filters: guests?.reduce((acc: { text: string, value: string }[], guest: GuestModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === guest.firstname) === undefined)
                    return acc.concat({text: guest.firstname, value: guest.firstname});
                else return acc;
            }, []),
            onFilter: (value: any, record: GuestModel) => {
                return record.firstname.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Отчество',
            dataIndex: 'secondName',
            key: 'secondName',
            sorter: (a, b) => a.secondName.length - b.secondName.length,
            sortDirections: ['descend', 'ascend'],
            filters: guests?.reduce((acc: { text: string, value: string }[], guest: GuestModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === guest.secondName) === undefined)
                    return acc.concat({text: guest.secondName, value: guest.secondName});
                else return acc;
            }, []),
            onFilter: (value: any, record: GuestModel) => {
                return record.secondName.indexOf(value) === 0
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
        {
            title: 'Филиал',
            dataIndex: 'bed',
            key: 'filial',
            sorter: (a, b) => a.bed.room.flat.hotel.filial.name.length - b.bed.room.flat.hotel.filial.name.length,
            sortDirections: ['descend', 'ascend'],
            filters: guests?.reduce((acc: { text: string, value: number }[], guest: GuestModel) => {
                let filial = guest.bed.room.flat.hotel.filial;
                if (acc.find((g: { text: string, value: number }) => g.value == filial.id) === undefined)
                    return acc.concat({text: filial.name, value: filial.id});
                else return acc;
            }, []),
            onFilter: (value: string, record: GuestModel) => {
                return record.bed.room.flat.hotel.filial.name.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Общежитие',
            dataIndex: 'bed',
            key: 'hotel',
            sorter: (a, b) => a.bed.room.flat.hotel.name.length - b.bed.room.flat.hotel.name.length,
            sortDirections: ['descend', 'ascend'],
            filters: guests?.reduce((acc: { text: string, value: number }[], guest: GuestModel) => {
                let hotel = guest.bed.room.flat.hotel;
                if (acc.find((g: { text: string, value: number }) => g.value == hotel.id) === undefined)
                    return acc.concat({text: hotel.name, value: hotel.id});
                else return acc;
            }, []),
            onFilter: (value: string, record: GuestModel) => {
                return record.bed.room.flat.hotel.name.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Квартира',
            dataIndex: 'bed',
            key: 'flat',
            sorter: (a, b) => a.bed.room.flat.name.length - b.bed.room.flat.name.length,
            sortDirections: ['descend', 'ascend'],
            filters: guests?.reduce((acc: { text: string, value: number }[], guest: GuestModel) => {
                let flat = guest.bed.room.flat;
                if (acc.find((g: { text: string, value: number }) => g.value == flat.id) === undefined)
                    return acc.concat({text: flat.name, value: flat.id});
                else return acc;
            }, []),
            onFilter: (value: string, record: GuestModel) => {
                return record.bed.room.flat.name.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Комната',
            dataIndex: 'bed',
            key: 'room',
            sorter: (a, b) => a.bed.room.name.length - b.bed.room.name.length,
            sortDirections: ['descend', 'ascend'],
            filters: guests?.reduce((acc: { text: string, value: number }[], guest: GuestModel) => {
                let room = guest.bed.room;
                if (acc.find((g: { text: string, value: number }) => g.value == room.id) === undefined)
                    return acc.concat({text: room.name, value: room.id});
                else return acc;
            }, []),
            onFilter: (value: string, record: GuestModel) => {
                return record.bed.room.name.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Организация',
            dataIndex: 'organization',
            key: 'organization',
        },
        {
            title: 'Рег. по месту пребывания',
            dataIndex: 'regPoMestu',
            key: 'regPoMestu',
            render: (value) => value ? "Да" : "Нет"
        },
    ];
    // -----

    return (
        <Modal title={`Список не выселенных жильцов на ${props.selectedDate.format('DD-MM-YYYY HH:mm')}`}
               open={props.visible}
               footer={<></>}
               width={window.innerWidth - 50}
               onCancel={() => props.setVisible(false)}
               maskClosable={false}
        >
            {selectedGuest && <GuestCard guest={selectedGuest} setSelectedGuest={setSelectedGuest}/>}
            {isLoading ?
                <Flex style={{width: "100%"}} justify={'center'} align={'center'}>
                    <Spin style={{marginTop: 50, marginBottom: 50}} size={"large"}/>
                </Flex>
                :
                <Table
                    style={{width: '100vw'}}
                    columns={columns}
                    dataSource={data}
                    pagination={{
                        defaultPageSize: 100,
                    }}
                    onRow={(record, rowIndex) => {
                        return {
                            onDoubleClick: (e) => {
                                setSelectedGuest(record);
                            },
                        };
                    }}
                />
            }
        </Modal>
    );
};
