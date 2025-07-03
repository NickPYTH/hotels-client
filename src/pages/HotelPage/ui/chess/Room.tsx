import React, {useContext} from "react";
import {Flex, Space} from "antd";
import {RoomModel} from "entities/RoomModel";
import {BedModel} from "entities/BedModel";
import {Bed} from "pages/HotelPage/ui/chess/Bed";
import {FlatModel} from "entities/FlatModel";
import {ChessContext} from "pages/HotelPage/ui/chess/NewChess";


export const Room = (props: { flat: FlatModel, room: RoomModel }) => {

    // Context
    const chessContext = useContext(ChessContext);
    // -----

    if (chessContext)
        return (
            <Space style={{
                height: 30 * (props.room.bedsCount ?? 0),
                width: window.innerWidth - 70,
                borderLeft: '1px solid #f0f0f0',
                borderBottom: '1px solid #f0f0f0'
            }}>
                <Flex justify={'center'} align={'center'} style={{width: 30}}>{props.room.name}</Flex>
                <Flex vertical justify='space-evenly' style={{height: 30 * (props.room.bedsCount ?? 0), width: innerWidth - 70}}>
                    {props.room.beds?.map((bed: BedModel) => (<Bed flat={props.flat} bed={bed}/>))}
                </Flex>
            </Space>
        )
    else return (<></>)
}