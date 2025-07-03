import React, {useEffect, useState} from 'react';
import {DatePicker, Flex, Modal, Select} from 'antd';
import {eventKindAPI} from "service/EventKindService";
import {EventTypeModel} from "entities/EventTypeModel";
import {EventModel} from "entities/EventModel";
import {eventAPI} from "service/EventService";
import {EventKindModel} from "entities/EventKindModel";
import dayjs, {Dayjs} from "dayjs";
import {FilialModel} from "entities/FilialModel";
import {HotelModel} from "entities/HotelModel";
import {filialAPI} from "service/FilialService";
import {hotelAPI} from "service/HotelService";


type ModalProps = {
    selectedEvent: EventModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
}

export const EventModal = (props: ModalProps) => {

    // States
    const [selectedEventKind, setSelectedEventKind] = useState<EventKindModel | null>(null);
    const [selectedFilialId, setSelectedFilialId] = useState<number | null>(null);
    const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
    const [dateStart, setDateStart] = useState<Dayjs | null>(null);
    const [dateFinish, setDateFinish] = useState<Dayjs | null>(null);
    // -----

    // Web requests
    const [getKinds, {
        data: kinds,
        isLoading: isKindsLoading
    }] = eventKindAPI.useGetAllMutation();
    const [createEvent, {
        data: createdEvent,
        isLoading: isCreateEventLoading
    }] = eventAPI.useCreateMutation();
    const [updateEvent, {
        data: updatedEvent,
        isLoading: isUpdateEventLoading
    }] = eventAPI.useUpdateMutation();
    const [getAllFilials, {
        data: filials,
    }] = filialAPI.useGetAllMutation();
    const [getHotels, {
        data: hotels,
    }] = hotelAPI.useGetAllByFilialIdMutation();
    // -----

    // Effects
    useEffect(() => {
        getKinds();
        getAllFilials();
    }, []);
    useEffect(() => {
        if (selectedFilialId) getHotels({filialId: selectedFilialId.toString()});
    }, [selectedFilialId]);
    useEffect(() => {
        if (props.selectedEvent) {
            setSelectedEventKind(props.selectedEvent.kind);
            setSelectedFilialId(props.selectedEvent.hotel.filial.id);
            setSelectedHotelId(props.selectedEvent.hotel.id);
            setDateStart(dayjs(props.selectedEvent.dateStart));
            setDateFinish(dayjs(props.selectedEvent.dateFinish));
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
        let hotel: HotelModel | undefined = hotels?.find((h: HotelModel) => h.id == selectedHotelId);
        if (selectedEventKind && hotel && dateStart && dateFinish) {
            let eventModel: EventModel = {
                id: null,
                kind: selectedEventKind,
                hotel,
                dateStart: dateStart.unix(),
                dateFinish: dateFinish.unix()
            }
            if (!props.selectedEvent) createEvent(eventModel);
            else updateEvent({...eventModel, id: props.selectedEvent.id});
        }
    }
    const selectEventKindHandler = (id: number) => {
        if (kinds) {
            let kind: EventKindModel | undefined = kinds.find((kind: EventKindModel) => kind.id === id);
            if (kind) setSelectedEventKind(kind);
            else setSelectedEventKind(null);
        } else setSelectedEventKind(null);
    }
    // -----
    return (
        <Modal title={props.selectedEvent ? "Редактирование мероприятия" : "Создание мероприятия"}
               open={props.visible}
               loading={(isCreateEventLoading || isUpdateEventLoading)}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={props.selectedEvent ? "Сохранить" : "Создать"}
               width={'600px'}
        >
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Вид мероприятия</div>
                    <Select
                        loading={isKindsLoading}
                        value={selectedEventKind ? selectedEventKind.id : null}
                        placeholder={"Выберите тип"}
                        style={{width: '100%'}}
                        onChange={selectEventKindHandler}
                        options={kinds?.map((type: EventTypeModel) => ({value: type.id, label: type.name}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Выберите филиал</div>
                    <Select
                        style={{width: "100%"}}
                        value={selectedFilialId}
                        placeholder={"Выберите филиал"}
                        onChange={(e) => setSelectedFilialId(e)}
                        options={filials?.filter((filial: FilialModel) => !filial.excluded).map((filial: FilialModel) => ({value: filial.id, label: filial.name}))}
                        allowClear={true}
                        showSearch
                        filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Выберите общежитие</div>
                    <Select
                        style={{width: '100%'}}
                        value={selectedHotelId}
                        placeholder={"Выберите общежитие"}
                        onChange={(e) => setSelectedHotelId(e)}
                        options={hotels?.map((hotel: HotelModel) => ({value: hotel.id, label: hotel.name}))}
                        allowClear={true}
                        showSearch
                        filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Дата начала</div>
                    <DatePicker placeholder={'Дата начала'} format={'DD.MM.YYYY'} style={{width: '100%'}} value={dateStart} onChange={setDateStart} allowClear={false}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Дата окончания</div>
                    <DatePicker placeholder={'Дата окончания'} format={'DD.MM.YYYY'} style={{width: '100%'}} value={dateFinish} onChange={setDateFinish} allowClear={false}/>
                </Flex>
            </Flex>
        </Modal>
    );
};
