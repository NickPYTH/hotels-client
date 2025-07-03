import React, {useEffect, useState} from 'react';
import {DatePicker, Flex, message, Modal, Select} from 'antd';
import {Dayjs} from "dayjs";
import {FilialModel} from "entities/FilialModel";
import {filialAPI} from "service/FilialService";
import {hotelAPI} from "service/HotelService";
import {HotelModel} from "entities/HotelModel";
import {host} from "shared/config/constants";
import {ResponsibilityModel} from "entities/ResponsibilityModel";
import {responsibilityAPI} from "service/ResponsibilityService";

const {RangePicker} = DatePicker;

type ModalProps = {
    visible: boolean,
    setVisible: Function,
}
export const AvdReportModal = (props: ModalProps) => {

    // States
    const [selectedFilialId, setSelectedFilialId] = useState<number | null>(null);
    const [responsibilityId, setResponsibilityId] = useState<number | null>(null);
    const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
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
    const [getAllResponsibility, {
        data: responsibilities,
        isLoading: isResponsibilityLoading
    }] = responsibilityAPI.useGetAllByHotelIdMutation();
    // -----

    // Effects
    useEffect(() => {
        getAllFilials();
    }, []);
    useEffect(() => {
        setSelectedHotelId(null);
    }, [selectedFilialId]);
    useEffect(() => {
        if (selectedFilialId) getAllHotels({filialId: selectedFilialId.toString()});
    }, [selectedFilialId]);
    useEffect(() => {
        if (selectedHotelId)
            getAllResponsibility(selectedHotelId);
        setResponsibilityId(null);
    }, [selectedHotelId]);
    // -----

    // Handler
    const confirmHandler = () => {
        showWarningMsg("Отчет начал формироваться")
        let tmpButton = document.createElement('a')
        if (dateRange && selectedHotelId && responsibilityId) {
            tmpButton.href = `${host}/hotels/api/report/getAvdReport?hotelId=${selectedHotelId}&dateStart=${dateRange[0].format("DD-MM-YYYY")}&dateFinish=${dateRange[1].format("DD-MM-YYYY")}&responsibilityId=${responsibilityId}`;
            tmpButton.click();
        } else {
            showWarningMsg("Не все поля заполнены");
        }
    }
    // -----

    return (
        <Modal title={"Абонемент выходного дня"}
               open={props.visible}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={"Сформировать"}
               width={'670px'}
               maskClosable={false}
               loading={isFilialsLoading}
        >
            {messageContextHolder}
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Выберите филиал</div>
                    <Select
                        style={{width: 400}}
                        value={selectedFilialId}
                        placeholder={"Выберите филиал"}
                        onChange={(e) => setSelectedFilialId(e)}
                        options={filials?.filter((filial: FilialModel) => !filial.excluded).map((filial: FilialModel) => ({value: filial.id, label: filial.name}))}
                        allowClear={true}
                        showSearch
                        filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Выберите общежитие</div>
                    <Select
                        style={{width: 400}}
                        value={selectedHotelId}
                        placeholder={"Выберите общежитие"}
                        onChange={(e) => setSelectedHotelId(e)}
                        options={hotels?.map((hotel: HotelModel) => ({value: hotel.id, label: hotel.name}))}
                        allowClear={true}
                        loading={isHotelsLoading}
                        showSearch
                        filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Выберите ответственного</div>
                    <Select
                        loading={isResponsibilityLoading}
                        disabled={selectedHotelId === null || isResponsibilityLoading}
                        value={responsibilityId}
                        placeholder={"Выберите ответственного"}
                        style={{width: 400}}
                        onChange={(e) => setResponsibilityId(e)}
                        options={responsibilities?.map((responsibilityModel: ResponsibilityModel) => ({value: responsibilityModel.id, label: responsibilityModel.fio}))}
                        allowClear={true}
                        showSearch
                        filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 200}}>Выберите период</div>
                    {/*//@ts-ignore*/}
                    <RangePicker value={dateRange} format={"DD-MM-YYYY"} onChange={(e) => {
                        setDateRange(e as any)
                    }} style={{width: 400}}/>
                </Flex>
            </Flex>
        </Modal>
    );
};
