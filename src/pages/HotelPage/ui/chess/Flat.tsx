import React, {useContext} from "react";
import {Flex, Space} from "antd";
import {FlatModel} from "entities/FlatModel";
import {RoomModel} from "entities/RoomModel";
import {Room} from "pages/HotelPage/ui/chess/Room";
import {ChessContext} from "pages/HotelPage/ui/chess/NewChess";


export const Flat = (props: { flat: FlatModel }) => {

    // Context
    const chessContext = useContext(ChessContext);
    // -----

    if (chessContext)
        return (
            <Space style={{
                height: 30 * (props.flat.bedsCount ?? 0),
                width: window.innerWidth,
                border: '1px solid #f0f0f0',
                fontSize: 14
            }}>
                <Flex justify={'center'} align={'center'} style={{width: 70}}>{props.flat.name}</Flex>
                <Flex vertical justify='space-evenly' style={{height: 30 * (props.flat.bedsCount ?? 0), width: innerWidth - 70}}>
                    {props.flat.rooms?.map((room: RoomModel) => (
                        <Room flat={props.flat}  room={room}/>))}
                </Flex>
            </Space>
        )
    else return (<></>);
}