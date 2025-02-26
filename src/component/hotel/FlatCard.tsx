import {Badge, Button, Card, Flex, Popconfirm, Tooltip} from "antd";
import React, {useState} from "react";
import {FlatModel} from "../../model/FlatModel";
import {ClockCircleOutlined, HomeOutlined, LockOutlined, StarFilled} from "@ant-design/icons";
import "./style.scss";
import {RoomModel} from "../../model/RoomModel";
import {GuestModel} from "../../model/GuestModel";
//@ts-ignore
import Male from "../../assets/male.png";
//@ts-ignore
import Female from "../../assets/female.png";
//@ts-ignore
import ConfirmedReservation from "../../assets/confirmedReservation.png";
import dayjs, {Dayjs} from "dayjs";
import {GuestModal} from "../dict/GuestModal";

type CardProps = {
    flat: FlatModel,
    setVisible: Function,
    setSelectedFlatId: Function,
    selectedDate: Dayjs
}

export const FlatCard = ({flat, setVisible, setSelectedFlatId, selectedDate}: CardProps) => {
    const [spin, setSpin] = useState(false);
    const [visibleGuestModal, setVisibleGuestModal] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState<GuestModel | null>(null);
    return (
        <Card style={{minWidth: 300, margin: 8, marginRight: 28, boxShadow: "0px 0px 5px 3px rgba(34, 60, 80, 0.2)"}} onMouseEnter={() => setSpin(true)} onMouseLeave={() => setSpin(false)}>
            {flat.categoryId === 2 && <StarFilled spin={spin} style={{position: 'absolute', top: 10, right: 10, boxShadow: "0px 0px 5px 3px rgba(34, 60, 80, 0.2)"}}/>}
            {(flat.statusId == 2 || flat.statusId == 4) &&
                <Tooltip title={flat.statusId == 2 ? "Секция закрыта от заселения" : "Секция выкуплена организацией"}>
                    {flat.statusId == 2 ?
                        <LockOutlined style={{color: '#d9534f', position: 'absolute', top: 10, left: 7}}/>
                        :
                        <HomeOutlined style={{color: '#f0ad4e', position: 'absolute', top: 26, left: 7}}/>
                    }
                </Tooltip>
            }
            {flat.rooms.map((room: RoomModel, i: number) => {
                return (
                    <div style={{
                        position: 'absolute',
                        padding: 5,
                        paddingRight: 8,
                        borderRadius: 4,
                        top: 10 + (45 * i),
                        right: 10,
                        width: 100,
                        height: 25,
                        boxShadow: "0px 0px 5px 1px rgba(34, 60, 80, 0.2) inset"
                    }}>
                        {(visibleGuestModal && selectedGuest) && <GuestModal
                            showSuccessMsg={() => {}}
                            isAddressDisabled={true}
                            selectedGuest={selectedGuest}
                            visible={visibleGuestModal}
                            setVisible={setVisibleGuestModal}
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
                                let daysBeforeCheckouted = dayjs(guest.dateFinish, "DD-MM-YYYY HH:mm").diff(selectedDate, 'days');
                                return (
                                    <Popconfirm cancelText={"Закрыть"} okText={"Открыть"}
                                                onConfirm={() => {
                                                    setVisibleGuestModal(true);
                                                    setSelectedGuest(guest);
                                                }}
                                                title={`${guest.lastname} ${guest.firstname[0]}. ${guest.secondName[0]}. ${guest.post ?? ""} ${guest.organization ?? ""}`}
                                                description={
                                                guest.isReservation ?
                                                    `Бронирование с ${guest.dateStart} по ${guest.dateFinish}.`
                                                    :
                                                    `Даты проживания с ${guest.dateStart} по ${guest.dateFinish}. До выселения(суток): ${daysBeforeCheckouted == 0 ? "Сегодня" : daysBeforeCheckouted}`
                                                    }>
                                        {guest.isReservation ?
                                            <img style={{marginTop: 2}} width={22} height={22} src={ConfirmedReservation}/>
                                            :
                                            daysBeforeCheckouted < 2 ?
                                                <Badge count={<ClockCircleOutlined style={{color: '#f5222d'}}/>}>
                                                    {
                                                        guest.male ?
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
            <Card.Meta
                title={`${flat.name} ${flat.category === "ВИП" ? " - " + flat.category : ""} ${flat.tech ? " - Тех. помещение" : ""}`}
                description={
                    <div style={{margin: 5}}>
                        <div>
                            Количество комнат {flat.roomsCount}
                        </div>
                        <div>
                            Количество мест {flat.bedsCount}
                        </div>
                        <div>
                            Свободных мест {flat.emptyBedsCount}
                        </div>
                        <div>
                            Этаж {flat.floor}
                        </div>
                        <Button type={'primary'} style={{marginTop: 10, width: 118}} onClick={() => {
                            setVisible(true);
                            setSelectedFlatId(flat.id);
                        }}>Открыть</Button>
                    </div>
                }
            />
        </Card>
    )
}