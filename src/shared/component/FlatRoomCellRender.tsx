import React, {useEffect, useState} from "react";
import {Flex, Select} from "antd";
import {FlatModel} from "entities/FlatModel";
import {RoomModel} from "entities/RoomModel";
import {roomAPI} from "service/RoomService";
import {BedModel} from "entities/BedModel";
import {SelectOptionRender} from "./SelectOptionRender";
import {LabelOptionRender} from "./LabelOptionRender";
import {GuestModel} from "entities/GuestModel";
import {flatAPI} from "service/FlatService";

type FlatRoomCellRendererProps = {
    s: boolean,
    tabnum: number | null,
    showWarningMsg: Function,
    dateStart: string,
    dateFinish: string,
    setGridData: Function,
    bed: BedModel,
    hotelId: number | null
}

export const FlatRoomCellRenderer = (props:FlatRoomCellRendererProps) => {

    // States
    const [selectedFlatId, setSelectedFlatId] = useState<number | null>(props.bed?.room.flat.id); // ИД выбранной секции
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(props.bed?.room.id); // ИД выбранной комнаты
    const [selectedBedId, setSelectedBedId] = useState<number | null>(props.bed?.id); // ИД выбранного места
    // -----

    // Web requests
    const [getAvailableBedWithRoomByFlatId, {
        data: availableBedFromRequest,
    }] = roomAPI.useGetAvailableBedWithRoomByFlatIdMutation(); // Получение комнат по ИД секции
    const [getAllFlats, {
        data: flatsFromRequest,
    }] = flatAPI.useGetAllSimpleMutation(); // Получение секций по ИД отеля
    const [getAllRooms, {
        data: roomsFromRequest,
        isLoading: isRoomsLoading
    }] = roomAPI.useGetAllMutation(); // Получение комнат по ИД секции
    const [getAllBeds, {
        data: bedsFromRequest,
        isLoading: isBedsLoading
    }] = roomAPI.useGetAllBedsMutation(); // Получение койко-мест по ИД комнаты
    // -----

    // Effects
    useEffect(() => {
        if (selectedFlatId && props.dateStart && props.dateFinish)
            getAvailableBedWithRoomByFlatId({flatId: selectedFlatId, dateStart: props.dateStart, dateFinish: props.dateFinish});
    }, [selectedFlatId, props.dateStart, props.dateFinish]);
    useEffect(() => {
        if (availableBedFromRequest) {
            if (availableBedFromRequest.id == null) { // Мест в секции нет
                setSelectedFlatId(null);
                setSelectedRoomId(null);
                setSelectedBedId(null);
                props.showWarningMsg("В секции нет мест!");
                return;
            }
            setSelectedRoomId(availableBedFromRequest.room.id);
            setSelectedBedId(availableBedFromRequest.id);
        }
    }, [availableBedFromRequest]);
    useEffect(() => {
        if (props.hotelId)
            getAllFlats({hotelId: props.hotelId.toString(), dateStart: props.dateStart, dateFinish: props.dateFinish});
    }, [props.s]);
    useEffect(() => {
        if (props.dateStart && props.dateFinish){
            if (props.hotelId) getAllFlats({hotelId: props.hotelId.toString(), dateStart: props.dateStart, dateFinish: props.dateFinish});
        }
    }, [props.dateStart, props.dateFinish])
    useEffect(() => {
        if (selectedFlatId) getAllRooms({flatId: selectedFlatId, dateStart: props.dateStart, dateFinish: props.dateFinish});
    }, [selectedFlatId]);
    useEffect(() => {
        if (selectedRoomId) getAllBeds({roomId: selectedRoomId, dateStart: props.dateStart, dateFinish: props.dateFinish});
    }, [selectedRoomId]);
    useEffect(() => {
        if (selectedBedId)
            props.setGridData((data:GuestModel[]) => {
                let tmp = JSON.parse(JSON.stringify(data));
                let bed = bedsFromRequest?.find((b:BedModel) => b.id == selectedBedId);
                return tmp.map((guest: GuestModel) => guest.tabnum == props.tabnum ?
                    {...guest,
                        bed
                    }
                    :guest);
            });
    }, [bedsFromRequest])
    // -----

    // Handlers
    const selectFlatHandler = (id: number | undefined = undefined) => {
        setSelectedRoomId(null);
        setSelectedBedId(null);
        if (id !== undefined) setSelectedFlatId(id);
        else setSelectedFlatId(null);
    };
    const selectRoomHandler = (id: number | undefined = undefined) => {
        setSelectedBedId(null);
        if (id !== undefined) setSelectedRoomId(id);
        else setSelectedRoomId(null);
    };
    const selectBedHandler = (id: number | undefined = undefined) => {
        if (id !== undefined) setSelectedBedId(id);
        else setSelectedBedId(null);
    };
    // -----

    return <Flex vertical={true} style={{marginTop: 3, marginBottom: 3}}>
            <Select
                allowClear={true}
                value={selectedFlatId}
                placeholder={"Выберите секцию"}
                style={{width: '100%', marginBottom: 5}}
                onChange={(e) => selectFlatHandler(e)}
                onClear={() => selectFlatHandler()}
                options={flatsFromRequest?.map((flat: FlatModel) => ({value: flat.id, label: flat.name}))}
                labelRender={(params) => (<LabelOptionRender params={params}/>)}
                optionRender={(params) => (<SelectOptionRender params={params}/>)}
            />
            <Select
                allowClear={true}
                value={selectedRoomId}
                loading={isRoomsLoading}
                placeholder={"Комната заполнится автоматически"}
                style={{width: '100%', marginBottom: 5}}
                onChange={(e) => selectRoomHandler(e)}
                onClear={() => selectRoomHandler()}
                options={roomsFromRequest?.map((room: RoomModel) => ({value: room.id, label: room.name}))}
                labelRender={(params) => (<LabelOptionRender params={params}/>)}
                optionRender={(params) => (<SelectOptionRender params={params}/>)}
            />
            <Select
                allowClear={true}
                value={selectedBedId}
                loading={isBedsLoading}
                placeholder={"Место заполнится автоматически"}
                style={{width: '100%'}}
                onChange={(e) => selectBedHandler(e)}
                onClear={() => selectBedHandler()}
                options={bedsFromRequest?.map((bed: BedModel) => ({value: bed.id, label: bed.name}))}
                labelRender={(params) => (<LabelOptionRender params={params}/>)}
                optionRender={(params) => (<SelectOptionRender params={params}/>)}
            />
    </Flex>
}
