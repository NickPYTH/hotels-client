import {Button, Checkbox, ColorPicker, Flex, Form, FormProps, Input, InputNumber, Modal} from "antd";
import React, {useState} from "react";
import {AggregationColor} from "antd/es/color-picker/color";

type ModalProps = {
    visible: boolean,
    setVisible: Function,
}

export const CellsViewSettingsModal = (props: ModalProps) => {

    // States
    const [cellsColor, setCellsColor] = useState(() => {
        if (localStorage.getItem("cellsColor")) return localStorage.getItem('cellsColor');
        return "#75a5f2";
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
    // -----

    // Handlers
    const saveHandler = () => {
        if (cellsColor != null && fontColor != null && columnWidth != null && fontSize != null) {
            localStorage.setItem("cellsColor", cellsColor);
            localStorage.setItem("fontColor", fontColor);
            localStorage.setItem("columnWidth", columnWidth.toString());
            localStorage.setItem("fontSize", fontSize.toString());
            window.location.reload();
        }
    }
    const updateCellsColor = (_, css:string) => {
        setCellsColor(css);
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
                    <div style={{width: 200, marginRight: 15}}>Цвет ячеек шахматки</div>
                    <ColorPicker value={cellsColor} onChange={updateCellsColor} defaultValue={cellsColor}/>
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
                    <InputNumber min={101} max={200} value={columnWidth} onChange={(value) => setColumnWidth(value)}/>
                </Flex>
            </Flex>
        </Modal>
    )
}