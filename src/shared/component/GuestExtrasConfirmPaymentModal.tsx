import {Button, Flex, Modal, Select, Space} from "antd";
import React, {useEffect, useState} from "react";
import {ExtraModel} from "entities/ExtraModel";
import {extraAPI} from "service/ExtraService";
import {paymentTypeAPI} from "service/PaymentTypeService";

type PropsType = {
    refresh: Function,
    visible: boolean,
    setVisible: (visible: boolean) => void,
    extra: ExtraModel,
}

export const GuestExtrasConfirmPaymentModal = (props: PropsType) => {

    // States
    const [paymentType, setPaymentType] = useState<number | null>(null);
    // -----

    // Web requests
    const [confirmPayment, {
        isSuccess
    }] = extraAPI.useConfirmPaymentMutation();
    const [getAllPaymentTypes, {
        data: paymentTypes,
    }] = paymentTypeAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        getAllPaymentTypes();
    }, []);
    useEffect(() => {
        if (isSuccess) {
            props.setVisible(false);
            props.refresh(props.extra.guestId);
        }
    }, [isSuccess]);
    // -----

    // Handlers
    const confirmPaymentHandler = () => {

        if (paymentType && props.extra.guestId && paymentType) {
            confirmPayment({guestId: props.extra.guestId, extraId: props.extra.id, paymentTypeId: paymentType});
        }
    }
    // -----
    console.log(paymentType);
    return (
        <Modal title={"Выберите способ оплаты"}
               maskClosable={false}
               open={props.visible}
               onCancel={() => props.setVisible(false)}
               width={320}
               footer={(<></>)}
        >
            <Space direction="vertical" align='center'>
                <Flex align="center" justify="space-between">
                    <div style={{width: 120}}>Способ оплаты</div>
                    <Select
                        value={paymentType}
                        placeholder={"Выберите способ оплаты"}
                        style={{width: 150}}
                        onChange={(e) => setPaymentType(e)}
                        options={paymentTypes?.map((pt) => ({value: pt.id, label: pt.name}))}
                    />
                </Flex>
                <Button style={{width: 150}} onClick={confirmPaymentHandler}>Провести</Button>
            </Space>
        </Modal>
    )
}