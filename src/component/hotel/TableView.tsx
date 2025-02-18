import {Badge, Button, Flex, Popconfirm, Table, TableProps, Tooltip} from "antd";
import {FlatModel} from "../../model/FlatModel";
import React, {useEffect, useState} from "react";
import {RoomModel} from "../../model/RoomModel";
import {GuestModal} from "../dict/GuestModal";
import {ClockCircleOutlined, HomeOutlined, LockOutlined} from "@ant-design/icons";
import {GuestModel} from "../../model/GuestModel";
import dayjs, {Dayjs} from "dayjs";
//@ts-ignore
import Male from "../../assets/male.png";
//@ts-ignore
import Female from "../../assets/female.png";
import {FlatModal} from "./FlatModal";

type ModalProps = {
    flatsData: FlatModel[],
    visibleGuestModal: boolean,
    setVisibleGuestModal: Function,
    selectedDate: Dayjs
}

export const TableView = (props:ModalProps) => {

    // States
    const [selectedGuest, setSelectedGuest] = useState<GuestModel | null>(null);
    const [selectedFlatId, setSelectedFlatId] = useState<number | null> (null);
    const [flatModalVisible,setFlatModalVisible] = useState(false);
    // -----

    // Effects
    useEffect(() => {
        if (!flatModalVisible) setSelectedFlatId(null);
    }, [flatModalVisible]);
    // -----

    // Useful utils
    const columns: TableProps<FlatModel>['columns'] = [
        {
            title: 'Этаж',
            dataIndex: 'floor',
            key: 'floor',
            sorter: (a, b) => a.floor - b.floor,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'ascend',
            render: (_, flat) => (<div style={{marginLeft: 15}}>{flat.floor}</div>),
            filters: props.flatsData.reduce((acc: { text: string, value: string }[], flat: FlatModel) => {
                    if (acc.find((g: { text: string, value: string }) => g.text === flat.floor?.toString()) === undefined)
                        return acc.concat({text: flat.floor.toString(), value: flat.floor.toString()});
                return acc;
            }, []),
            onFilter: (value: any, flat: FlatModel) => {
                return flat.floor?.toString().indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Секция',
            dataIndex: 'name',
            key: 'name',
            filters: props.flatsData.reduce((acc: { text: string, value: string }[], flat: FlatModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === flat.name) === undefined)
                    return acc.concat({text: flat.name, value: flat.name});
                return acc;
            }, []),
            onFilter: (value: any, flat: FlatModel) => {
                return flat.name.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Комнаты и жильцы',
            dataIndex: 'room',
            key: 'rooms',
            render: (_, flat) => {
                return(
                    <>
                        {flat.rooms.map((room: RoomModel, i: number) => {
                            return (
                                <div style={{
                                    padding: 5,
                                    paddingRight: 8,
                                    borderRadius: 4,
                                    width: 100,
                                    height: 25,
                                    boxShadow: "0px 0px 5px 1px rgba(34, 60, 80, 0.2) inset",
                                    margin: 5
                                }}>
                                    {(props.visibleGuestModal && selectedGuest) && <GuestModal
                                        showSuccessMsg={() => {}}
                                        isAddressDisabled={true}
                                        selectedGuest={selectedGuest}
                                        visible={props.visibleGuestModal}
                                        setVisible={props.setVisibleGuestModal}
                                        refresh={() => {}}/>}

                                    {(room.statusId == 2 || room.statusId == 3) &&
                                        <Tooltip title={room.statusId == 2 ? "Комната закрыта от заселения" : "Комната выкуплена организацией"}>
                                            {room.statusId == 2 ?
                                                <LockOutlined style={{color: '#d9534f', position: 'absolute', top: 10, left: -15}}/>
                                                :
                                                <HomeOutlined style={{color: '#f0ad4e', position: 'absolute', top: 10, left: -15}}/>
                                            }
                                        </Tooltip>
                                    }
                                    <Flex justify={'space-between'}>
                                        <Flex justify={'center'} align={'center'} style={{width: 22, height: 22}}>
                                            К{i + 1}
                                        </Flex>
                                        {room.guests.map((guest: GuestModel) => {
                                            let daysBeforeCheckouted = dayjs(guest.dateFinish, "DD-MM-YYYY HH:mm").diff(props.selectedDate, 'days');
                                            return (
                                                <Popconfirm cancelText={"Закрыть"} okText={"Открыть"}
                                                            onConfirm={() => {
                                                                props.setVisibleGuestModal(true);
                                                                setSelectedGuest(guest);
                                                            }}
                                                            title={`${guest.lastname} ${guest.firstname[0]}. ${guest.secondName[0]}. ${guest.post ?? ""} ${guest.organization ?? ""}`}
                                                            description={`Даты проживания C ${guest.dateStart} По ${guest.dateFinish}. До выселения(суток): ${daysBeforeCheckouted == 0 ? "Сегодня" : daysBeforeCheckouted}`}>
                                                    {daysBeforeCheckouted < 2 ?
                                                        <Badge count={<ClockCircleOutlined style={{color: '#f5222d'}}/>}>
                                                            {guest.male ?
                                                                <img style={{marginTop: 2}} width={22} height={22} src={Male}/>
                                                                :
                                                                <img style={{marginTop: 2}} width={22} height={22} src={Female}/>
                                                            }
                                                        </Badge>
                                                        :
                                                        <>
                                                            {guest.male ?
                                                                <img style={{marginTop: 2}} width={22} height={22} src={Male}/>
                                                                :
                                                                <img style={{marginTop: 2}} width={22} height={22} src={Female}/>
                                                            }
                                                        </>
                                                    }
                                                </Popconfirm>)
                                        })}
                                        {room.bedsCount - room.guests.length === 1 && <Flex justify={'center'} align={'center'} style={{width: 22, height: 22}}><Badge status={'success'}/></Flex>}
                                        {room.bedsCount - room.guests.length === 2 && <><Flex justify={'center'} align={'center'} style={{width: 22, height: 22}}><Badge status={'success'}/></Flex><Flex
                                            justify={'center'} align={'center'} style={{width: 22, height: 22}}><Badge status={'success'}/></Flex></>}
                                        {room.bedsCount - room.guests.length === 3 && <>
                                            <Flex justify={'center'} align={'center'} style={{width: 22, height: 22}}><Badge status={'success'}/></Flex>
                                            <Flex justify={'center'} align={'center'} style={{width: 22, height: 22}}><Badge status={'success'}/></Flex>
                                            <Flex justify={'center'} align={'center'} style={{width: 22, height: 22}}><Badge status={'success'}/></Flex>
                                        </>}
                                        {room.bedsCount - room.guests.length === 4 && <>
                                            <Flex justify={'center'} align={'center'} style={{width: 22, height: 22}}><Badge status={'success'}/></Flex>
                                            <Flex justify={'center'} align={'center'} style={{width: 22, height: 22}}><Badge status={'success'}/></Flex>
                                            <Flex justify={'center'} align={'center'} style={{width: 22, height: 22}}><Badge status={'success'}/></Flex>
                                            <Flex justify={'center'} align={'center'} style={{width: 22, height: 22}}><Badge status={'success'}/></Flex>
                                        </>}
                                    </Flex>
                                </div>
                            )
                        })}
                    </>
                )
            },
        },
        {
            title: 'Колличество комнат',
            dataIndex: 'roomsCount',
            key: 'roomsCount',
            sorter: (a, b) => a.roomsCount - b.roomsCount,
            sortDirections: ['descend', 'ascend'],
            filters: props.flatsData.reduce((acc: { text: string, value: string }[], flat: FlatModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === flat.roomsCount.toString()) === undefined)
                    return acc.concat({text: flat.roomsCount.toString(), value: flat.roomsCount.toString()});
                return acc;
            }, []),
            onFilter: (value: any, flat: FlatModel) => {
                return flat.roomsCount.toString().indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Свободных мест',
            dataIndex: 'emptyBedsCount',
            key: 'emptyBedsCount',
            sorter: (a, b) => a.emptyBedsCount - b.emptyBedsCount,
            sortDirections: ['descend', 'ascend'],
            filters: props.flatsData.reduce((acc: { text: string, value: string }[], flat: FlatModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === flat.emptyBedsCount.toString()) === undefined)
                    return acc.concat({text: flat.emptyBedsCount.toString(), value: flat.emptyBedsCount.toString()});
                return acc;
            }, []),
            onFilter: (value: any, flat: FlatModel) => {
                return flat.emptyBedsCount.toString().indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Занятых мест',
            dataIndex: 'busyBedsCount',
            key: 'busyBedsCount',
            render: (_, flat) => (<div>{flat.bedsCount - flat.emptyBedsCount}</div>),
            sorter: (a, b) => (a.bedsCount - a.emptyBedsCount) - (b.bedsCount - b.emptyBedsCount),
            sortDirections: ['descend', 'ascend'],
            filters: props.flatsData.reduce((acc: { text: string, value: string }[], flat: FlatModel) => {
                let tmp = flat.bedsCount - flat.emptyBedsCount;
                if (acc.find((g: { text: string, value: string }) => g.text === tmp.toString()) === undefined)
                    return acc.concat({text: tmp.toString(), value: tmp.toString()});
                return acc;
            }, []),
            onFilter: (value: any, flat: FlatModel) => {
                let tmp = flat.bedsCount - flat.emptyBedsCount;
                return tmp.toString().indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            render: (_, flat) => {
                return(
                    <Flex vertical={true}>
                        <Button onClick={() => {
                            setSelectedFlatId(flat.id);
                            setFlatModalVisible(true);
                        }} style={{margin: 5, width: 200}}>Открыть</Button>
                    </Flex>
                )
            }
        }
    ]
    // -----

    return(
        <Flex>
            {selectedFlatId &&
                <FlatModal date={props.selectedDate} flatId={selectedFlatId} visible={flatModalVisible} setVisible={setFlatModalVisible} />
            }
            <Table
                bordered={true}
                style={{width: '100vw'}}
                dataSource={props.flatsData}
                columns={columns}
                pagination={{
                    defaultPageSize: 200,
                }}
            />
        </Flex>
    )
}