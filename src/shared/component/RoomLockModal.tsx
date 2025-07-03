import React, {useEffect, useState} from 'react';
import {DatePicker, Flex, Modal, Select} from 'antd';
import {roomLocksAPI} from "service/RoomLocksService";
import {RoomModel} from "entities/RoomModel";
import {roomStatuses} from "shared/config/constants";
import dayjs, {Dayjs} from 'dayjs';
import {RoomLocksModel} from "entities/RoomLocksModel";

const {RangePicker} = DatePicker;

type ModalProps = {
    room: RoomModel
    visible: boolean,
    setVisible: Function,
    refresh: Function,
    showWarningMsg: Function,
}
export const RoomLockModal = (props: ModalProps) => {
    const [statusId, setStatusId] = useState<number>(1);
    const [dateRange, setDateRange] = useState<Dayjs[] | null>(null);
    const [getLock, {
        data: roomLock,
        isLoading: isGetLoading
    }] = roomLocksAPI.useGetMutation();
    const [createLock, {
        data: createdLock,
        isLoading: isCreateLoading
    }] = roomLocksAPI.useCreateMutation();
    const [updateLock, {
        data: updatedLock,
        isLoading: isUpdateLoading
    }] = roomLocksAPI.useUpdateMutation();
    useEffect(() => {
        if (props.room.roomLockId) getLock(props.room.roomLockId);
    }, []);
    useEffect(() => {
        if (roomLock) {
            setDateRange([dayjs(roomLock.dateStart, "DD-MM-YYYY"), dayjs(roomLock.dateFinish, "DD-MM-YYYY")]);
            setStatusId(roomLock.statusId);
        }
    }, [roomLock]);
    useEffect(() => {
        if (updatedLock) {
            if (updatedLock.error) {
                window.alert("Ошибка, периоды пересекаются, зайдите в таймлайн для уточнения");
            }
            props.refresh();
            props.setVisible(false);
        }
    }, [updatedLock]);
    useEffect(() => {
        if (createdLock) {
            if (createdLock.error) {
                window.alert("Ошибка, периоды пересекаются, зайдите в таймлайн для уточнения");
            }
            props.refresh();
            props.setVisible(false);
        }
    }, [createdLock]);
    const confirmHandler = () => {
        if (props.room.roomLockId) {
            if (statusId && dateRange) {
                let dateStart = dateRange[0].format('DD-MM-YYYY');
                let dateFinish = dateRange[1].format('DD-MM-YYYY');
                let roomLockModel: RoomLocksModel = {
                    dateFinish,
                    dateStart,
                    id: props.room.roomLockId,
                    roomId: props.room.id,
                    statusId
                }
                updateLock(roomLockModel);
            }
        } else {
            if (statusId && dateRange && statusId !== 1) {
                let dateStart = dateRange[0].format('DD-MM-YYYY');
                let dateFinish = dateRange[1].format('DD-MM-YYYY');
                let roomLockModel: RoomLocksModel = {
                    dateFinish,
                    dateStart,
                    id: 999,
                    roomId: props.room.id,
                    statusId
                }
                createLock(roomLockModel);
            }
        }
    }
    return (
        <Modal title={`Редактирование статуса комнаты номер ${props.room.name}`}
               open={props.visible}
               loading={(isCreateLoading || isUpdateLoading || isGetLoading)}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={"Сохранить"}
               width={'450px'}
        >
            <Flex gap={'small'} vertical={true}>
                <Flex justify={'space-between'} align={'center'}>
                    Статус комнаты
                    <Select
                        style={{width: 280, marginLeft: 10}}
                        value={statusId}
                        placeholder={"Выберите статус"}
                        onChange={(e) => setStatusId(e)}
                        options={roomStatuses.map((status: any) => ({value: status.id, label: status.name}))}
                    />
                </Flex>
                <Flex justify={'space-between'} align={'center'}>
                    Период действия
                    {/*//@ts-ignore*/}
                    <RangePicker showTime={false} showSecond={false} format={"DD-MM-YYYY"} value={dateRange} onChange={(e) => {
                        setDateRange(e as any)
                    }} style={{width: 280}}/>
                </Flex>
            </Flex>
        </Modal>
    );
};
