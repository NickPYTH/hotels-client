import React from 'react';
import {Modal} from 'antd';
import {CustomPaintScreen} from "./CustomPaint";
import {FlatModel} from "entities/FlatModel";
import {Dayjs} from "dayjs";

type ModalProps = {
    visible: boolean,
    setVisible: Function,
    showWarningMsg: Function,
    date: Dayjs,
    flatsData: FlatModel[],
    visibleFlatModal: boolean,
    setFlatModalVisible: Function,
    setSelectedFlatId: Function,
    selectedFlatId: number | null,
    hotelId: string
}

export const ThirdFloorPlanModal = (props: ModalProps) => {
    return (
        <Modal title={`Схема жильцов 3 этажа`}
               open={props.visible}
               onCancel={() => props.setVisible(false)}
               width={window.innerWidth - 50}
               footer={() => {
               }}
        >
            <CustomPaintScreen
                hotelId={props.hotelId}
                setSelectedFlatId={props.setSelectedFlatId}
                flats={props.flatsData}
                date={props.date}
                visibleFlatModal={props.visibleFlatModal}
                setFlatModalVisible={props.setFlatModalVisible}
                selectedFlatId={props.selectedFlatId}
            />
        </Modal>
    );
};
