import React, {useEffect} from 'react';
import {Empty, Flex, Modal, Steps} from 'antd';
import {FlatModel} from "../../model/FlatModel";
import {flatLocksAPI} from "../../service/FlatLocksService";
import {FlatLocksModel} from "../../model/FlatLocksModel";
import {flatStatuses} from "../../config/constants";

type ModalProps = {
    flat: FlatModel
    visible: boolean,
    setVisible: Function,
}
export const FlatLocksTimeLineModal = (props: ModalProps) => {
    const [getFlatLocks, {
        data: flatLocks,
        isLoading: isFlatLocksLoading,
    }] = flatLocksAPI.useGetAllMutation();
    useEffect(() => {
        getFlatLocks(props.flat.id);
    }, []);
    return (
        <Modal title={`Таймлайн статусов секции номер ${props.flat.name}`}
               open={props.visible}
               onCancel={() => props.setVisible(false)}
               okText={"Сохранить"}
               width={'450px'}
               loading={isFlatLocksLoading}
               footer={() => {
               }}>
            <Flex gap={'small'} vertical={true}>
                {flatLocks?.length ?
                    <Steps
                        direction={'vertical'}
                        items={flatLocks?.map((flatLock: FlatLocksModel) =>
                            ({title: `${flatStatuses.find((fs: any) => fs.id == flatLock.statusId)?.name}`, description: `С ${flatLock.dateStart} по ${flatLock.dateFinish}`}))}
                    />
                    :
                    <Empty/>
                }
            </Flex>
        </Modal>
    );
};
