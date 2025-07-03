import React, {useEffect, useState} from 'react';
import {Flex, Input, Modal, Select} from 'antd';
import {FilialModel} from "entities/FilialModel";
import {filialAPI} from "service/FilialService";
import {MVZModel} from "entities/MVZModel";

type ModalProps = {
    selectedMVZ: MVZModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
}
export const MvzModal = (props: ModalProps) => {

    // States
    const [employeeTab, setEmployeeTab] = useState<string>("");
    const [employeeFio, setEmployeeFio] = useState<string>("");
    const [mvz, setMvz] = useState<string>("");
    const [mvzName, setMvzName] = useState<string>("");
    const [organization, setOrganization] = useState<string>("");
    const [selectedFilialId, setSelectedFilialId] = useState<string | null>(null);
    // -----

    // Web requests
    const [getAllFilials, {
        data: filials,
        isLoading: isFilialsLoading
    }] = filialAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        getAllFilials();
    }, []);
    useEffect(() => {
        if (props.selectedMVZ) {
            setEmployeeTab(props.selectedMVZ.employeeTab);
            setEmployeeFio(props.selectedMVZ.employeeFio);
            setMvz(props.selectedMVZ.mvz);
            setMvzName(props.selectedMVZ.mvzName);
            setOrganization(props.selectedMVZ.organization);
            setSelectedFilialId(props.selectedMVZ.filial);
        }
    }, [props.selectedMVZ])
    // -----

    return (
        <Modal title={props.selectedMVZ ? "Редактирование МВЗ" : "Создание МВЗ"}
               open={props.visible}
               footer={() => (<></>)}
               onCancel={() => props.setVisible(false)}
               okText={props.selectedMVZ ? "Сохранить" : "Создать"}
               width={'670px'}
        >
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Таб. номер проживающего</div>
                    <Input value={employeeTab} onChange={(e) => setEmployeeTab(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>ФИО</div>
                    <Input value={employeeFio} onChange={(e) => setEmployeeFio(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>МВЗ</div>
                    <Input value={mvz} onChange={(e) => setMvz(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Наименование МВЗ</div>
                    <Input value={mvzName} onChange={(e) => setMvzName(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Филиал работника</div>
                    <Select
                        loading={isFilialsLoading}
                        value={selectedFilialId}
                        placeholder={"Выберите филиал"}
                        style={{width: '100%'}}
                        onChange={(e) => setSelectedFilialId(e)}
                        options={filials?.map((filial: FilialModel) => ({value: filial.id, label: filial.name}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Организация</div>
                    <Input value={organization} onChange={(e) => setOrganization(e.target.value)}/>
                </Flex>
            </Flex>
        </Modal>
    );
};
