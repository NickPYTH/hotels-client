import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Flex, Modal} from 'antd';
import {host} from "../../config/constants";
import {GuestModel} from "../../model/GuestModel";
import dayjs, {Dayjs} from 'dayjs';

const {RangePicker} = DatePicker;

type ModalProps = {
    visible: boolean,
    setVisible: Function,
    showWarningMsg: Function,
    guest: GuestModel,
    roomName: string,
}
export const ConfirmCheckoutReport = (props: ModalProps) => {
    const [dateRange, setDateRange] = useState<Dayjs[] | null>(null);
    useEffect(() => {
        const start = dayjs(props.guest.dateStart, "DD-MM-YYYY HH:mm");
        const finish = dayjs(props.guest.dateFinish, "DD-MM-YYYY HH:mm");
        setDateRange([start, finish]);
    }, []);
    return (
        <Modal title={"Уточните период для формирования отчетного документа"}
               open={props.visible}
               footer={() => (<></>)}
               onCancel={() => props.setVisible(false)}
               width={'550px'}
        >
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 170}}>Период проживания</div>
                    {/*//@ts-ignore*/}
                    <RangePicker allowClear={false} format={"DD-MM-YYYY HH:mm"} value={dateRange} onChange={(e) => {
                        setDateRange(e as any)
                    }}/>
                </Flex>
                <Button style={{marginTop: 5, width: 245}} onClick={() => {
                    props.showWarningMsg("Отчет начал формироваться.")
                    let tmpButton = document.createElement('a');
                    if (dateRange) {
                        let periodStart = dateRange[0].format("DD-MM-YYYY HH:mm");
                        let periodEnd = dateRange[1].format("DD-MM-YYYY HH:mm");
                        tmpButton.href = `${host}/hotels/api/user/getCheckoutReport?id=${props.guest.id}&roomNumber=${props.roomName}&periodStart=${periodStart}&periodEnd=${periodEnd}`;
                        tmpButton.click();
                    }
                }}>Сформировать отчетный документ</Button>
            </Flex>
        </Modal>
    );
};
