import React, {useContext} from "react";
import {Flex, Space} from "antd";
import {BedModel, ChessDate} from "entities/BedModel";
import {ChessCell} from "pages/HotelPage/ui/chess/ChessCell";
import {FlatModel} from "entities/FlatModel";
import {ChessContext} from "pages/HotelPage/ui/chess/NewChess";


export const Bed = (props: { flat: FlatModel, bed: BedModel }) => {

    // Context
    const chessContext = useContext(ChessContext);
    // -----

    if (chessContext)
        return (
            <Space
                style={{
                    height: 30,
                    width: window.innerWidth - 130,
                    borderLeft: '1px solid #f0f0f0',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                <Flex justify={'center'} align={'center'} style={{
                    width: 35
                }}>{props.bed.name}</Flex>
                <Flex style={{width: chessContext.cellWidth * props.bed.dates.length}}>
                    {props.bed.dates.map((date: ChessDate) => (<ChessCell
                        flat={props.flat}
                        bed={props.bed}
                        data={date}
                    />))}
                </Flex>
            </Space>
        )
    else return (<></>)
}