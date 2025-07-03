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
export const WeekReportModal = (props: ModalProps) => {

    // States
    const [selectedFilialId, setSelectedFilialId] = useState<number | null>(null);
    const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
    const [messageApi, messageContextHolder] = message.useMessage();
    const [date, setDate] = useState<Dayjs | null>(dayjs());
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
        if (date && selectedHotelId) {
            tmpButton.href = `${host}/hotels/api/report/getWeekReport?hotelId=${selectedHotelId}&dateStart=${date.format("DD-MM-YYYY")}&dateFinish=${date.format("DD-MM-YYYY")}`;
            tmpButton.click();
        } else {
            showWarningMsg("Не все поля заполнены");
        }
    }
    const selectStartDateHandler = (date: Dayjs) => {
        setDate(date);
    }
    // -----

    return (
        <Modal title={"Информация о еженедельном бронирование"}
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
                    <div style={{width: 170}}>Выберите начало недели</div>
                    <DatePicker placeholder={'Заезд'} format={'DD.MM.YYYY'} value={date} onChange={selectStartDateHandler} style={{width: 140, marginRight: 5}} allowClear={false}/>
                </Flex>
            </Flex>
        </Modal>
    );
};
