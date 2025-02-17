import React, {useEffect} from 'react';
import {Empty, Flex, Modal, Steps} from 'antd';
import {roomStatuses} from "../../config/constants";
import {roomLocksAPI} from "../../service/RoomLocksService";
import {RoomModel} from "../../model/RoomModel";
import {RoomLocksModel} from "../../model/RoomLocksModel";

type ModalProps = {
    room: RoomModel
    visible: boolean,
    setVisible: Function,
}
export const RoomLocksTimeLineModal = (props: ModalProps) => {
    const [getRoomLocks, {
        data: roomLocks,
        isLoading: isRoomLocksLoading,
    }] = roomLocksAPI.useGetAllMutation();
    useEffect(() => {
        getRoomLocks(props.room.id);
    }, []);
    return (
        <Modal title={`Таймлайн статусов комнаты номер ${props.room.name}`}
               open={props.visible}
               onCancel={() => props.setVisible(false)}
               okText={"Сохранить"}
               width={'450px'}
               loading={isRoomLocksLoading}
               footer={() => {
               }}>
            <Flex gap={'small'} vertical={true}>
                {roomLocks?.length ?
                    <Steps
                        direction={'vertical'}
                        items={roomLocks?.map((roomLockModel: RoomLocksModel) =>
                            ({title: `${roomStatuses.find((fs: any) => fs.id == roomLockModel.statusId)?.name}`, description: `С ${roomLockModel.dateStart} по ${roomLockModel.dateFinish}`}))}
                    />
                    :
                    <Empty/>
                }
            </Flex>
        </Modal>
    );
};
