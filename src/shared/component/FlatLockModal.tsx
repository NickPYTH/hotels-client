import React, {useEffect, useState} from 'react';
import {DatePicker, Flex, Modal, Select} from 'antd';
import {flatStatuses} from "shared/config/constants";
import dayjs, {Dayjs} from 'dayjs';
import {FlatModel} from "entities/FlatModel";
import {flatLocksAPI} from "service/FlatLocksService";
import {FlatLocksModel} from "entities/FlatLocksModel";

const {RangePicker} = DatePicker;

type ModalProps = {
    flat: FlatModel
    visible: boolean,
    setVisible: Function,
    refresh: Function,
    showWarningMsg: Function,
}
export const FlatLockModal = (props: ModalProps) => {
    const [statusId, setStatusId] = useState<number>(1);
    const [dateRange, setDateRange] = useState<Dayjs[] | null>(null);
    const [getLock, {
        data: flatLock,
        isLoading: isGetLoading
    }] = flatLocksAPI.useGetMutation();
    const [createLock, {
        data: createdLock,
        isLoading: isCreateLoading
    }] = flatLocksAPI.useCreateMutation();
    const [updateLock, {
        data: updatedLock,
        isLoading: isUpdateLoading
    }] = flatLocksAPI.useUpdateMutation();
    useEffect(() => {
        if (props.flat.flatLockId) getLock(props.flat.flatLockId);
    }, []);
    useEffect(() => {
        if (flatLock) {
            setDateRange([dayjs(flatLock.dateStart, "DD-MM-YYYY"), dayjs(flatLock.dateFinish, "DD-MM-YYYY")]);
            setStatusId(flatLock.statusId);
        }
    }, [flatLock]);
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
        if (props.flat.flatLockId) {
            if (statusId && dateRange) {
                let dateStart = dateRange[0].format('DD-MM-YYYY');
                let dateFinish = dateRange[1].format('DD-MM-YYYY');
                let flatLockModel: FlatLocksModel = {
                    dateFinish,
                    dateStart,
                    id: props.flat.flatLockId,
                    flatId: props.flat.id,
                    statusId
                }
                updateLock(flatLockModel);
            }
        } else {
            if (statusId && dateRange && statusId !== 1) {
                let dateStart = dateRange[0].format('DD-MM-YYYY');
                let dateFinish = dateRange[1].format('DD-MM-YYYY');
                let flatLockModel: FlatLocksModel = {
                    dateFinish,
                    dateStart,
                    id: 999,
                    flatId: props.flat.id,
                    statusId
                }
                createLock(flatLockModel);
            }
        }
    }
    return (
        <Modal title={`Редактирование статуса секции номер ${props.flat.name}`}
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
                        options={flatStatuses.map((status: any) => ({value: status.id, label: status.name}))}
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
