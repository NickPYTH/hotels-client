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

type ModalProps = {
    selectedContract: ContractModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function,

}
export const ContractModal = (props: ModalProps) => {
    const [filial, setFilial] = useState<number | null>(null);
    const [hotel, setHotel] = useState<number | null>(null);
    const [organization, setOrganization] = useState<number | null>(null);
    const [reason, setReason] = useState<number | null>(null);
    const [billing, setBilling] = useState<string | null>(null);
    const [docnum, setDocnum] = useState<string>("");
    const [cost, setCost] = useState<number>(0);
    const [note, setNote] = useState<string>("");
    const [year, setYear] = useState<number>(2025);
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
    }] = contractAPI.useGetAllOrganizationMutation();
    const [getAllReasons, {
        isLoading: isGetAllReasonsLoading,
        data: reasons
    }] = reasonAPI.useGetAllMutation();
    useEffect(() => {
        getAllFilials();
        getAllOrganization();
        getAllReasons();
    }, []);
    useEffect(() => {
        if (filial) getAllHotels({filialId: filial.toString()});
        else setHotel(null);
    }, [filial])
    useEffect(() => {
        if (props.selectedContract) {
            setFilial(props.selectedContract.filialId);
            setHotel(props.selectedContract.hotelId);
            setOrganization(props.selectedContract.organizationId);
            setDocnum(props.selectedContract.docnum);
            setCost(props.selectedContract.cost);
            setNote(props.selectedContract.note);
            setBilling(props.selectedContract.billing ?? "");
            setYear(props.selectedContract.year);
            if (props.selectedContract.reasonId) setReason(props.selectedContract.reasonId);
        }
    }, [props.selectedContract]);
    useEffect(() => {
        if (createdContract || updatedContract) {
            props.setVisible(false);
            props.refresh();
        }

    }, [createdContract, updatedContract]);
    const confirmHandler = () => {
        console.log(filial && hotel && cost !== null && docnum && billing && reason)
        if (filial && hotel && cost !== null && docnum && billing && reason) {
            let contract: ContractModel = {
                cost,
                docnum,
                filialId: filial,
                filial: "",
                hotel: "",
                hotelId: hotel,
                id: 0,
                organization: "",
                organizationId: organization,
                note,
                billing: billing.toString(),
                reason: reason.toString(),
                year,
                roomNumber: props?.selectedContract?.roomNumber ?? null,
            };
            if (props.selectedContract) updateContract({...contract, id: props.selectedContract.id});
            else createContract(contract);
        }
    }
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
                    value={filial}
                    placeholder={"Выберите филиал"}
                    style={{width: '100%'}}
                    onChange={(e) => setFilial(e)}
                    options={filials?.map((f: FilialModel) => ({value: f.id, label: f.name}))}
                />
                <Select
                    disabled={filial === null || isGetAllHotelsLoading}
                    loading={isGetAllHotelsLoading}
                    value={hotel}
                    placeholder={"Выберите отель"}
                    style={{width: '100%'}}
                    onChange={(e) => setHotel(e)}
                    options={hotels?.map((f: HotelModel) => ({value: f.id, label: f.name}))}
                />
                <Select
                    disabled={isGetAllOrganizationsLoading}
                    loading={isGetAllOrganizationsLoading}
                    value={organization}
                    placeholder={"Выберите организцацию"}
                    style={{width: '100%'}}
                    onChange={(e) => setOrganization(e)}
                    options={organizations?.map((f: OrganizationModel) => ({value: f.id, label: f.name}))}
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
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Основание</div>
                    <Select
                        disabled={isGetAllReasonsLoading}
                        loading={isGetAllReasonsLoading}
                        value={reason}
                        placeholder={"Выберите основание"}
                        style={{width: '100%'}}
                        onChange={(e) => setReason(e)}
                        options={reasons?.map((f: ReasonModel) => ({value: f.id, label: f.name}))}
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
