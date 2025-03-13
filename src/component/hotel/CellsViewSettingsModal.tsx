import {Button, Checkbox, ColorPicker, Flex, Form, FormProps, Input, InputNumber, Modal} from "antd";
import React, {useState} from "react";
import {AggregationColor} from "antd/es/color-picker/color";
import {RoomModel} from "../../model/RoomModel";
import {Dayjs} from "dayjs";

type ModalProps = {
    visible: boolean,
    setVisible: Function,
}

export const CellsViewSettingsModal = (props: ModalProps) => {

    // States
    const [cellsMaleColor, setCellsMaleColor] = useState(() => {
        if (localStorage.getItem("cellsMaleColor")) return localStorage.getItem('cellsMaleColor');
        return "#75a5f2";
    });
    const [cellsFemaleColor, setCellsFemaleColor] = useState(() => {
        if (localStorage.getItem("cellsFemaleColor")) return localStorage.getItem('cellsFemaleColor');
        return "#f1259b";
    });
    const [reservationCellsColor, setReservationCellsColor] = useState(() => {
        if (localStorage.getItem("reservationCellsColor")) return localStorage.getItem('reservationCellsColor');
        return "#B9848C";
    });
    const [fontColor, setFontColor] = useState(() => {
        if (localStorage.getItem("fontColor")) return localStorage.getItem('fontColor');
        return "#fff";
    });
    const [columnWidth, setColumnWidth] = useState(() => {
        if (localStorage.getItem("columnWidth")) return parseInt(localStorage.getItem('columnWidth'));
        return 140;
    });
    const [fontSize, setFontSize] = useState(() => {
        if (localStorage.getItem("fontSize")) return parseInt(localStorage.getItem('fontSize'));
        return 10;
    });
    const [cellBackgroundColor, setCellBackgroundColor] = useState(() => {
        if (localStorage.getItem("cellBackgroundColor")) return localStorage.getItem('cellBackgroundColor');
        return '#e1e1e1';
    });
    // -----

    // Handlers
    const saveHandler = () => {
        if (cellsMaleColor != null && cellsFemaleColor && fontColor != null && columnWidth != null && fontSize != null && cellBackgroundColor != null && reservationCellsColor != null) {
            localStorage.setItem("cellsMaleColor", cellsMaleColor);
            localStorage.setItem("cellsFemaleColor", cellsFemaleColor);
            localStorage.setItem("reservationCellsColor", reservationCellsColor);
            localStorage.setItem("fontColor", fontColor);
            localStorage.setItem("cellBackgroundColor", cellBackgroundColor);
            localStorage.setItem("columnWidth", columnWidth.toString());
            localStorage.setItem("fontSize", fontSize.toString());
            window.location.reload();
        }
    }
    const updateMaleCellsColor = (_, css:string) => {
        setCellsMaleColor(css);
    }
    const updateFemaleCellsColor = (_, css:string) => {
        setCellsFemaleColor(css);
    }
    const updateReservationCellsColor = (_, css:string) => {
        setReservationCellsColor(css);
    }
    const updateCellBackgroundColor = (_, css:string) => {
        setCellBackgroundColor(css);
    }
    const updateFontColor = (_, css:string) => {
        setFontColor(css);
    }
    // -----

    return (<Modal title={`Настройки`}
                   open={props.visible}
                   onCancel={() => props.setVisible(false)}
                   okText={"Сохранить"}
                   onOk={saveHandler}
        >
            <Flex vertical={true}>
                <Flex vertical={false} align={'center'} style={{marginBottom: 15}}>
                    <div style={{width: 200, marginRight: 15}}>Цвет записей мужчин</div>
                    <ColorPicker value={cellsMaleColor} onChange={updateMaleCellsColor} defaultValue={cellsMaleColor}/>
                </Flex>
                <Flex vertical={false} align={'center'} style={{marginBottom: 15}}>
                    <div style={{width: 200, marginRight: 15}}>Цвет записей женщин</div>
                    <ColorPicker value={cellsFemaleColor} onChange={updateFemaleCellsColor} defaultValue={cellsFemaleColor}/>
                </Flex>
                <Flex vertical={false} align={'center'} style={{marginBottom: 15}}>
                    <div style={{width: 200, marginRight: 15}}>Цвет броней</div>
                    <ColorPicker value={reservationCellsColor} onChange={updateReservationCellsColor} defaultValue={reservationCellsColor}/>
                </Flex>
                <Flex vertical={false} align={'center'} style={{marginBottom: 15}}>
                    <div style={{width: 200, marginRight: 15}}>Цвет выходных дней</div>
                    <ColorPicker value={cellBackgroundColor} onChange={updateCellBackgroundColor} defaultValue={cellBackgroundColor}/>
                </Flex>
                <Flex vertical={false} align={'center'} style={{marginBottom: 15}}>
                    <div style={{width: 200, marginRight: 15}}>Цвет текста в шахматке</div>
                    <ColorPicker value={fontColor} onChange={updateFontColor} defaultValue={fontColor}/>
                </Flex>
                <Flex vertical={false} align={'center'} style={{marginBottom: 15}}>
                    <div style={{width: 200, marginRight: 15}}>Размер текста</div>
                    <InputNumber min={2} max={28} value={fontSize} onChange={(value) => setFontSize(value)}/>
                </Flex>
                <Flex vertical={false} align={'center'} style={{marginBottom: 15}}>
                    <div style={{width: 200, marginRight: 15}}>Ширина столбцов</div>
                    <InputNumber min={70} max={200} value={columnWidth} onChange={(value) => setColumnWidth(value)}/>
                </Flex>
            </Flex>
        </Modal>
    )
}