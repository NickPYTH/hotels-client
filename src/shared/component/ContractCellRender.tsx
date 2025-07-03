import React, {useEffect, useState} from "react";
import {ContractModel} from "entities/ContractModel";
import dayjs from "dayjs";
import {Flex, Select} from "antd";
import {ReasonModel} from "entities/ReasonModel";
import {GuestModel} from "entities/GuestModel";

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
        setReason(reason ? reason : null);
        setSelectedContract(null);
        setContracts(props.contracts.filter((c: ContractModel) => (billing ? c.billing == billing : true) && (reason ? c.reason.id == reason.id : true)));
    }
    const selectBillingHandler = (billing: string) => {
        setBilling(billing);
        setSelectedContract(null);
        setContracts(props.contracts.filter((c: ContractModel) => (reason ? c.reason == reason : true) && (billing ? c.billing == billing : true)));
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
            allowClear
            value={reason ? reason.id : null}
            placeholder={"Основание"}
            style={{width: 200, margin: 3}}
            onChange={selectReasonHandler}
            options={props.contracts.reduce((acc:ContractModel[], contract:ContractModel) => {
                if (!acc.find((c:ContractModel) => c.reason.id == contract.reason.id)) return acc.concat(contract);
                return acc;
            }, []).map((c: ContractModel) => ({value: c.reason.id, label: c.reason.name}))}
        />
        <Select
            allowClear
            value={billing}
            placeholder={"Способо оплаты"}
            style={{width: 200, margin: 3}}
            onChange={selectBillingHandler}
            options={props.contracts.reduce((acc:ContractModel[], contract:ContractModel) => {
                if (!acc.find((c:ContractModel) => c.billing == contract.billing)) return acc.concat(contract);
                return acc;
            }, []).map((c: ContractModel) => ({value: c.billing, label: c.billing}))}
        />
        <Select
            allowClear
            value={selectedContract ? selectedContract.id : null}
            placeholder={"Договор"}
            style={{width: 200, margin: 3}}
            onChange={selectContractHandler}
            options={contracts.map((contractModel: ContractModel) => ({value: contractModel.id, label: `Год: ${contractModel.year} №: ${contractModel.docnum}`}))}
        />
    </Flex>
}
