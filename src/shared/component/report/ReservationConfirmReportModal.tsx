import React, {useEffect, useState} from 'react';
import {DatePicker, Flex, message, Select} from 'antd';
import {Dayjs} from "dayjs";
import {FilialModel} from "entities/FilialModel";
import {filialAPI} from "service/FilialService";
import {host} from "shared/config/constants";
import {PDFViewer} from "shared/component/PDFViewer";
import {HotelModel} from "entities/HotelModel";
import {hotelAPI} from "service/HotelService";

const {RangePicker} = DatePicker;

type ModalProps = {
    visible: boolean,
    setVisible: Function,
}
export const ReservationConfirmReportModal = (props: ModalProps) => {

    // States
    const [selectedFilialId, setSelectedFilialId] = useState<number | null>(null);
    const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
    const [selectedFilialEmployeeId, setSelectedFilialEmployeeId] = useState<number | null>(null);
    const [messageApi, messageContextHolder] = message.useMessage();
    const [dateRange, setDateRange] = useState<Dayjs[] | null>(null);
    // -----

    // Useful utils
    const showWarningMsg = (msg: string) => {
        messageApi.warning(msg);
    };
    // -----

    // Web requests
    const [getAllFilials, {
        data: filials,
        isLoading: isFilialsLoading
    }] = filialAPI.useGetAllMutation();
    const [getAllHotels, {
        data: hotels,
        isLoading: isHotelsLoading
    }] = hotelAPI.useGetAllByFilialIdMutation();
    // -----

    // Effects
    useEffect(() => {
        getAllFilials();
    }, []);
    useEffect(() => {
        if (selectedFilialId) getAllHotels({filialId: selectedFilialId.toString()});
    }, [selectedFilialId]);
    // -----

    // Handler

    // -----

    return (
        <PDFViewer
            visible={props.visible}
            setVisible={props.setVisible}
            url={!dateRange ? "" : `${host}/hotels/api/report/getReservationConfirmReport?filialEmployeeId=${selectedFilialEmployeeId}&hotelId=${selectedHotelId}&dateStart=${dateRange[0].format("DD-MM-YYYY")}&dateFinish=${dateRange[1].format("DD-MM-YYYY")}&format=pdf`}
            reportName={"Подтверждение бронирования"}
        >
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 300}}>Выберите филиал общежития</div>
                    <Select
                        loading={isFilialsLoading}
                        style={{width: 400}}
                        value={selectedFilialId}
                        placeholder={"Филиал общежития"}
                        onChange={(e) => setSelectedFilialId(e)}
                        options={filials?.filter((filial: FilialModel) => !filial.excluded).map((filial: FilialModel) => ({value: filial.id, label: filial.name}))}
                        allowClear={true}
                        showSearch
                        filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 300}}>Выберите общежитие</div>
                    <Select
                        value={selectedHotelId}
                        loading={isHotelsLoading}
                        placeholder={"Выберите общежитие"}
                        style={{width: 400}}
                        onChange={(e) => setSelectedHotelId(e)}
                        options={hotels?.map((hotel: HotelModel) => ({value: hotel.id, label: hotel.name}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 300}}>Выберите филиал получатель</div>
                    <Select
                        loading={isFilialsLoading}
                        style={{width: 400}}
                        value={selectedFilialEmployeeId}
                        placeholder={"Филиал получатель"}
                        onChange={(e) => setSelectedFilialEmployeeId(e)}
                        options={filials?.filter((filial: FilialModel) => !filial.excluded).map((filial: FilialModel) => ({value: filial.id, label: filial.name}))}
                        allowClear={true}
                        showSearch
                        filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 300}}>Выберите период</div>
                    {/*//@ts-ignore*/}
                    <RangePicker value={dateRange} format={"DD-MM-YYYY"} onChange={(e) => {
                        setDateRange(e as any)
                    }} style={{width: 400}}/>
                </Flex>
            </Flex>
        </PDFViewer>
    );
};
