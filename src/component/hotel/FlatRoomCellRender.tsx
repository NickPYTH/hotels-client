import React, {useEffect, useState} from "react";
import {Flex, Select} from "antd";
import {FlatModel} from "../../model/FlatModel";
import {RoomModel} from "../../model/RoomModel";
import {roomAPI} from "../../service/RoomService";

type FlatRoomCellRendererProps = {
    flats: FlatModel[],
    setGridData: Function,
    filialId: number,
    hotelId: number,
    flatId: number,
    roomId: number
}

export const FlatRoomCellRenderer = (props:FlatRoomCellRendererProps) => {

    // States
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(props.roomId); // ИД выбранной комнаты
    const [selectedFlatId, setSelectedFlatId] = useState<number | null>(props.flatId); // ИД выбранной секции
    // -----

    // Web requests
    const [getAllRooms, {
        data: roomsFromRequest,
        isLoading: isRoomsLoading
    }] = roomAPI.useGetAllMutation(); // Получение комнат по ИД секции
    // -----

    // Effects
    useEffect(() => {
        if (selectedFlatId) getAllRooms(selectedFlatId.toString());
    }, [selectedFlatId]);
    // -----

    // Handlers
    const selectFlatHandler = (id: number | undefined = undefined) => {
        setSelectedRoomId(null);
        if (id !== undefined) setSelectedFlatId(id);
        else setSelectedFlatId(null);
    };
    const selectRoomHandler = (id: number | undefined = undefined) => {
        if (id !== undefined) setSelectedRoomId(id);
        else setSelectedRoomId(null);
    };
    // -----

    return <Flex vertical={true}>
            <Select
                allowClear={true}
                value={selectedFlatId}
                placeholder={"Выберите секцию"}
                style={{width: '100%', marginBottom: 5}}
                onChange={(e) => selectFlatHandler(e)}
                onClear={() => selectFlatHandler()}
                options={props.flats.map((flat: FlatModel) => ({value: flat.id, label: flat.name}))}
            />
            <Select
                allowClear={true}
                value={selectedRoomId}
                loading={isRoomsLoading}
                placeholder={"Выберите комнату"}
                style={{width: '100%', marginBottom: 5}}
                onChange={(e) => selectRoomHandler(e)}
                onClear={() => selectRoomHandler()}
                options={roomsFromRequest?.map((room: RoomModel) => ({value: room.id, label: room.name}))}
            />
            <Select
                allowClear={true}
                value={selectedRoomId}
                loading={isRoomsLoading}
                placeholder={"Место заполнится автоматически"}
                style={{width: '100%'}}
                onChange={(e) => selectRoomHandler(e)}
                onClear={() => selectRoomHandler()}
                options={roomsFromRequest?.map((room: RoomModel) => ({value: room.id, label: room.name}))}
            />
    </Flex>
}
