import React, {useContext, useEffect, useState} from "react";
import {Flex} from "antd";
import {BedModel, ChessDate, ChessGuest} from "entities/BedModel";
import {GuestCell} from "pages/HotelPage/ui/chess/GuestCell";
import dayjs from "dayjs";
import {FlatModel} from "entities/FlatModel";
import {ChessContext} from "pages/HotelPage/ui/chess/NewChess";


export const ChessCell = (props: { flat: FlatModel, bed: BedModel, data: ChessDate }) => {

    // Context
    const chessContext = useContext(ChessContext);
    // -----

    // States
    const [isRowSelected, setIsRowSelected] = useState(false);
    const [mouseOver, setMouseOver] = useState(false);
    const [cellBackgroundColor] = useState(() => {
        return localStorage.getItem('cellBackgroundColor') ?? '#e1e1e1';
    });
    const [isWeekend] = useState(() => {
        let dayOfWeek = dayjs(props.data.date, "DD-MM-YYYY").day();
        return dayOfWeek == 6 || dayOfWeek == 0;
    });
    // -----

    // Effects
    useEffect(() => {
        if (chessContext) {
            if (chessContext.selectedRow) {
                if (chessContext.selectedRow.id == props.bed.id) setIsRowSelected(true);
                else setIsRowSelected(false);
            } else setIsRowSelected(false);
        }
    }, [chessContext?.selectedRow]);
    useEffect(() => {
        if (mouseOver)
            document.getElementsByName(`${props.bed.id}`).forEach((el: HTMLElement) => {
                if (el.style.background == "rgb(255, 255, 255)")
                    el.style.background = "rgb(226, 226, 226)";
            });
        else
            document.getElementsByName(`${props.bed.id}`).forEach((el: HTMLElement) => {
                if (el.style.background == "rgb(226, 226, 226)") {
                    el.style.background = '#ffffff';
                }
            });
    }, [mouseOver]);
    // -----

    // Handlers
    const selectCellHandler = () => {
        if (chessContext?.interactiveMode == true) {
            if (props.data.guests.length == 0) {
                chessContext.selectCellHandler(props.data.date, props.bed);
            }
        }
    }
    // -----

    if (chessContext)
        return (
            <div
                id={"$$$" + props.bed.id.toString() + props.data.date}
                onMouseOver={() => setMouseOver(true)}
                onMouseOut={() => setMouseOver(false)}
                onClick={selectCellHandler}
                //@ts-ignore
                name={`${props.bed.id}`}
                style={{
                    height: 30,
                    width: chessContext.cellWidth,
                    background: isWeekend ? cellBackgroundColor : isRowSelected ? '#cecece' : '#fff',
                    borderBottom: '1px solid #f0f0f0',
                    borderLeft: '1px solid #f0f0f0',
                    borderTop: '1px solid #f0f0f0',
                    cursor: 'pointer',
                }}>
                <Flex justify={'center'} align={'center'} style={{
                    position: 'relative',
                }}>
                    {props.data.guests.map(((g: ChessGuest) => <GuestCell
                        flat={props.flat}
                        setSelectedDate={chessContext.setSelectedDate}
                        selectedRow={chessContext.selectedRow}
                        setSelectedFlatId={chessContext.setSelectedFlatId}
                        dateStart={chessContext.dateStart}
                        data={props.data} guest={g}/>))}
                </Flex>
            </div>
        )
    else return (<></>)
}