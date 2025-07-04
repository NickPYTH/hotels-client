import {ColorPicker, Flex, InputNumber, Modal} from "antd";
import React, {useState} from "react";
import {AggregationColor} from "antd/es/color-picker/color";

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
    const [fontColor, setFontColor] = useState(() => {
        if (localStorage.getItem("fontColor")) return localStorage.getItem('fontColor');
        return "#fff";
    });
    const [columnWidth, setColumnWidth] = useState(() => {
        return parseInt(localStorage.getItem('columnWidth') ?? "140");
    });
    const [fontSize, setFontSize] = useState(() => {
        return parseInt(localStorage.getItem('fontSize') ?? "10");
    });
    const [cellBackgroundColor, setCellBackgroundColor] = useState(() => {
        return localStorage.getItem('cellBackgroundColor') ?? '#e1e1e1';
    });
    const [cellColorDeadline, setCellsColorDeadline] = useState(() => {
        return localStorage.getItem('cellColorDeadline') ?? '#CE6969';
    });
    const [cellColorGuestDeadline, setCellsColorGuestDeadline] = useState(() => {
        return localStorage.getItem('cellColorGuestDeadline') ?? '#de4343';
    });
    // -----

    // Handlers
    const saveHandler = () => {
        if (cellsMaleColor != null && cellsFemaleColor && fontColor != null && columnWidth != null && fontSize != null && cellBackgroundColor != null) {
            localStorage.setItem("cellsMaleColor", cellsMaleColor);
            localStorage.setItem("cellsFemaleColor", cellsFemaleColor);
            localStorage.setItem("cellColorDeadline", cellColorDeadline);
            localStorage.setItem("cellColorGuestDeadline", cellColorGuestDeadline);
            localStorage.setItem("fontColor", fontColor);
            localStorage.setItem("cellBackgroundColor", cellBackgroundColor);
            localStorage.setItem("columnWidth", columnWidth.toString());
            localStorage.setItem("fontSize", fontSize.toString());
            window.location.reload();
        }
    }
    const updateMaleCellsColor = (_: AggregationColor, css: string) => {
        setCellsMaleColor(css);
    }
    const updateFemaleCellsColor = (_: AggregationColor, css: string) => {
        setCellsFemaleColor(css);
    }
    const updateDeadlineCellsColor = (_: AggregationColor, css: string) => {
        setCellsColorDeadline(css);
    }
    const updateDeadlineGuestCellsColor = (_: AggregationColor, css: string) => {
        setCellsColorGuestDeadline(css);
    }
    const updateCellBackgroundColor = (_: AggregationColor, css: string) => {
        setCellBackgroundColor(css);
    }
    const updateFontColor = (_: AggregationColor, css: string) => {
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
                    <div style={{width: 200, marginRight: 15}}>Цвет просроченных броней</div>
                    <ColorPicker value={cellColorDeadline} onChange={updateDeadlineCellsColor} defaultValue={cellColorDeadline}/>
                </Flex>
                <Flex vertical={false} align={'center'} style={{marginBottom: 15}}>
                    <div style={{width: 200, marginRight: 15}}>Цвет не выселенных</div>
                    <ColorPicker value={cellColorGuestDeadline} onChange={updateDeadlineGuestCellsColor} defaultValue={cellColorGuestDeadline}/>
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
                    <InputNumber min={2} max={28} value={fontSize} onChange={(value) => {
                        if (value) setFontSize(value);
                    }}/>
                </Flex>
                <Flex vertical={false} align={'center'} style={{marginBottom: 15}}>
                    <div style={{width: 200, marginRight: 15}}>Ширина столбцов</div>
                    <InputNumber min={70} max={200} value={columnWidth} onChange={(value) => {
                        if (value) setColumnWidth(value);
                    }}/>
                </Flex>
            </Flex>
        </Modal>
    )
}