import React, {useEffect, useState} from 'react';
import {Button, Flex, message, Modal, Popconfirm, Switch, Tabs, Tag} from 'antd';
import {flatAPI} from "service/FlatService";
import {GuestModel} from "entities/GuestModel";
import {guestAPI} from "service/GuestService";
import {RoomModel} from "entities/RoomModel";
import TextArea from "antd/es/input/TextArea";
import {GuestModal} from "shared/component/GuestModal";
import {RootStateType} from "store/store";
import {useSelector} from 'react-redux';
import {Dayjs} from 'dayjs';
import {ConfirmCheckoutReport} from "shared/component/ConfirmCheckoutReportModal";
import {RoomLockModal} from "shared/component/RoomLockModal";
import {FlatLockModal} from "shared/component/FlatLockModal";
import {FlatLocksTimeLineModal} from "shared/component/FlatLocksTimeLineModal";
import {RoomLocksTimeLineModal} from 'shared/component/RoomLocksTimeLineModal';
import {GuestCard} from "shared/component/GuestCard";
import {ReservationCard} from 'shared/component/ReservationCard';
import {ReservationModal} from "shared/component/ReservationModal";
import {ReservationModel} from "entities/ReservationModel";

type ModalProps = {
    hotelId: string,
    flatId: number,
    visible: boolean,
    setVisible: Function,
    date: Dayjs
}

