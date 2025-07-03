import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Flex} from 'antd';
import {host} from "shared/config/constants";
import {GuestModel} from "entities/GuestModel";
import dayjs, {Dayjs} from 'dayjs';
import {PDFViewer} from "shared/component/PDFViewer";

const {RangePicker} = DatePicker;

type ModalProps = {
    visible: boolean,
    setVisible: Function,
    showWarningMsg: Function,
    guest: GuestModel,
    roomName: string,
}
export const ConfirmCheckoutReport = (props: ModalProps) => {

    // States
    const [dateRange, setDateRange] = useState<Dayjs[] | null>(null);
    //  -----

    // Effects
    useEffect(() => {
        const start = dayjs(props.guest.dateStart, "DD-MM-YYYY HH:mm");
        const finish = dayjs(props.guest.dateFinish, "DD-MM-YYYY HH:mm");
        setDateRange([start, finish]);
    }, []);
    // -----

    return (
        <PDFViewer
            visible={props.visible}
            setVisible={props.setVisible}
            url={!dateRange ? "" : `${host}/hotels/api/report/getCheckoutReport?id=${props.guest.id}&roomNumber=${props.roomName}&periodStart=${dateRange[0].format("DD-MM-YYYY HH:mm")}&periodEnd=${dateRange[1].format("DD-MM-YYYY HH:mm")}&format=pdf`}
            reportName={"Уточните период для формирования отчетного документа"}
        >
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 170}}>Период проживания</div>
                    {/*//@ts-ignore*/}
                    <RangePicker allowClear={false} format={"DD-MM-YYYY HH:mm"} value={dateRange} onChange={(e) => {
                        setDateRange(e as any)
                    }}/>
                </Flex>
            </Flex>
        </PDFViewer>
    );
};
