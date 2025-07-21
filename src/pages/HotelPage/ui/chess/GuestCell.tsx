import {Flex} from "antd";
import dayjs, {Dayjs} from "dayjs";
import React, {useState} from "react";
import {BedModel, ChessDate, ChessGuest} from "entities/BedModel";
import {FlatModel} from "entities/FlatModel";
import "./chess.scss";

enum Position {
    RIGHT = 0,
    LEFT = 1,
    INIT
}

export const GuestCell = (props: {
    setSelectedDate: Function,
    flat: FlatModel,
    selectedRow: BedModel | null, setSelectedFlatId: Function, dateStart: Dayjs, guest: ChessGuest, data: ChessDate
}) => {

    // States
    const [visible, setVisible] = React.useState(false);
    const [dateStart] = useState<Dayjs>(dayjs.unix(props.guest.dateStart));
    const [dateFinish] = useState<Dayjs>(dayjs.unix(props.guest.dateFinish));
    const [guestNotCheckouted] = useState(() => {
        if (!props.guest.isCheckouted)
            if (dateFinish.isBefore(dayjs())) return true;
    }); // Если гость не выселен а текущая дата уже больше даты его выселения
    const [cellDate] = useState<Dayjs>(dayjs(props.data.date, "DD-MM-YYYY"));
    const [position] = useState<Position>(() => {
        if (cellDate.format("DD-MM-YYYY") == dateFinish.format("DD-MM-YYYY")) return Position.LEFT;
        else if (cellDate.format("DD-MM-YYYY") == dateStart.format("DD-MM-YYYY")) return Position.RIGHT;
        else return Position.INIT;
    });
    const [percent] = useState<number>(() => {
        if (cellDate.format("DD-MM-YYYY") == dateFinish.format("DD-MM-YYYY")) {
            let hour: number = parseInt(dateFinish.format("HH"));
            return hour / 24 * 100;
        }
        if (cellDate.format("DD-MM-YYYY") == dateStart.format("DD-MM-YYYY")) {
            let hour: number = parseInt(dateStart.format("HH"));
            return (24 - hour) / 24 * 100;
        }
        if (dateStart < cellDate && cellDate < dateFinish) return 100;
        return 0;
    });
    const [isStartCell] = useState(() => {
        if (props.data.date.substring(0, 10) == dateStart.format("DD-MM-YYYY"))
            return true;
        if (props.dateStart.format("DD-MM-YYYY") == cellDate.format("DD-MM-YYYY"))
            return true;
        return false;
    });
    const [cellsNotCheckoutedColor] = useState(() => {
        return localStorage.getItem('cellColorGuestDeadline') ?? '#de4343';
    });
    const [cellsMaleBeforeColor] = useState(() => {
        return localStorage.getItem('cellsMaleColor') ?? "#75a5f2";
    });
    const [cellsMaleAfterColor] = useState(() => {
        return localStorage.getItem('cellsMaleAfterColor') ?? "#196ded";
    });
    const [cellsFemaleBeforeColor] = useState(() => {
        return localStorage.getItem('cellsFemaleColor') ?? "#f1259b";
    });
    const [cellsFemaleAfterColor] = useState(() => {
        return localStorage.getItem('cellsFemaleAfterColor') ?? "#951660";
    });
    const [fontColor] = useState(() => {
        return localStorage.getItem('fontColor') ?? "#fff";
    });
    const [fontSize] = useState(() => {
        return parseInt(localStorage.getItem('fontSize') ?? "10");
    });
    // -----

    return (
        <div
            onClick={() => {
                props.setSelectedFlatId(props.flat.id);
                if (position == Position.RIGHT)
                    props.setSelectedDate(dateStart);
                else
                    props.setSelectedDate(dateFinish);

            }}
            className={guestNotCheckouted ? "flaming-aura" : ""}
            style={{
                top: 3,
                left: position == Position.LEFT ? 0 : 'initial',
                right: position == Position.RIGHT ? 0 : 'initial',
                position: "absolute",
                backgroundColor: guestNotCheckouted ? cellsNotCheckoutedColor : props.guest.male ?
                    dateStart.unix() >= dayjs().unix() ? cellsMaleAfterColor : cellsMaleBeforeColor : dateStart.unix() >= dayjs().unix() ? cellsFemaleAfterColor : cellsFemaleBeforeColor,
                height: 24,
                width: `${percent}%`,
                borderTopRightRadius: position == Position.LEFT ? 10 : 0,
                borderBottomRightRadius: position == Position.LEFT ? 10 : 0,
                borderTopLeftRadius: position == Position.RIGHT ? 10 : 0,
                borderBottomLeftRadius: position == Position.RIGHT ? 10 : 0,
                backgroundImage: props.guest.isReservation ? "radial-gradient(white 1px, transparent 0)" : "inherit",
                backgroundSize: props.guest.isReservation ? "8px 8px" : 'inherit',
            }}
            onMouseOver={() => setVisible(true)} onMouseOut={() => setVisible(false)}>
            {visible &&
                <div
                    style={{
                        zIndex: 1000,
                        position: 'absolute',
                        top: -90,
                        width: 280,
                        height: 90,
                        background: '#ffffff',
                        border: "1px solid #f0f0f0",
                        boxShadow: "0px 0px 8px 4px rgba(34, 60, 80, 0.25)",
                        borderRadius: 5, paddingLeft: 5
                    }}>
                    <Flex vertical justify='space-evenly' style={{width: 280, height: 90, fontSize: 12}}>
                        <div style={{
                            fontWeight: 600,
                            marginBottom: 5
                        }}>{`${props.guest.lastname} ${props.guest.name} ${props.guest.secondName} `}</div>
                        <Flex vertical>
                            {props.guest.post && <div>{props.guest.post}</div>}
                            <div>{dateStart.format("DD-MM-YYYY HH:mm")} по {dateFinish.format("DD-MM-YYYY HH:mm")}</div>
                            {props.guest.note && <div>{props.guest.note}</div>}
                            {guestNotCheckouted && "НЕ ВЫСЕЛЕН!"}
                        </Flex>
                    </Flex>
                </div>
            }
            {isStartCell &&
                <div style={{
                    position: "absolute",
                    left: 3,
                    top: 5,
                    width: 150,
                    zIndex: 100,
                    fontSize,
                    fontWeight: props.guest.isReservation ? 'bold' : 'normal',
                    color: fontColor
                }}>
                    <div style={{zIndex: 1000}}>
                        {`${props.guest.lastname} ${props.guest.name ? props.guest.name[0] + "." : ""} ${props.guest.secondName ? props.guest.secondName[0] + "." : ""} `}
                    </div>
                </div>
            }
        </div>
    )
}