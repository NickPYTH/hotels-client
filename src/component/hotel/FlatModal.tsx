import React, {useEffect, useState} from 'react';
import {Button, Card, Flex, message, Modal, Popconfirm, Switch, Tabs, Tag} from 'antd';
import {flatAPI} from "../../service/FlatService";
import {GuestModel} from "../../model/GuestModel";
import {guestAPI} from "../../service/GuestService";
import {RoomModel} from "../../model/RoomModel";
import TextArea from "antd/es/input/TextArea";
import {GuestModal} from "../dict/GuestModal";
import {RootStateType} from "../../store/store";
import {useSelector} from 'react-redux';
import {Dayjs} from 'dayjs';
import {ConfirmCheckoutReport} from "./ConfirmCheckoutReportModal";
import {RoomLockModal} from "./RoomLockModal";
import {FlatLockModal} from "./FlatLockModal";
import {FlatLocksTimeLineModal} from "./FlatLocksTimeLineModal";
import {RoomLocksTimeLineModal} from './RoomLocksTimeLineModal';

type ModalProps = {
    flatId: number,
    visible: boolean,
    setVisible: Function,
    date: Dayjs
}

export const FlatModal = (props: ModalProps) => {
    const currentUser = useSelector((state: RootStateType) => state.currentUser.user);
    const [messageApi, messageContextHolder] = message.useMessage();
    const [visibleGuestModal, setVisibleGuestModal] = useState(false);
    const [visibleRoomLockModal, setVisibleRoomLockModal] = useState(false);
    const [visibleRoomLocksTimeLineModal, setVisibleRoomLocksTimeLineModal] = useState(false);
    const [visibleFlatLockModal, setVisibleFlatLockModal] = useState(false);
    const [visibleFlatLocksTimeLineModal, setVisibleFlatLocksTimeLineModal] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState<GuestModel | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<RoomModel | null>(null);
    const [note, setNote] = useState("");
    const [key, setKey] = useState(""); // room id
    const [bedId, setBedId] = useState<number | null>(null);
    const [confirmCheckoutReportVisible, setConfirmCheckoutReportVisible] = useState(false);
    const [getFlat, {
        data: flat,
        isLoading: isFlatLoading
    }] = flatAPI.useGetMutation();
    const [updateNote, {
        isLoading: isNoteUpdateLoading
    }] = flatAPI.useUpdateNoteMutation();
    const [checkout, {
        data: checkouted,
        isLoading: isCheckoutLoading
    }] = guestAPI.useCheckoutMutation();
    const [deleteGuest, {
        data: deletedGuest,
        isLoading: isDeleteGuestLoading
    }] = guestAPI.useDeleteMutation();
    const [updateFlatTech, {
        data: updatedFlatTech,
        isLoading: isUpdateFlatTechLoading
    }] = flatAPI.useUpdateTechMutation();
    useEffect(() => {
        if (updatedFlatTech) getFlat({flatId: props.flatId.toString(), date: props.date.format("DD-MM-YYYY HH:mm")});
    }, [updatedFlatTech]);
    useEffect(() => {
        getFlat({flatId: props.flatId.toString(), date: props.date.format("DD-MM-YYYY HH:mm")});
    }, []);
    useEffect(() => {
        if (!visibleGuestModal) setSelectedRoom(null);
    }, [visibleGuestModal]);
    useEffect(() => {
        if (checkouted || deletedGuest) getFlat({flatId: props.flatId.toString(), date: props.date.format("DD-MM-YYYY HH:mm")});
        if (deleteGuest) showSuccessMsg("Запись о проживании удалена");
    }, [checkouted, deletedGuest]);
    useEffect(() => {
        if (flat) {
            setNote(flat.note)
            if (flat.rooms.length > 0)
                setKey(prev => {
                    if (prev === "") return flat.rooms[0].id.toString();
                    else return prev;
                })
        }
    }, [flat]);
    const showWarningMsg = (msg: string) => {
        messageApi.warning(msg);
    };
    const showSuccessMsg = (msg: string) => {
        messageApi.success(msg);
    };

    return (
        <Modal title={`${flat?.name}`}
               loading={isFlatLoading || isUpdateFlatTechLoading}
               open={props.visible}
               onCancel={() => props.setVisible(false)}
               footer={<></>}
               width={'1100px'}
               maskClosable={false}
        >
            {messageContextHolder}
            {(visibleRoomLocksTimeLineModal && selectedRoom) && <RoomLocksTimeLineModal room={selectedRoom} visible={visibleRoomLocksTimeLineModal} setVisible={setVisibleRoomLocksTimeLineModal}/>}
            {(visibleFlatLocksTimeLineModal && flat) && <FlatLocksTimeLineModal flat={flat} visible={visibleFlatLocksTimeLineModal} setVisible={setVisibleFlatLocksTimeLineModal}/>}
            {(visibleFlatLockModal && flat) &&
                <FlatLockModal showWarningMsg={showWarningMsg} refresh={() => getFlat({flatId: props.flatId.toString(), date: props.date.format("DD-MM-YYYY HH:mm")})} flat={flat}
                               visible={visibleFlatLockModal} setVisible={setVisibleFlatLockModal}/>}
            {(visibleRoomLockModal && selectedRoom) &&
                <RoomLockModal showWarningMsg={showWarningMsg} refresh={() => getFlat({flatId: props.flatId.toString(), date: props.date.format("DD-MM-YYYY HH:mm")})} room={selectedRoom}
                               visible={visibleRoomLockModal} setVisible={setVisibleRoomLockModal}/>}
            {visibleGuestModal && <GuestModal
                flatName={flat?.name}
                bedId={bedId}
                room={selectedRoom}
                showSuccessMsg={showSuccessMsg}
                isAddressDisabled={true}
                selectedGuest={selectedGuest}
                setSelectedGuest={setSelectedGuest}
                visible={visibleGuestModal}
                setVisible={setVisibleGuestModal}
                refresh={() => getFlat({flatId: props.flatId.toString(), date: props.date.format("DD-MM-YYYY HH:mm")})}
                />}
            <Flex style={{marginTop: 10}}>
                <Flex vertical>
                    <Flex style={{marginBottom: 10}} align={'center'}>
                        <div style={{width: 110}}>
                            Статус секции
                        </div>
                        <Popconfirm
                            title={"Что вы хотите сделать?"}
                            okText={"Изменить статус"}
                            cancelText={"Открыть таймлайн статусов"}
                            onConfirm={() => setVisibleFlatLockModal(true)}
                            onCancel={() => setVisibleFlatLocksTimeLineModal(true)}
                        >
                            <Tag style={{cursor: 'pointer'}}>{flat?.status}</Tag>
                        </Popconfirm>
                    </Flex>
                    <Flex align={'center'}>
                        <div style={{width: 110}}>
                            Тех. помещение
                        </div>
                        <Switch
                            disabled={currentUser.roleId === 4 || currentUser.roleId === 3}
                            checkedChildren="Да" unCheckedChildren="нет"
                            defaultChecked={flat?.tech}
                            onChange={() => {if (flat) updateFlatTech(flat.id)}}/>
                    </Flex>
                </Flex>
            </Flex>
            <Flex align={'center'} gap={'small'} style={{marginTop: 10}}>
                <div style={{width: 130}}>
                    Примечание к помещению
                </div>
                <TextArea onChange={(e) => setNote(e.target.value)} value={note}/>
                <Button type={'primary'} disabled={isNoteUpdateLoading || currentUser.roleId === 4 || currentUser.roleId === 3} onClick={() => {
                    if (flat) updateNote({...flat, note})
                }}>Сохранить</Button>
            </Flex>
            <Flex gap={'small'} style={{width: '100%'}} align={'center'} wrap={true}>
                <Tabs style={{width: '100%'}} onChange={(k) => setKey(k)} activeKey={key} items={flat?.rooms.map((room: RoomModel) => ({
                    key: room.id.toString(),
                    label: `Комната ${room.name}`,
                    children:
                        <Flex vertical={true} gap={'small'}>
                            <Flex align={'center'}>
                                <div style={{width: 110}}>
                                    Статус комнаты
                                </div>
                                <Popconfirm
                                    title={"Что вы хотите сделать?"}
                                    okText={"Изменить статус"}
                                    cancelText={"Открыть таймлайн статусов"}
                                    onConfirm={() => {
                                        setSelectedRoom(room);
                                        setVisibleRoomLockModal(true);
                                    }}
                                    onCancel={() => {
                                        setSelectedRoom(room);
                                        setVisibleRoomLocksTimeLineModal(true);
                                    }}
                                >
                                    <Tag style={{cursor: 'pointer'}}>{room.statusName}</Tag>
                                </Popconfirm>
                            </Flex>
                            <Flex>
                                Всего мест в комнате {room.bedsCount}
                            </Flex>
                            {(confirmCheckoutReportVisible && selectedGuest) && <ConfirmCheckoutReport
                                visible={confirmCheckoutReportVisible}
                                setVisible={setConfirmCheckoutReportVisible}
                                showWarningMsg={showWarningMsg}
                                guest={selectedGuest}
                                roomName={room.name}
                            />}
                            <Flex vertical={false} justify={'center'} align={'center'} gap={'small'} wrap={'wrap'}>
                                {room.guests.map((guest: GuestModel) => {
                                    return (
                                        <Card loading={isCheckoutLoading || isDeleteGuestLoading} title={`${guest.lastname} ${guest.firstname[0]}. ${guest.secondName[0]}.`}
                                              bordered={true}
                                              style={{width: 340}}>
                                            <div>
                                                Филиал: {guest?.filialEmployee}
                                            </div>
                                            <div>
                                                Должность: {guest?.post}
                                            </div>
                                            <div>
                                                № договора: {guest?.note}
                                            </div>
                                            <div>
                                                Общая стоимость проживания: {guest?.cost}
                                            </div>
                                            <div>
                                                Стоимость проживания за ночь: {guest?.costByNight}
                                            </div>
                                            <div>
                                                Количество ночей: {guest?.daysCount}
                                            </div>
                                            <div>
                                                Дата заселения: {guest?.dateStart}
                                            </div>
                                            <div>
                                                Дата выселения: {guest?.dateFinish}
                                            </div>
                                            <div>
                                                Место: {guest?.bedName}
                                            </div>
                                            <Button style={{marginTop: 5, width: 280}} onClick={() => {
                                                setVisibleGuestModal(true);
                                                setSelectedGuest(guest);
                                            }}>Карточка жильца</Button>
                                            <Button style={{marginTop: 5, width: 280}} onClick={() => {
                                                setConfirmCheckoutReportVisible(true);
                                                setSelectedGuest(guest);
                                            }}>Отчетный документ</Button>
                                            {
                                                guest?.checkouted ?
                                                    <div style={{width: 280}}>
                                                        <Flex justify={'center'}>
                                                            <strong>Выселен</strong>
                                                        </Flex>
                                                    </div>
                                                    :
                                                    <Popconfirm title={"Вы уверены?"} okText={"Да"} onConfirm={() => {
                                                        checkout(guest.id);
                                                    }}>
                                                        <Button disabled={currentUser.roleId === 4 || currentUser.roleId === 3} style={{marginTop: 5, width: 280}} danger>Выселить</Button>
                                                    </Popconfirm>
                                            }
                                            <Popconfirm title={"Вы точно хотите удалить запись о проживани?"} okText={"Да"} onConfirm={() => {
                                                deleteGuest(guest.id);
                                            }}>
                                                <Button disabled={currentUser.roleId === 4 || currentUser.roleId === 3} style={{marginTop: 5, width: 280}} danger>Удалить запись о проживании</Button>
                                            </Popconfirm>
                                        </Card>
                                    )
                                })}
                                {(room.guests.length < room.bedsCount) && room.statusId == 1 &&
                                    <Button disabled={currentUser.roleId === 4 || currentUser.roleId === 3} type={'primary'} style={{height: 50, width: 330}} onClick={() => {
                                        setSelectedRoom(room);
                                        setVisibleGuestModal(true);
                                            let availableBedNumber = null;
                                            room?.beds.forEach((bed:{id:number}) => {
                                                let exist = false;
                                                room.guests.forEach((guest: GuestModel) => {
                                                    if (guest.bedId === bed.id) exist = true;
                                                });
                                                if (!exist) availableBedNumber = bed.id;
                                            });
                                        setBedId(availableBedNumber);
                                    }}>Добавить жильца</Button>
                                }
                            </Flex>
                        </Flex>,
                }))}/>
            </Flex>
        </Modal>
    );
};
