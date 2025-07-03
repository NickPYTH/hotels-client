import React, {useEffect, useState} from 'react';
import {Flex, Input, Modal} from 'antd';
import {EventTypeModel} from "entities/EventTypeModel";
import {eventTypeAPI} from "service/EventTypeService";

type ModalProps = {
    selectedEventType: EventTypeModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
}
export const EventTypeModal = (props: ModalProps) => {

    // States
    const [name, setName] = useState<string>("");
    // -----

    // Web requests
    const [createEventType, {
        data: createdEventType,
        isLoading: isCreateEventTypeLoading
    }] = eventTypeAPI.useCreateMutation();
    const [updateEventType, {
        data: updatedEventType,
        isLoading: isUpdateEventTypeLoading
    }] = eventTypeAPI.useUpdateMutation();
    // -----

    // Effects
    useEffect(() => {
        if (props.selectedEventType) {
            setName(props.selectedEventType.name);
        }
    }, [props.selectedEventType]);
    useEffect(() => {
        if (createdEventType || updatedEventType) {
            props.setVisible(false);
            props.refresh();
        }
    }, [createdEventType, updatedEventType]);
    // -----

    // Handlers
    const confirmHandler = () => {
        if (name) {
            let eventTypeModel: EventTypeModel = {
                id: null,
                name
            };
            if (props.selectedEventType) updateEventType({...eventTypeModel, id: props.selectedEventType.id});
            else createEventType(eventTypeModel);
        }
    }
    // -----

    return (
        <Modal title={props.selectedEventType ? "Редактирование тип мероприятия" : "Создание типа мероприятия"}
               open={props.visible}
               loading={(isCreateEventTypeLoading || isUpdateEventTypeLoading)}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={props.selectedEventType ? "Сохранить" : "Создать"}
               width={'450px'}
        >
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Наимнование</div>
                    <Input value={name} onChange={(e) => setName(e.target.value)}/>
                </Flex>
            </Flex>
        </Modal>
    );
};
