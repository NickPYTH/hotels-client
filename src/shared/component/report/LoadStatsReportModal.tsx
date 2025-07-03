import React, {useEffect, useState} from 'react';
import {DatePicker, Flex, message, Modal, Select} from 'antd';
import {Dayjs} from "dayjs";
import {FilialModel} from "entities/FilialModel";
import {filialAPI} from "service/FilialService";
import {host} from "shared/config/constants";
import {hotelAPI} from "service/HotelService";
import {HotelModel} from "entities/HotelModel";

const {RangePicker} = DatePicker;

type ModalProps = {
    visible: boolean,
    setVisible: Function,
}
export const LoadStatsReportModal = (props: ModalProps) => {

    // States
    const [selectedFilialId, setSelectedFilialId] = useState<number | null>(null);
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
        if (dateRange && selectedHotelId) {
            let dateStart = dateRange[0].format('DD-MM-YYYY');
            let dateFinish = dateRange[1].format('DD-MM-YYYY');
            tmpButton.href = `${host}/hotels/api/report/getLoadStatsReport?hotelId=${selectedHotelId}&dateStart=${dateStart}&dateFinish=${dateFinish}`
            tmpButton.click();
        } else {
            showWarningMsg("Не все поля заполнены");
        }
    }
    // -----

    return (
        <Modal title={"Отчет о загрузке общежития за выбранный период"}
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
                        filterOption={(inputValue, option) =>  (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
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
                        filterOption={(inputValue, option) =>  (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 170}}>Период формирования</div>
                    {/*//@ts-ignore*/}
                    <RangePicker style={{width: 400}} format={"DD-MM-YYYY"} value={dateRange} onChange={(e) => {
                        setDateRange(e as any)
                    }}/>
                </Flex>
            </Flex>
        </Modal>
    );
};
