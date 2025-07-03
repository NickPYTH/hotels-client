import React, {useEffect, useState} from 'react';
import {Flex, Input, InputNumber, Modal} from 'antd';
import {ExtraModel} from "entities/ExtraModel";
import {extraAPI} from "service/ExtraService";

type ModalProps = {
    selectedExtra: ExtraModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
}
export const ExtraModal = (props: ModalProps) => {

        // States
        const [name, setName] = useState<string>("");
        const [description, setDescription] = useState<string>("");
        const [cost, setCost] = useState<number>(0);
        // -----

        // Web requests
        const [createExtra, {
            data: createdExtra,
            isLoading: isCreateExtraLoading
        }] = extraAPI.useCreateMutation();
        const [updateExtra, {
            data: updatedExtra,
            isLoading: isUpdateExtraLoading
        }] = extraAPI.useUpdateMutation();
        // -----

        // Effects
        useEffect(() => {
            if (props.selectedExtra) {
                setName(props.selectedExtra.name);
                setDescription(props.selectedExtra.description);
                setCost(props.selectedExtra.cost);
            }
        }, [props.selectedExtra]);
        useEffect(() => {
            if (createdExtra || updatedExtra) {
                props.setVisible(false);
                props.refresh();
            }
        }, [createdExtra, updatedExtra]);
        // -----

        // Handlers
        const confirmHandler = () => {
            if (name && cost) {
                let ExtraModel: ExtraModel = {
                    id: 0,
                    name,
                    description: description ?? "",
                    cost,
                    isPaid: false,
                    paymentType: null
                };
                if (props.selectedExtra) updateExtra({...ExtraModel, id: props.selectedExtra.id});
                else createExtra(ExtraModel);
            }
        }
        // -----

        return (
            <Modal title={props.selectedExtra ? "Редактирование дополнительной услуги" : "Создание новой услуги"}
                   open={props.visible}
                   loading={(isCreateExtraLoading || isUpdateExtraLoading)}
                   onOk={confirmHandler}
                   onCancel={() => props.setVisible(false)}
                   okText={props.selectedExtra ? "Сохранить" : "Создать"}
                   width={'450px'}
            >
                <Flex gap={'small'} vertical={true}>
                    <Flex align={"center"}>
                        <div style={{width: 180}}>Наимнование</div>
                        <Input value={name} onChange={(e) => setName(e.target.value)}/>
                    </Flex>
                    <Flex align={"center"}>
                        <div style={{width: 180}}>Описание</div>
                        <Input value={description} onChange={(e) => setDescription(e.target.value)}/>
                    </Flex>
                    <Flex align={"center"}>
                        <div style={{width: 180}}>Стоимость</div>
                        <InputNumber style={{width: '100%'}} value={cost} onChange={(e) => e ? setCost(e) : ""}/>
                    </Flex>
                </Flex>
            </Modal>
        );
    }
;
