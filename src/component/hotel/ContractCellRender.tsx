import React, {useEffect, useState} from "react";
import {ContractModel} from "../../model/ContractModel";
import dayjs from "dayjs";
import {Flex, Select} from "antd";
import {ReasonModel} from "../../model/ReasonModel";

type ContractCellRenderProps = {
    reasons: ReasonModel[],
    contracts: ContractModel[],
    setGridData: Function,
    hotelId: number,
    selectedContractId: number | null,
}

export const ContractCellRender = (props:ContractCellRenderProps) => {

    // States
    const [reason, setReason] = useState(null); // Основание
    const [billing, setBilling] = useState(null); // Вид оплаты
    const [contracts, setContracts] = useState<ContractModel[]>(props.contracts);  // Список доступных договоров
    const [selectedContractId, setSelectedContractId] = useState<number | null>(props.selectedContractId); // ИД выбранного договора
    // -----

    // Effects
    useEffect(() => {
        if (props.selectedContractId) selectContractHandler(props.selectedContractId);
    }, [props.selectedContractId]);
    // -----

    // Handlers
    const selectReasonHandler = (reason: string) => {
        setReason(reason);
        setSelectedContractId(null);
        setContracts(props.contracts.filter((c: ContractModel) => c.year == dayjs().year() && c.organizationId === 11 && c.hotelId === props.hotelId && (billing ? c.billing == billing : true) && c.reason == reason));
    }
    const selectBillingHandler = (billing: string) => {
        setBilling(billing);
        setSelectedContractId(null);
        setContracts(props.contracts.filter((c: ContractModel) => c.year == dayjs().year() && c.organizationId === 11 && c.hotelId === props.hotelId && (reason ? c.reason == reason : true) && c.billing == billing));

    }
    const selectContractHandler = (id: number) => {
        let contract = contracts.find((c:ContractModel) => c.id == id);
        setBilling(contract.billing);
        setReason(contract.reason);
        setSelectedContractId(id);
    }
    // -----

    return <Flex vertical={true}>
        <Select
            value={reason}
            placeholder={"Основание"}
            style={{width: 200, margin: 3}}
            onChange={selectReasonHandler}
            options={props.reasons.filter((r: ReasonModel) => r.isDefault).map((r: ReasonModel) => ({value: r.name, label: r.name}))}
        />
        <Select
            value={billing}
            placeholder={"Способо оплаты"}
            style={{width: 200, margin: 3}}
            onChange={selectBillingHandler}
            options={[{value: "наличный расчет", label: "наличный расчет"}, {value: "безналичный расчет", label: "безналичный расчет"}]}
        />
        <Select
            value={selectedContractId}
            placeholder={"Договор"}
            style={{width: 200, margin: 3}}
            onChange={selectContractHandler}
            options={contracts.map((contractModel: ContractModel) => ({value: contractModel.id, label: `Год: ${contractModel.year} №: ${contractModel.docnum}`}))}
        />
    </Flex>
}
