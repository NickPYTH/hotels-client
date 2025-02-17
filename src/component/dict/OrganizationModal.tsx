import React, {useEffect, useState} from 'react';
import {Flex, Input, InputNumber, Modal, Select} from 'antd';
import {ContractModel} from "../../model/ContractModel";
import {contractAPI} from "../../service/ContractService";
import {filialAPI} from "../../service/FilialService";
import {FilialModel} from "../../model/FilialModel";
import {hotelAPI} from "../../service/HotelService";
import {HotelModel} from "../../model/HotelModel";
import {OrganizationModel} from "../../model/OrganizationModel";
import {organizationAPI} from "../../service/OrganizationService";

type ModalProps = {
    selectedOrganization: OrganizationModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
}
export const OrganizationModal = (props: ModalProps) => {
    const [name, setName] = useState<string>("");
    const [createOrganization, {
        data: createdOrganization,
        isLoading: isCreateOrganizationLoading
    }] = organizationAPI.useCreateMutation();
    const [updateOrganization, {
        data: updatedOrganization,
        isLoading: isUpdateOrganizationLoading
    }] = organizationAPI.useUpdateMutation();
    useEffect(() => {
        if (props.selectedOrganization) {
            setName(props.selectedOrganization.name);
        }
    }, [props.selectedOrganization]);
    useEffect(() => {
        if (createdOrganization || updatedOrganization) {
            props.setVisible(false);
            props.refresh();
        }
    }, [createdOrganization, updatedOrganization]);
    const confirmHandler = () => {
        if (name){
            let organization: OrganizationModel = {
                id: 0,
                name
            };
            if (props.selectedOrganization) updateOrganization({...organization, id: props.selectedOrganization.id});
            else createOrganization(organization);
        }
    }
    return (
        <Modal title={props.selectedOrganization ? "Редактирование организации" : "Создание организации"}
               open={props.visible}
               loading={(isCreateOrganizationLoading || isUpdateOrganizationLoading)}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={props.selectedOrganization ? "Сохранить" : "Создать"}
               width={'450px'}
        >
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 180}}>Наимнование</div>
                    <Input value={name} onChange={(e) => setName(e.target.value)}/>
                </Flex>
            </Flex>
        </Modal>
    );
};
