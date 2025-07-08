import React, {useEffect, useState} from 'react';
import {Button, Checkbox, CheckboxChangeEvent, DatePicker, Flex, message, Modal, Select} from 'antd';
import {FilialModel} from "entities/FilialModel";
import {filialAPI} from "service/FilialService";
import {responsibilityAPI} from "service/ResponsibilityService";
import {ResponsibilityModel} from "entities/ResponsibilityModel";
import {Dayjs} from "dayjs";
import {hotelAPI} from "service/HotelService";
import {HotelModel} from "entities/HotelModel";
import {useSelector} from "react-redux";
import {RootStateType} from "store/store";
import {host, ukgBosses} from "shared/config/constants";
import {reasonAPI} from "service/ReasonService";
import {ReasonModel} from "entities/ReasonModel";

const {RangePicker} = DatePicker;

type ModalProps = {
    visible: boolean,
    setVisible: Function,
}
export const ReportReestrRabotModal = (props: ModalProps) => {

    // States
    const currentUser = useSelector((state: RootStateType) => state.currentUser.user);
    const [dateRange, setDateRange] = useState<Dayjs[] | null>(null);
    const [selectedFilialId, setSelectedFilialId] = useState<number | null>(null);
    const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
    const [selectedReasonList, setSelectedReasonList] = useState<number[] | null>(null);
    const [responsibilityId, setResponsibilityId] = useState<number | null>(null);
    const [selectedUkgBoss, setSelectedUkgBoss] = useState<string | null>(null);
    const [isOrganization, setIsOrganization] = useState<boolean>(false);
    const [isGuestCountMode, setIsGuestCountMode] = useState<boolean>(false);
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
    const [getReasons, {
        data: reasons,
        isLoading: isReasonsLoading
    }] = reasonAPI.useGetAllMutation();
    // -----

    // Useful utils
    const [messageApi, messageContextHolder] = message.useMessage();
    const showWarningMsg = (msg: string) => {
        messageApi.warning(msg);
    };
    // -----

    // Effects
    useEffect(() => {
        getAllFilials();
        getReasons();
    }, []);
    useEffect(() => {
        if (selectedFilialId)
            getAllHotels({filialId: selectedFilialId.toString()});
        setSelectedHotelId(null);
        setResponsibilityId(null);
    }, [selectedFilialId]);
    useEffect(() => {
        if (selectedHotelId)
            getAllResponsibility(selectedHotelId);
        setResponsibilityId(null);
    }, [selectedHotelId]);
    // -----

    // Handlers
    const switchIsOrganizationHandler = (e: CheckboxChangeEvent) => {
        setIsOrganization(e.target.checked);
    };
    const switchIsGuestCountModeHandler = (e: CheckboxChangeEvent) => {
        setIsGuestCountMode(e.target.checked);
    };
    const selectReasonHandler = (idList: number[]) => {
        setSelectedReasonList(idList);
    }
    const selectAllReasonsHandler = () => {
        if (reasons) {
            setSelectedReasonList(reasons.map((reason: ReasonModel) => reason.id));
        }
    }
    // -----

    return (
        <Modal title={"Реестр внутрихозяйственных работ"}
               open={props.visible}
               maskClosable={false}
               loading={(isFilialsLoading)}
               onOk={() => {
                   showWarningMsg("Отчет начал формироваться");
                   let tmpButton = document.createElement('a');
                   if (dateRange && responsibilityId && selectedHotelId && selectedUkgBoss) {
                       if (isGuestCountMode)
                           tmpButton.href = `${host}/hotels/api/report/getReestrRabotErmakReport?reasonList=${selectedReasonList}&hotelId=${selectedHotelId}&responsibilityId=${responsibilityId}&dateStart=${dateRange[0].format("DD-MM-YYYY")}&dateFinish=${dateRange[1].format("DD-MM-YYYY")}&ukgBoss=${selectedUkgBoss.split(" ")[0]} ${selectedUkgBoss.split(" ")[1][0]}. ${selectedUkgBoss.split(" ")[2][0]}.&workType=Услуги по проживанию в общежитии&isOrganization=${isOrganization}`
                       else
                           tmpButton.href = `${host}/hotels/api/report/getReestrRabotReport?reasonList=${selectedReasonList}&hotelId=${selectedHotelId}&responsibilityId=${responsibilityId}&dateStart=${dateRange[0].format("DD-MM-YYYY")}&dateFinish=${dateRange[1].format("DD-MM-YYYY")}&ukgBoss=${selectedUkgBoss.split(" ")[0]} ${selectedUkgBoss.split(" ")[1][0]}. ${selectedUkgBoss.split(" ")[2][0]}.&workType=Услуги по проживанию в общежитии&isOrganization=${isOrganization}`
                       tmpButton.click();
                   }
               }}
               onCancel={() => props.setVisible(false)}
               okText={"Скачать"}
               width={'650px'}
        >
            {messageContextHolder}
            <Flex vertical={true} gap={'small'}>
                <Select
                    value={selectedFilialId}
                    placeholder={"Выберите филиал для выбора общежития"}
                    style={{width: '100%'}}
                    onChange={(e) => setSelectedFilialId(e)}
                    options={currentUser.roleId === 2 ?
                        filials?.filter((filial: FilialModel) => filial.id === currentUser.filialId).map((f: FilialModel) => ({value: f.id, label: f.name}))
                        :
                        filials?.filter((filial: FilialModel) => !filial.excluded).map((filial: FilialModel) => ({value: filial.id, label: filial.name}))
                    }
                    allowClear={true}
                    showSearch
                    filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}

                />
                <Select
                    loading={isHotelsLoading}
                    disabled={selectedFilialId === null || isHotelsLoading}
                    value={selectedHotelId}
                    placeholder={"Выберите МВЗ"}
                    style={{width: '100%'}}
                    onChange={(e) => setSelectedHotelId(e)}
                    options={hotels?.reduce((acc: HotelModel[], hotel) => {
                        if (!acc.find((h: HotelModel) => h.mvz === hotel.mvz)) {
                            return acc.concat([hotel]);
                        }
                        return acc;
                    }, []).map((hotel: HotelModel) => ({value: hotel.id, label: `${hotel.mvz} - ${hotel.name}`}))}
                    allowClear={true}
                    showSearch
                    filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                />
                <Flex style={{width: '100%'}} justify={'space-between'} align={'center'}>
                    <Select
                        mode={"multiple"}
                        loading={isReasonsLoading}
                        disabled={isReasonsLoading}
                        value={selectedReasonList}
                        placeholder={"Выберите основания"}
                        style={{width: '80%'}}
                        onChange={selectReasonHandler}
                        options={reasons?.map((reason: ReasonModel) => ({value: reason.id, label: reason.name}))}
                        allowClear={true}
                        showSearch
                        filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    />
                    <Button style={{width: '18%'}} onClick={selectAllReasonsHandler}>
                        Выбрать все
                    </Button>
                </Flex>
                <Select
                    loading={isResponsibilityLoading}
                    disabled={selectedHotelId === null || isResponsibilityLoading}
                    value={responsibilityId}
                    placeholder={"Выберите ответственного"}
                    style={{width: '100%'}}
                    onChange={(e) => setResponsibilityId(e)}
                    options={responsibilities?.map((responsibilityModel: ResponsibilityModel) => ({value: responsibilityModel.id, label: responsibilityModel.fio}))}
                    allowClear={true}
                    showSearch
                    filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                />
                <Select
                    value={selectedUkgBoss}
                    placeholder={"Выберите руководителя УКГ"}
                    style={{width: '100%'}}
                    onChange={(e) => setSelectedUkgBoss(e)}
                    options={ukgBosses.map((ukgBoss: string) => ({value: ukgBoss, label: ukgBoss}))}
                    allowClear={true}
                    showSearch
                    filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                />
                {/*//@ts-ignore*/}
                <RangePicker value={dateRange} format={"DD-MM-YYYY"} onChange={(e) => {
                    setDateRange(e as any)
                }} style={{width: 600}}/>
                <Flex align={"center"}>
                    <div style={{width: 230}}>По сторонним организациям</div>
                    <Checkbox checked={isOrganization} onChange={switchIsOrganizationHandler}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 230}}>Расчитать кол-во жильцов</div>
                    <Checkbox checked={isGuestCountMode} onChange={switchIsGuestCountModeHandler}
                    />
                </Flex>
            </Flex>
        </Modal>
    );
};