export const FlatModal = (props: ModalProps) => {

    // States
    const currentUser = useSelector((state: RootStateType) => state.currentUser.user);
    const [messageApi, messageContextHolder] = message.useMessage();
    const [visibleGuestModal, setVisibleGuestModal] = useState(false);
    const [visibleReservationModal, setVisibleReservationModal] = useState(false);
    const [visibleRoomLockModal, setVisibleRoomLockModal] = useState(false);
    const [visibleRoomLocksTimeLineModal, setVisibleRoomLocksTimeLineModal] = useState(false);
    const [visibleFlatLockModal, setVisibleFlatLockModal] = useState(false);
    const [visibleFlatLocksTimeLineModal, setVisibleFlatLocksTimeLineModal] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState<GuestModel | null>(null);
    const [selectedReservation, setSelectedReservation] = useState<ReservationModel | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<RoomModel | null>(null);
    const [note, setNote] = useState("");
    const [key, setKey] = useState(""); // room id
    const [bedId, setBedId] = useState<number | null>(null);
    const [confirmCheckoutReportVisible, setConfirmCheckoutReportVisible] = useState(false);
    const [isFilialUEZS] = useState(() => props.hotelId === '182' || props.hotelId === '183' || props.hotelId === '184' || props.hotelId === '327');
    const [isFilialVingapur, setIsFilialVingapur] = useState(() => props.hotelId === '186' || props.hotelId === '185');  // Исключения для создания доп. мест
    // -----


    // Web requests
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
    // -----

    // Effects
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
        if (deletedGuest) showSuccessMsg("Запись о проживании удалена");
    }, [checkouted, deletedGuest]);
    useEffect(() => {
        if (flat) {
            setNote(flat.note)
            if ((flat.rooms ? flat.rooms.length : 0) > 0)
                setKey(prev => {
                    if (prev === "" && flat.rooms) return flat.rooms[0].id.toString();
                    else return prev;
                })
        }
    }, [flat]);
    // -----

    // Useful utils
    const showWarningMsg = (msg: string) => {
        messageApi.warning(msg);
    };
    const showSuccessMsg = (msg: string) => {
        messageApi.success(msg);
    };
    // -----

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
                bedId={bedId ?? undefined}
                room={selectedRoom ?? undefined}
                showSuccessMsg={showSuccessMsg}
                isAddressDisabled={true}
                selectedGuest={selectedGuest}
                setSelectedGuest={setSelectedGuest}
                visible={visibleGuestModal}
                setVisible={setVisibleGuestModal}
                refresh={() => {
                    getFlat({flatId: props.flatId.toString(), date: props.date.format("DD-MM-YYYY HH:mm")});
                    setBedId(null);
                }}
            />}
            {visibleReservationModal &&
                <ReservationModal
                    bedId={bedId ?? undefined}
                    room={selectedRoom ?? undefined}
                    selectedReservation={selectedReservation}
                    visible={visibleReservationModal}
                    setVisible={setVisibleReservationModal}
                    refresh={() => {
                        getFlat({flatId: props.flatId.toString(), date: props.date.format("DD-MM-YYYY HH:mm")});
                        setSelectedReservation(null);
                        setBedId(null);
                        setSelectedRoom(null);
                    }}
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
                            <Tag style={{cursor: 'pointer'}}>{flat?.status?.name}</Tag>
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
                            onChange={() => {
                                if (flat) updateFlatTech(flat.id)
                            }}/>
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
                <Tabs style={{width: '100%'}} onChange={(k) => setKey(k)} activeKey={key} items={flat?.rooms?.map((room: RoomModel) => ({
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
                                    <Tag style={{cursor: 'pointer'}}>{room.status?.name}</Tag>
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
                                {room.guests?.map((guest: GuestModel) => {
                                    if (guest.isReservation) return (
                                        <ReservationCard
                                            setVisibleReservationModal={setVisibleReservationModal}
                                            reservation={guest}
                                            setSelectedReservation={setSelectedReservation}
                                            getFlat={() => getFlat({flatId: props.flatId.toString(), date: props.date.format("DD-MM-YYYY HH:mm")})}
                                        />
                                    )
                                    else return (
                                        <GuestCard
                                            guest={guest}
                                            isCheckoutLoading={isCheckoutLoading}
                                            isDeleteGuestLoading={isDeleteGuestLoading}
                                            setVisibleGuestModal={setVisibleGuestModal}
                                            setSelectedGuest={setSelectedGuest}
                                            setConfirmCheckoutReportVisible={setConfirmCheckoutReportVisible}
                                            checkout={checkout}
                                            currentUser={currentUser}
                                            deleteGuest={deleteGuest}
                                        />
                                    )
                                })}
                                {room.status?.id == 1 && flat.status?.id == 1 &&
                                ((room.guests ? room.guests.length : 0) < room.bedsCount) ?
                                    <Flex vertical={true} justify={'center'} align={'center'}>
                                        <Button disabled={currentUser.roleId === 4 || currentUser.roleId === 3} type={'primary'} style={{height: 50, width: 330}} onClick={() => {
                                            setSelectedRoom(room);
                                            setVisibleGuestModal(true);
                                            let availableBedNumber = null;
                                            room?.beds?.forEach((bed: { id: number }) => {
                                                let exist = false;
                                                room.guests?.forEach((guest: GuestModel) => {
                                                    if (guest.bed.id == bed.id) exist = true;
                                                });
                                                if (!exist) availableBedNumber = bed.id;
                                            });
                                            setBedId(availableBedNumber);
                                        }}>Добавить жильца</Button>
                                        {isFilialUEZS &&
                                            <Button disabled={currentUser.roleId === 4 || currentUser.roleId === 3}
                                                    type={'primary'}
                                                    style={{height: 50, width: 330, marginTop: 5}} onClick={() => {
                                                setSelectedRoom(room);
                                                setVisibleReservationModal(true);
                                                let availableBedNumber = null;
                                                room?.beds?.forEach((bed: { id: number }) => {
                                                    let exist = false;
                                                    room.guests?.forEach((guest: GuestModel) => {
                                                        if (guest.bed.id == bed.id) exist = true;
                                                    });
                                                    if (!exist) availableBedNumber = bed.id;
                                                });
                                                setBedId(availableBedNumber);
                                            }}>Добавить бронь</Button>
                                        }
                                    </Flex>
                                    : (isFilialUEZS || isFilialVingapur) ?
                                        <Flex vertical>
                                            <Flex vertical justify={'center'} align={'center'}>
                                                <Button disabled={currentUser.roleId === 4 || currentUser.roleId === 3}
                                                        type={'primary'}
                                                        style={{height: 50, width: 330, marginBottom: 5}} onClick={() => {
                                                    setSelectedRoom(room);
                                                    setVisibleGuestModal(true);
                                                }}>Заселить на дополнительное место</Button>
                                            </Flex>
                                            {isFilialUEZS &&
                                                <Flex vertical justify={'center'} align={'center'}>
                                                    <Button disabled={currentUser.roleId === 4 || currentUser.roleId === 3}
                                                            type={'primary'}
                                                            style={{height: 50, width: 330}} onClick={() => {
                                                        setSelectedRoom(room);
                                                        setVisibleReservationModal(true);
                                                    }}>Забронировать дополнительное место</Button>
                                                </Flex>
                                            }
                                        </Flex>
                                        :
                                        <></>
                                }
                            </Flex>
                        </Flex>,
                }))}/>
            </Flex>
        </Modal>
    );
};
