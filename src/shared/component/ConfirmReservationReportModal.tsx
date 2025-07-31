import React, {useEffect, useState} from 'react';
import {DatePicker, Flex} from 'antd';
import {host} from "shared/config/constants";
import {GuestModel} from "entities/GuestModel";
import dayjs, {Dayjs} from 'dayjs';
import {PDFViewer} from "shared/component/PDFViewer";
import {ReservationModel} from "entities/ReservationModel";

const {RangePicker} = DatePicker;

type ModalProps = {
    visible: boolean,
    setVisible: Function,
    showWarningMsg: Function,
    reservation: ReservationModel,
    roomName: string,
}
export const ConfirmReservationReportModal = (props: ModalProps) => {

    // States
    const [dateRange, setDateRange] = useState<Dayjs[] | null>(null);
    //  -----

    // Effects
    useEffect(() => {
        const start = dayjs(props.reservation.dateStart, "DD-MM-YYYY HH:mm");
        const finish = dayjs(props.reservation.dateFinish, "DD-MM-YYYY HH:mm");
        setDateRange([start, finish]);
    }, []);
    // -----

    return (
        <PDFViewer
            visible={props.visible}
            setVisible={props.setVisible}
            url={!dateRange ? "" : `${host}/hotels/api/report/getReservationConfirmReportSingle?reservationId=${props.reservation.id}&format=pdf`}
            reportName={"Уточните период для формирования отчетного документа"}
        >
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 170}}>Период бронирования</div>
                    {/*//@ts-ignore*/}
                    <RangePicker allowClear={false} showTime format={"DD-MM-YYYY HH:mm"} value={dateRange} onChange={(e) => {
                        setDateRange(e as any)
                    }}/>
                </Flex>
            </Flex>
        </PDFViewer>
    );
};
