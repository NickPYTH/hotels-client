import React, {useEffect, useState} from "react";
import {ContractModel} from "../../model/ContractModel";
import dayjs, {Dayjs} from "dayjs";
import {DatePicker, Flex, Select, TimePicker} from "antd";
import {ReasonModel} from "../../model/ReasonModel";

type DatesCellRenderProps = {
    setGridData: Function,
    dateTimeStart: string,
    dateTimeFinish: string
}

export const DatesCellRender = (props:DatesCellRenderProps) => {

    // States
    const [dateStart, setDateStart] = useState<Dayjs | null>(); // Дата заселения
    const [timeStart, setTimeStart] = useState<Dayjs>(dayjs('00:00', 'HH:mm')); // Время заселения
    const [dateFinish, setDateFinish] = useState<Dayjs | null>(null); // Дата выселения
    const [timeFinish, setTimeFinish] = useState<Dayjs>(dayjs('00:00', 'HH:mm')); // Время выселения
    // -----

    // Effects
    useEffect(() => {
        if (props.dateTimeStart){
            console.log(props)
            setDateStart(dayjs(props.dateTimeStart, "DD-MM-YYYY"));
            setTimeStart(dayjs(props.dateTimeStart.split(' ')[1], "HH:mm"));
        }
    }, [props.dateTimeStart]);
    useEffect(() => {
        if (props.dateTimeFinish){
            setDateFinish(dayjs(props.dateTimeFinish, "DD-MM-YYYY"));
            setTimeFinish(dayjs(props.dateTimeFinish.split(' ')[1], "HH:mm"));
        }
    }, [props.dateTimeFinish]);
    // -----

    // Handlers
    const selectStartDateHandler = (date: Dayjs) => {
        setDateStart(date);
    }
    const selectStartTimeHandler = (time: Dayjs) => {
        setTimeStart(time);
    }
    const selectFinishDateHandler = (date: Dayjs) => {
        setDateFinish(date);
    }
    const selectFinishTimeHandler = (time: Dayjs) => {
        setTimeFinish(time);
    }
    // -----

    return <Flex vertical={true}>
        <Flex align={"center"} style={{margin: 3}}>
            <DatePicker placeholder={'Заезд'} format={'DD.MM.YYYY'} value={dateStart} onChange={selectStartDateHandler} style={{width: 140, marginRight: 5}} allowClear={false}/>
            <TimePicker needConfirm={false} value={timeStart} style={{width: 100}} onChange={selectStartTimeHandler} minuteStep={15} showSecond={false} hourStep={1} allowClear={false} />
        </Flex>
        <Flex align={"center"} style={{margin: 3}}>
            <DatePicker placeholder={'Выезд'} format={'DD.MM.YYYY'} value={dateFinish} onChange={selectFinishDateHandler} style={{width: 140, marginRight: 5}} allowClear={false}/>
            <TimePicker needConfirm={false} value={timeFinish} style={{width: 100}} onChange={selectFinishTimeHandler} minuteStep={15} showSecond={false} hourStep={1} allowClear={false} />
        </Flex>
    </Flex>
}
