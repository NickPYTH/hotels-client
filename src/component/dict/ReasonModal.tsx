import React, {useEffect, useState} from 'react';
import {Flex, Input, Modal, Switch} from 'antd';
import {ReasonModel} from "../../model/ReasonModel";
import {reasonAPI} from "../../service/ReasonService";

type ModalProps = {
    selectedReason: ReasonModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
}
export const ReasonModal = (props: ModalProps) => {

    // States
    const [name, setName] = useState<string>("");
    const [isDefault, setIsDefault] = useState<boolean>(false);
    // -----

    // Web requests
    const [createReason, {
        data: createdReason,
        isLoading: isCreateReasonLoading
    }] = reasonAPI.useCreateMutation();
    const [updateReason, {
        data: updatedReason,
        isLoading: isUpdateReasonLoading
    }] = reasonAPI.useUpdateMutation();
    // -----

    // Effects
    useEffect(() => {
        if (props.selectedReason) {
            setName(props.selectedReason.name);
            setIsDefault(props.selectedReason.isDefault);
        }
    }, [props.selectedReason]);
    useEffect(() => {
        if (createdReason || updatedReason) {
            props.setVisible(false);
            props.refresh();
        }
    }, [createdReason, updatedReason]);
    // -----

    // Handlers
    const confirmHandler = () => {
        if (name) {
            let reasonModel: ReasonModel = {
                isDefault,
                id: 0,
                name
            };
            if (props.selectedReason) updateReason({...reasonModel, id: props.selectedReason.id});
            else createReason(reasonModel);
        }
    }
    // -----

    return (
        <Modal title={props.selectedReason ? "Редактирование основания" : "Создание основания"}
               open={props.visible}
               loading={(isCreateReasonLoading || isUpdateReasonLoading)}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={props.selectedReason ? "Сохранить" : "Создать"}
               width={'450px'}
        >
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Наимнование</div>
                    <Input value={name} onChange={(e) => setName(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 122}}>По-умолчанию</div>
                    <Switch checked={isDefault} onChange={(e) => setIsDefault(e)}/>
                </Flex>
            </Flex>
        </Modal>
    );
};
