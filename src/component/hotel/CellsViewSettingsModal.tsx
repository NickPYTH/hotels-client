import {Button, Checkbox, ColorPicker, Flex, Form, FormProps, Input, Modal} from "antd";
import React, {useState} from "react";
import {AggregationColor} from "antd/es/color-picker/color";

type ModalProps = {
    visible: boolean,
    setVisible: Function,
}

type FieldType = {
    cellsColor?: string;
    fontColor?: string;
};

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
    // -----

    // Handlers
    const saveHandler = () => {
        if (cellsColor != null && fontColor != null) {
            localStorage.setItem("cellsColor", cellsColor);
            localStorage.setItem("fontColor", fontColor);
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
                    <div style={{width: 250, marginRight: 15}}>Выберите цвет ячеек шахматки</div>
                    <ColorPicker value={cellsColor} onChange={updateCellsColor} defaultValue={cellsColor}/>
                </Flex>
                <Flex vertical={false} align={'center'}>
                    <div style={{width: 250, marginRight: 15}}>Выберите цвет текста в шахматке</div>
                    <ColorPicker value={fontColor} onChange={updateFontColor} defaultValue={fontColor}/>
                </Flex>
            </Flex>
        </Modal>
    )
}