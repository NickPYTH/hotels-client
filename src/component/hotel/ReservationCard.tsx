import {Button, Card, Flex, Popconfirm, Tag} from "antd";
import React, {useEffect} from "react";
import {GuestModel} from "../../model/GuestModel";
import {UserModel} from "../../model/UserModel";
import {reservationAPI} from "../../service/ReservationService";

type CardProps = {
    guest: GuestModel,
    getFlat: Function
}
export const ReservationCard = (props:CardProps) => {

    // Web requests
    const [confirm, {
        data: response,
        isLoading: isConfirmLoading
    }] = reservationAPI.useConfirmMutation();
    // -----

    // Effects
    useEffect(() => {
        if (response) props.getFlat();
    }, [response]);
    // -----

    // Handlers
    const confirmHandler = () =>  {
        confirm(props.guest.id);
    }
    // -----

    return(
        <Card title={`${props.guest.lastname} ${props.guest.firstname[0]}. ${props.guest.secondName[0]}.`}
              bordered={true}
              style={{width: 340}}>
            <Tag style={{position: 'absolute', top: 8, right: 5}} color={'blue'}>Бронь #{props.guest.id}</Tag>
            <div>
                Дата заселения: {props.guest?.dateStart}
            </div>
            <div>
                Дата выселения: {props.guest?.dateFinish}
            </div>
            <div>
                Место: {props.guest?.bedName}
            </div>
            <Popconfirm title={"Вы точно хотите подтвердить бронь?"} onConfirm={confirmHandler}>
                <Button disabled={isConfirmLoading} style={{marginTop: 5}} type={'primary'}>Подтвердить бронь и добавить жильца</Button>
            </Popconfirm>
        </Card>
    )
}