import React, {useState} from 'react';
import {DatePicker, Flex, message, Modal, Switch} from 'antd';
import {Dayjs} from "dayjs";
import {HotelModel} from "../../model/HotelModel";
import {host} from "../../config/constants";

const {RangePicker} = DatePicker;

type ModalProps = {
    visible: boolean,
    setVisible: Function,
    hotel: HotelModel
}
export const HotelGuestReportModal = (props: ModalProps) => {
    const [messageApi, messageContextHolder] = message.useMessage();
    const [dateRange, setDateRange] = useState<Dayjs[] | null>(null);
    const [isDefault, setIsDefault] = useState<boolean>(true);
    const showWarningMsg = (msg: string) => {
        messageApi.warning(msg);
    };
    const confirmHandler = () => {
        showWarningMsg("Отчет начал формироваться.")
        let tmpButton = document.createElement('a')
        if (dateRange) {
            let dateStart = dateRange[0].format('DD-MM-YYYY');
            let dateFinish = dateRange[1].format('DD-MM-YYYY');
            tmpButton.href = `${host}/hotels/api/hotel/getHotelReport?id=${props.hotel.id}&checkouted=${isDefault}&dateStart=${dateStart}&dateFinish=${dateFinish}`
            tmpButton.click();
        } else {
            showWarningMsg("Не все поля заполнены");
        }
    }
    return (
        <Modal title={"Отчет о проживающих в " + props.hotel.name}
               open={props.visible}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={"Сформировать"}
               width={'650px'}
               maskClosable={false}
        >
            {messageContextHolder}
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 170}}>Период формирования</div>
                    {/*//@ts-ignore*/}
                    <RangePicker format={"DD-MM-YYYY"} value={dateRange} onChange={(e) => {
                        setDateRange(e as any)
                    }}/>
                </Flex>
                <Flex>
                    <div style={{width: 170}}>Включая выселенных</div>
                    <Switch checked={isDefault} onChange={(e) => setIsDefault(e)}/>
                </Flex>
            </Flex>
        </Modal>
    );
};
