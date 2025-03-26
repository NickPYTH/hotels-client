import React, {useEffect, useState} from "react";
import {ContractModel} from "../../model/ContractModel";
import dayjs from "dayjs";
import {Flex, Select} from "antd";
import {ReasonModel} from "../../model/ReasonModel";
import {GuestModel} from "../../model/GuestModel";

type ContractCellRenderProps = {
    reasons: ReasonModel[],
    contracts: ContractModel[],
    setGridData: Function,
    hotelId: number,
    selectedContract: ContractModel | null,
    tabnum: number | null,
}

export const ContractCellRender = (props:ContractCellRenderProps) => {

    // States
    const [reason, setReason] = useState<ReasonModel | null>(null); // Основание
    const [billing, setBilling] = useState<string | null>(null); // Вид оплаты
    const [contracts, setContracts] = useState<ContractModel[]>(props.contracts);  // Список доступных договоров
    const [selectedContract, setSelectedContract] = useState<ContractModel | null>(props.selectedContract); // Выбранного договора
    // -----

    // Effects
    useEffect(() => {
        if (props.selectedContract) {
            if (props.selectedContract.id && props.selectedContract.id != selectedContract?.id)
                selectContractHandler(props.selectedContract.id);
        }
    }, [props.selectedContract]);
    // -----

    // Handlers
    const selectReasonHandler = (reasonId: number) => {
        let reason = props.reasons.find((r: ReasonModel) => r.id == reasonId);
        if (reason) setReason(reason);
        setSelectedContract(null);
        setContracts(props.contracts.filter((c: ContractModel) => c.year == dayjs().year() && c.organization.id === 11 && c.hotel.id === props.hotelId && (billing ? c.billing == billing : true) && c.reason.id == reasonId));
    }
    const selectBillingHandler = (billing: string) => {
        setBilling(billing);
        setSelectedContract(null);
        setContracts(props.contracts.filter((c: ContractModel) => c.year == dayjs().year() && c.organization.id === 11 && c.hotel.id === props.hotelId && (reason ? c.reason == reason : true) && c.billing == billing));
    }
    const selectContractHandler = (contractId: number) => {
        let contract = contracts.find((c:ContractModel) => c.id == contractId);
        if (contract) {
            setBilling(contract.billing);
            setReason(contract.reason);
            setSelectedContract(contract);
        }
        props.setGridData((prev:GuestModel[]) => {
            let tmp: GuestModel[] = JSON.parse(JSON.stringify(prev));
            return tmp.map((guest: GuestModel) => guest.tabnum == props.tabnum ? {...guest, contract}:guest);
        });
    }
    // -----

    return <Flex vertical={true}>
        <Select
            value={reason ? reason.id : null}
            placeholder={"Основание"}
            style={{width: 200, margin: 3}}
            onChange={selectReasonHandler}
            options={props.reasons.map((r: ReasonModel) => ({value: r.id, label: r.name}))}
        />
        <Select
            value={billing}
            placeholder={"Способо оплаты"}
            style={{width: 200, margin: 3}}
            onChange={selectBillingHandler}
            options={[{value: "наличный расчет", label: "наличный расчет"}, {value: "безналичный расчет", label: "безналичный расчет"}]}
        />
        <Select
            value={selectedContract ? selectedContract.id : null}
            placeholder={"Договор"}
            style={{width: 200, margin: 3}}
            onChange={selectContractHandler}
            options={contracts.map((contractModel: ContractModel) => ({value: contractModel.id, label: `Год: ${contractModel.year} №: ${contractModel.docnum}`}))}
        />
    </Flex>
}
