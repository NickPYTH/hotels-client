import React, {useEffect, useState} from 'react';
import {Flex, Input, Modal, Select} from 'antd';
import {EventModel} from "../../model/EventModel";
import {eventAPI} from "../../service/EventService";
import {EventTypeModel} from "../../model/EventTypeModel";
import {eventTypeAPI} from "../../service/EventTypeService";


type ModalProps = {
    selectedEvent: EventModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
}

export const EventModal = (props: ModalProps) => {

    // States
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
    // -----

    // Web requests
    const [getTypes, {
        data: types,
        isLoading: isTypesLoading
    }] = eventTypeAPI.useGetAllMutation();
    const [createEvent, {
        data: createdEvent,
        isLoading: isCreateEventLoading
    }] = eventAPI.useCreateMutation();
    const [updateEvent, {
        data: updatedEvent,
        isLoading: isUpdateEventLoading
    }] = eventAPI.useUpdateMutation();
    // -----

    // Effects
    useEffect(() => {
        getTypes();
    }, []);
    useEffect(() => {
        if (props.selectedEvent) {
            setName(props.selectedEvent.name);
            setDescription(props.selectedEvent.description);
            setSelectedTypeId(props.selectedEvent.type.id);
        }
    }, [props.selectedEvent])
    useEffect(() => {
        if (createdEvent || updatedEvent) {
            props.setVisible(false);
            props.refresh();
        }
    }, [createdEvent, updatedEvent]);
    // -----

    // Handlers
    const confirmHandler = () => {
        let eventType: EventTypeModel | undefined = types?.find((type: EventTypeModel) => type.id === selectedTypeId);
        if (name && eventType) {
            let eventModel: EventModel = {
                description,
                id: null,
                name,
                type: eventType,
            }
            if (!props.selectedEvent) createEvent(eventModel);
            else updateEvent({...eventModel, id: props.selectedEvent.id});
        }
    }
    // -----
    return (
        <Modal title={props.selectedEvent ? "Редактирование вида мероприятия" : "Создание вида мероприятия"}
               open={props.visible}
               loading={(isCreateEventLoading || isUpdateEventLoading)}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={props.selectedEvent ? "Сохранить" : "Создать"}
               width={'670px'}
        >
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Наименование</div>
                    <Input value={name} onChange={(e) => setName(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Описание</div>
                    <Input value={description} onChange={(e) => setDescription(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Тип мероприятия</div>
                    <Select
                        loading={isTypesLoading}
                        value={selectedTypeId}
                        placeholder={"Выберите тип"}
                        style={{width: '100%'}}
                        onChange={(e) => setSelectedTypeId(e)}
                        options={types?.map((type: EventTypeModel) => ({value: type.id, label: type.name}))}
                    />
                </Flex>
            </Flex>
        </Modal>
    );
};
