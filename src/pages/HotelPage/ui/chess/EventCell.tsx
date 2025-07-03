import dayjs, {Dayjs} from "dayjs";
import React, {useState} from "react";
import "./chess.scss";
import {EventModel} from "entities/EventModel";

enum Position {
    RIGHT = 0,
    LEFT = 1,
    INIT
}

export const EventCell = (props: {
    event: EventModel
    currentDate: string,
    dateStart: string,
    dateFinish: string,
}) => {

    // States
    const [visible, setVisible] = React.useState(false);
    const [dateStart] = useState<Dayjs>(dayjs(props.dateStart, "DD-MM-YYYY"));
    const [dateFinish] = useState<Dayjs>(dayjs(props.dateFinish, "DD-MM-YYYY"));

    const [cellDate] = useState<Dayjs>(dayjs(props.currentDate, "DD-MM-YYYY"));
    const [position] = useState<Position>(() => {
        if (cellDate.format("DD-MM-YYYY") == dateFinish.format("DD-MM-YYYY")) return Position.LEFT;
        else if (cellDate.format("DD-MM-YYYY") == dateStart.format("DD-MM-YYYY")) return Position.RIGHT;
        else return Position.INIT;
    });
    const [isStartCell] = useState(() => {
        console.log(props.currentDate, dateStart.format("DD-MM-YYYY"))
        if (props.currentDate == dateStart.format("DD-MM-YYYY"))
            return true;
        if (dateStart.format("DD-MM-YYYY") == cellDate.format("DD-MM-YYYY"))
            return true;
        return false;
    });
    const [fontSize] = useState(() => {
        return parseInt(localStorage.getItem('fontSize') ?? "10");
    });
    // -----

    return (
        <div
            onClick={() => {

            }}
            style={{
                backgroundColor: "#5ef393",
                height: 14,
                width: `100%`,
                borderTopRightRadius: position == Position.LEFT ? 10 : 0,
                borderBottomRightRadius: position == Position.LEFT ? 10 : 0,
                borderTopLeftRadius: position == Position.RIGHT ? 10 : 0,
                borderBottomLeftRadius: position == Position.RIGHT ? 10 : 0,
            }}
            onMouseOver={() => setVisible(true)} onMouseOut={() => setVisible(false)}>
            {isStartCell &&
                <div style={{position: "absolute", fontSize, paddingLeft: 2}}>
                    {props.event.kind.name}
                </div>
            }
        </div>
    )
}