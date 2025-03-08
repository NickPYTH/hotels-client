import React, {useEffect, useState} from 'react';
import {DatePicker, Flex, Input, InputNumber, Modal, Select} from 'antd';
import {FilialModel} from "../../model/FilialModel";
import {filialAPI} from "../../service/FilialService";
import {EventModel} from "../../model/EventModel";
import {eventAPI} from "../../service/EventService";
import {EventTypeModel} from "../../model/EventTypeModel";
import dayjs, {Dayjs} from "dayjs";
import {hotelAPI} from "../../service/HotelService";
import {HotelModel} from "../../model/HotelModel";

const {RangePicker} = DatePicker;

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
    const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
    const [selectedFilialId, setSelectedFilialId] = useState<number | null>(null);
    const [dateRange, setDateRange] = useState<Dayjs[] | null>(null);
    const [manCount, setManCount] = useState<number>(0);
    const [womenCount, setWomenCount] = useState<number>(0);
    // -----

    // Web requests
    const [getAllFilials, {
        data: filials,
        isLoading: isFilialsLoading
    }] = filialAPI.useGetAllMutation();
    const [getAllHotels, {
        data: hotels,
        isLoading: isHotelsLoading
    }] = hotelAPI.useGetAllByFilialIdMutation();
    const [getTypes, {
        data: types,
        isLoading: isTypesLoading
    }] = eventAPI.useGetAllTypesMutation();
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
        getAllFilials();
    }, []);
    useEffect(() => {
        if (selectedFilialId) {
            getAllHotels({filialId: selectedFilialId.toString()});
        }
    }, [selectedFilialId]);
    useEffect(() => {
        if (props.selectedEvent) {
            setName(props.selectedEvent.name);
            setDescription(props.selectedEvent.description);
            setSelectedTypeId(props.selectedEvent.type.id);
            setSelectedFilialId(props.selectedEvent.hotel.filialId);
            setSelectedHotelId(props.selectedEvent.hotel.id);
            setDateRange([dayjs(props.selectedEvent.dateStart, "YYYY-MM-DD"), dayjs(props.selectedEvent.dateFinish, "YYYY-MM-DD")]);
            setManCount(props.selectedEvent.manCount);
            setWomenCount(props.selectedEvent.womenCount);
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
        let hotel: HotelModel | undefined = hotels?.find((hotel: HotelModel) => hotel.id === selectedHotelId);
        let dateStart: string | undefined = dateRange[0]?.format('DD-MM-YYYY');
        let dateFinish: string | undefined = dateRange[1]?.format('DD-MM-YYYY');
        if (name && eventType && hotel && dateStart && dateFinish) {
            let eventModel: EventModel = {
                dateFinish,
                dateStart,
                description,
                hotel,
                id: null,
                name,
                type: eventType,
                manCount,
                womenCount,
            }
            if (!props.selectedEvent) createEvent(eventModel);
            else updateEvent({...eventModel, id: props.selectedEvent.id});
        }
    }
    // -----
    return (
        <Modal title={props.selectedEvent ? "Редактирование мероприятия" : "Создание мероприятия"}
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
                <Flex align={"center"}>
                    <div style={{width: 200}}>Филиал</div>
                    <Select
                        loading={isFilialsLoading}
                        value={selectedFilialId}
                        placeholder={"Выберите филиал"}
                        style={{width: '100%'}}
                        onChange={(e) => setSelectedFilialId(e)}
                        options={filials?.map((filial: FilialModel) => ({value: filial.id, label: filial.name}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Общежитие</div>
                    <Select
                        loading={isHotelsLoading}
                        value={selectedHotelId}
                        placeholder={"Выберите общежитие"}
                        style={{width: '100%'}}
                        onChange={(e) => setSelectedHotelId(e)}
                        options={hotels?.map((hotel: HotelModel) => ({value: hotel.id, label: hotel.name}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Период проведения</div>
                    {/*//@ts-ignore*/}
                    <RangePicker showTime={false} showSecond={false} format={"DD-MM-YYYY"} value={dateRange} onChange={(e) => {
                        setDateRange(e as any)
                    }} style={{width: '100%'}}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Колличество мужчин</div>
                    <InputNumber min={0} style={{width: '100%'}} value={manCount} onChange={(e) => {
                        if (e != null) setManCount(e);
                    }}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Колличество женщин</div>
                    <InputNumber min={0} style={{width: '100%'}} value={womenCount} onChange={(e) => {
                        if (e != null) setWomenCount(e);
                    }}/>
                </Flex>
            </Flex>
        </Modal>
    );
};
