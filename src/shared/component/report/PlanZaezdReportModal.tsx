import React, {useEffect, useState} from 'react';
import {DatePicker, Flex, message, Modal, Select} from 'antd';
import dayjs, {Dayjs} from "dayjs";
import {FilialModel} from "entities/FilialModel";
import {filialAPI} from "service/FilialService";
import {hotelAPI} from "service/HotelService";
import {HotelModel} from "entities/HotelModel";
import {host} from "shared/config/constants";

const {RangePicker} = DatePicker;

type ModalProps = {
    visible: boolean,
    setVisible: Function,
}
export const PlanZaezdReportModal = (props: ModalProps) => {

    // States
    const [selectedFilialId, setSelectedFilialId] = useState<number | null>(null);
    const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
    const [messageApi, messageContextHolder] = message.useMessage();
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
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
        setSelectedHotelId(null);
    }, [selectedFilialId]);
    useEffect(() => {
        if (selectedFilialId) getAllHotels({filialId: selectedFilialId.toString()});
    }, [selectedFilialId]);
    // -----

    // Handler
    const confirmHandler = () => {
        showWarningMsg("Отчет начал формироваться")
        let tmpButton = document.createElement('a')
        if (startDate && endDate && selectedHotelId) {
            tmpButton.href = `${host}/hotels/api/report/getPlanZaezdReport?hotelId=${selectedHotelId}&dateStart=${startDate.format("DD-MM-YYYY")}&dateFinish=${endDate.format("DD-MM-YYYY")}`;
            tmpButton.click();
        } else {
            showWarningMsg("Не все поля заполнены");
        }
    }
    const selectStartDateHandler = (date: Dayjs) => {
        setStartDate(date);
    }
    const selectEndDateHandler = (date: Dayjs) => {
        setEndDate(date);
    }
    // -----

    return (
        <Modal title={"Планируемый заезд"}
               open={props.visible}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={"Сформировать"}
               width={'650px'}
               maskClosable={false}
               loading={isFilialsLoading}
        >
            {messageContextHolder}
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 170}}>Выберите филиал</div>
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
                    <div style={{width: 170}}>Выберите общежитие</div>
                    <Select
                        style={{width: 400}}
                        value={selectedHotelId}
                        placeholder={"Выберите общежитие"}
                        onChange={(e) => setSelectedHotelId(e)}
                        options={hotels?.map((hotel: HotelModel) => ({value: hotel.id, label: hotel.name}))}
                        allowClear={true}
                        showSearch
                        filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 170}}>Выберите период заезда</div>
                    <DatePicker placeholder={'Начало периода'} format={'DD.MM.YYYY'} value={startDate} onChange={selectStartDateHandler} style={{width: 197, marginRight: 6}} allowClear={false}/>
                    <DatePicker placeholder={'Конец периода'} format={'DD.MM.YYYY'} value={endDate} onChange={selectEndDateHandler} style={{width: 197}} allowClear={false}/>
                </Flex>
            </Flex>
        </Modal>
    );
};
