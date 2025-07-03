import React, {useEffect, useState} from 'react';
import {Checkbox, DatePicker, Divider, Flex, message, Modal, Select} from 'antd';
import {FilialModel} from "entities/FilialModel";
import {filialAPI} from "service/FilialService";
import {ReasonModel} from "entities/ReasonModel";
import {reasonAPI} from "service/ReasonService";
import {responsibilityAPI} from "service/ResponsibilityService";
import {ResponsibilityModel} from "entities/ResponsibilityModel";
import {Dayjs} from "dayjs";
import {hotelAPI} from "service/HotelService";
import {HotelModel} from "entities/HotelModel";
import {useSelector} from "react-redux";
import {RootStateType} from "store/store";
import {host, uttistCehs} from "shared/config/constants";
import {OrganizationModel} from "entities/OrganizationModel";
import {organizationAPI} from "service/OrganizationService";

const {RangePicker} = DatePicker;

type ModalProps = {
    visible: boolean,
    setVisible: Function,
}
export const ReportMonthModal = (props: ModalProps) => {

    // States
    const currentUser = useSelector((state: RootStateType) => state.currentUser.user);
    const [orgMode, setOrgMode] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<Dayjs[] | null>(null);
    const [selectedEmpFilialId, setSelectedEmpFilialId] = useState<number | null>(null);
    const [selectedCehId, setSelectedCehId] = useState<number | null>(null);
    const [selectedOrganizationsId, setSelectedOrganizationsId] = useState<number | null>(null);
    const [selectedFilialId, setSelectedFilialId] = useState<number | null>(null);
    const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
    const [reasonId, setReasonId] = useState<number | null>(null);
    const [billing, setBilling] = useState<string>("безналичный расчет");
    const [responsibilityId, setResponsibilityId] = useState<number | null>(null);
    const [messageApi, messageContextHolder] = message.useMessage();
    // -----

    const showWarningMsg = (msg: string) => {
        messageApi.warning(msg);
    };

    const [getAllOrganizations, {
        data: organizations,
        isLoading: isOrganizationsLoading
    }] = organizationAPI.useGetAllMutation();
    const [getAllFilials, {
        data: filials,
        isLoading: isFilialsLoading
    }] = filialAPI.useGetAllMutation();
    const [getAllHotels, {
        data: hotels,
        isLoading: isHotelsLoading
    }] = hotelAPI.useGetAllByFilialIdMutation();
    const [getAllReasons, {
        data: reasons,
        isLoading: isReasonsLoading
    }] = reasonAPI.useGetAllMutation();
    const [getAllResponsibility, {
        data: responsibilities,
        isLoading: isResponsibilityLoading
    }] = responsibilityAPI.useGetAllByHotelIdMutation();
    useEffect(() => {
        getAllFilials();
        getAllReasons();
        getAllOrganizations();
    }, []);
    useEffect(() => {
        if (selectedFilialId) getAllHotels({filialId: selectedFilialId.toString()});
        else {
            setSelectedHotelId(null);
            setResponsibilityId(null);
        }
    }, [selectedFilialId]);
    useEffect(() => {
        if (selectedHotelId) getAllResponsibility(selectedHotelId);
    }, [selectedHotelId])
    return (
        <Modal title={"Реестр работников филиала"}
               open={props.visible}
               maskClosable={false}
               loading={(isFilialsLoading || isReasonsLoading || isOrganizationsLoading)}
               onOk={() => {
                   showWarningMsg("Отчет начал формироваться");
                   if (orgMode) {
                       let tmpButton = document.createElement('a');
                       if (dateRange && selectedOrganizationsId && responsibilityId && reasonId)
                           tmpButton.href = `${host}/hotels/api/report/getMonthReportByOrganization?organizationId=${selectedOrganizationsId}&responsibilityId=${responsibilityId}&reasonId=${reasonId}&dateStart=${dateRange[0].format("DD-MM-YYYY")}&dateFinish=${dateRange[1].format("DD-MM-YYYY")}&billing=${billing}`
                       tmpButton.click();
                   } else {
                       let tmpButton = document.createElement('a');
                       if (dateRange && selectedEmpFilialId && responsibilityId && reasonId) {
                           if (selectedCehId != null)
                               tmpButton.href = `${host}/hotels/api/report/getMonthReportByUttist?empFilialId=${selectedEmpFilialId}&responsibilityId=${responsibilityId}&reasonId=${reasonId}&dateStart=${dateRange[0].format("DD-MM-YYYY")}&dateFinish=${dateRange[1].format("DD-MM-YYYY")}&billing=${billing}&ceh=${uttistCehs?.find((ceh: any) => ceh.id === selectedCehId)?.name}`
                           else
                               tmpButton.href = `${host}/hotels/api/report/getMonthReportByFilial?empFilialId=${selectedEmpFilialId}&responsibilityId=${responsibilityId}&reasonId=${reasonId}&dateStart=${dateRange[0].format("DD-MM-YYYY")}&dateFinish=${dateRange[1].format("DD-MM-YYYY")}&billing=${billing}`
                       }
                       tmpButton.click();

                   }
               }}
               onCancel={() => props.setVisible(false)}
               okText={"Скачать"}
               width={'450px'}
        >
            {messageContextHolder}
            <Flex vertical={true} gap={'small'}>
                {!orgMode ?
                    <>
                        <Select
                            value={selectedEmpFilialId}
                            placeholder={"Выберите филиал работников"}
                            style={{width: '100%'}}
                            onChange={(e) => setSelectedEmpFilialId(e)}
                            options={filials?.map((filial: FilialModel) => ({value: filial.id, label: filial.name}))}
                            allowClear={true}
                            showSearch
                            filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                            filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}

                        />
                        {selectedEmpFilialId === 928 &&
                            <Select
                                value={selectedCehId}
                                placeholder={"Вы можете выьрать цех (НЕОБЯЗАТЕЛЬНО)"}
                                style={{width: '100%'}}
                                onChange={(e) => setSelectedCehId(e)}
                                options={uttistCehs?.map((filial: FilialModel) => ({value: filial.id, label: filial.name}))}
                                allowClear={true}
                                showSearch
                                filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                                filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                            />
                        }
                    </>
                    :
                    <Select
                        value={selectedOrganizationsId}
                        placeholder={"Выберите организацию работников"}
                        style={{width: '100%'}}
                        onChange={(e) => setSelectedOrganizationsId(e)}
                        options={organizations?.map((org: OrganizationModel) => ({value: org.id, label: org.name}))}
                        allowClear={true}
                        showSearch
                        filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    />
                }
                <Flex align={"center"}>
                    <div style={{width: 250}}>Выбор сторонних организаций</div>
                    <Checkbox onChange={(e) => setOrgMode(e.target.checked)} checked={orgMode}/>
                </Flex>
                <Divider/>
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
                    placeholder={"Выберите общежитие"}
                    style={{width: '100%'}}
                    onChange={(e) => setSelectedHotelId(e)}
                    options={hotels?.map((hotel: HotelModel) => ({value: hotel.id, label: hotel.name}))}
                    allowClear={true}
                    showSearch
                    filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                />
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
                    loading={isReasonsLoading}
                    value={reasonId}
                    placeholder={"Выберите основание"}
                    style={{width: '100%'}}
                    onChange={(e) => setReasonId(e)}
                    options={reasons?.map((reasonModel: ReasonModel) => ({value: reasonModel.id, label: reasonModel.name}))}
                    allowClear={true}
                    showSearch
                    filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                />
                <Select
                    allowClear={false}
                    value={billing}
                    placeholder={"Выберите способ оплаты"}
                    style={{width: '100%'}}
                    onChange={(e) => setBilling(e)}
                    options={[{value: "наличный расчет", label: "наличный расчет"}, {value: "безналичный расчет", label: "безналичный расчет"}]}
                />
                {/*//@ts-ignore*/}
                <RangePicker value={dateRange} format={"DD-MM-YYYY"} onChange={(e) => {
                    setDateRange(e as any)
                }} style={{width: 400}}/>
            </Flex>
        </Modal>
    );
};
