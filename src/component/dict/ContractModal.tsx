import React, {useEffect, useState} from 'react';
import {Flex, Input, InputNumber, Modal, Select} from 'antd';
import {ContractModel} from "../../model/ContractModel";
import {contractAPI} from "../../service/ContractService";
import {filialAPI} from "../../service/FilialService";
import {FilialModel} from "../../model/FilialModel";
import {hotelAPI} from "../../service/HotelService";
import {HotelModel} from "../../model/HotelModel";
import {OrganizationModel} from "../../model/OrganizationModel";
import {reasonAPI} from "../../service/ReasonService";
import {ReasonModel} from "../../model/ReasonModel";
import {organizationAPI} from "../../service/OrganizationService";

type ModalProps = {
    selectedContract: ContractModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function,

}
export const ContractModal = (props: ModalProps) => {

    // States
    const [filial, setFilial] = useState<FilialModel | null>(null);
    const [hotel, setHotel] = useState<HotelModel | null>(null);
    const [organization, setOrganization] = useState<OrganizationModel | null>(null);
    const [reason, setReason] = useState<ReasonModel | null>(null);
    const [billing, setBilling] = useState<string | null>(null);
    const [docnum, setDocnum] = useState<string>("");
    const [cost, setCost] = useState<number>(0);
    const [note, setNote] = useState<string>("");
    const [year, setYear] = useState<number>(2025);
    // -----

    // Web requests
    const [createContract, {
        data: createdContract,
        isLoading: isCreateContractLoading
    }] = contractAPI.useCreateMutation();
    const [updateContract, {
        data: updatedContract,
        isLoading: isUpdateContractLoading
    }] = contractAPI.useUpdateMutation();
    const [getAllFilials, {
        isLoading: isGetAllFilialsLoading,
        data: filials
    }] = filialAPI.useGetAllMutation();
    const [getAllHotels, {
        isLoading: isGetAllHotelsLoading,
        data: hotels
    }] = hotelAPI.useGetAllByFilialIdMutation();
    const [getAllOrganization, {
        isLoading: isGetAllOrganizationsLoading,
        data: organizations
    }] = organizationAPI.useGetAllMutation();
    const [getAllReasons, {
        isLoading: isGetAllReasonsLoading,
        data: reasons
    }] = reasonAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        getAllFilials();
        getAllOrganization();
        getAllReasons();
    }, []);
    useEffect(() => {
        if (filial) getAllHotels({filialId: filial.id.toString()});
        else setHotel(null);
    }, [filial])
    useEffect(() => {
        if (props.selectedContract) {
            setFilial(props.selectedContract.filial);
            setHotel(props.selectedContract.hotel);
            setOrganization(props.selectedContract.organization);
            setDocnum(props.selectedContract.docnum);
            setCost(props.selectedContract.cost);
            setNote(props.selectedContract.note);
            setBilling(props.selectedContract.billing);
            setYear(props.selectedContract.year);
            setReason(props.selectedContract.reason);
        }
    }, [props.selectedContract]);
    useEffect(() => {
        if (createdContract || updatedContract) {
            props.setVisible(false);
            props.refresh();
        }

    }, [createdContract, updatedContract]);
    // -----

    // Handlers
    const selectFilialHandler = (filialId:number) => {
        let filial = filials.find((f:FilialModel) => f.id == filialId);
        setFilial(filial);
    }
    const selectHotelHandler = (hotelId:number) => {
        let hotel = hotels.find((h:HotelModel) => h.id == hotelId);
        setHotel(hotel);
    }
    const selectOrganizationHandler = (organizationId:number) => {
        let organization = organizations.find((o:OrganizationModel) => o.id == organizationId);
        setOrganization(organization);
    }
    const selectReasonHandler = (reasonId:number) => {
        let reason = reasons.find((r:ReasonModel) => r.id == reasonId);
        setReason(reason);
    }
    const confirmHandler = () => {
        if (filial && hotel && cost !== null && docnum && billing && reason) {
            let contract: ContractModel = {
                id: null,
                cost,
                docnum,
                filial,
                hotel,
                organization,
                note,
                billing,
                reason,
                year,
            };
            if (props.selectedContract) updateContract({...contract, id: props.selectedContract.id});
            else createContract(contract);
        }
    }
    // -----

    return (
        <Modal title={props.selectedContract ? "Редактирование договора" : "Создание договора"}
               open={props.visible}
               loading={(isCreateContractLoading || isUpdateContractLoading || isGetAllReasonsLoading)}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={props.selectedContract ? "Сохранить" : "Создать"}
               width={'450px'}
        >
            <Flex gap={'small'} vertical={true}>
                <Select
                    disabled={isGetAllFilialsLoading}
                    loading={isGetAllFilialsLoading}
                    value={filial ? filial.id : null}
                    placeholder={"Выберите филиал"}
                    style={{width: '100%'}}
                    onChange={selectFilialHandler}
                    options={filials?.map((f: FilialModel) => ({value: f.id, label: f.name}))}
                    allowClear={true}
                    showSearch
                    filterOption={(inputValue, option) =>  (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                />
                <Select
                    disabled={filial === null || isGetAllHotelsLoading}
                    loading={isGetAllHotelsLoading}
                    value={hotel ? hotel.id : null}
                    placeholder={"Выберите отель"}
                    style={{width: '100%'}}
                    onChange={selectHotelHandler}
                    options={hotels?.map((f: HotelModel) => ({value: f.id, label: f.name}))}
                    allowClear={true}
                    showSearch
                    filterOption={(inputValue, option) =>  (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                />
                <Select
                    disabled={isGetAllOrganizationsLoading}
                    loading={isGetAllOrganizationsLoading}
                    value={organization ? organization.id : null}
                    placeholder={"Выберите организцацию"}
                    style={{width: '100%'}}
                    onChange={selectOrganizationHandler}
                    options={organizations?.map((f: OrganizationModel) => ({value: f.id, label: f.name}))}
                    allowClear={true}
                    showSearch
                    filterOption={(inputValue, option) =>  (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                />
                <Flex align={"center"}>
                    <div style={{width: 180}}>Номер договора</div>
                    <Input value={docnum} onChange={(e) => setDocnum(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Стоимость</div>
                    <InputNumber min={0} style={{width: '100%'}} value={cost} onChange={(e) => {
                        if (e !== null) setCost(e);
                    }}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Примечание</div>
                    <Input value={note} onChange={(e) => setNote(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Вид расчета</div>
                    <Select
                        value={billing}
                        placeholder={"Выберите способо оплаты"}
                        onChange={(e) => setBilling(e)}
                        options={[{value: "наличный расчет", label: "наличный расчет"}, {value: "безналичный расчет", label: "безналичный расчет"}]}
                        style={{width: '100%'}}
                        allowClear={true}
                        showSearch
                        filterOption={(inputValue, option) =>  (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Основание</div>
                    <Select
                        disabled={isGetAllReasonsLoading}
                        loading={isGetAllReasonsLoading}
                        value={reason ? reason.id : null}
                        placeholder={"Выберите основание"}
                        style={{width: '100%'}}
                        onChange={selectReasonHandler}
                        options={reasons?.map((f: ReasonModel) => ({value: f.id, label: f.name}))}
                        allowClear={true}
                        showSearch
                        filterOption={(inputValue, option) =>  (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Год</div>
                    <InputNumber style={{width: '100%'}} value={year} onChange={(e) => setYear(e == null ? 2024 : e)}/>
                </Flex>
            </Flex>
        </Modal>
    );
};
