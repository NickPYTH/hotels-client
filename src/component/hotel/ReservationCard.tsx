import {Button, Card, Flex, Popconfirm, Tag} from "antd";
import React, {useEffect} from "react";
import {GuestModel} from "../../model/GuestModel";
import {UserModel} from "../../model/UserModel";
import {reservationAPI} from "../../service/ReservationService";

type CardProps = {
    reservation: GuestModel,
    getFlat: Function,
    setSelectedReservation: Function,
    setVisibleReservationModal: Function
}
export const ReservationCard = (props:CardProps) => {

    // Web requests
    const [confirm, {
        data: response,
        isLoading: isConfirmLoading
    }] = reservationAPI.useConfirmMutation();
    const [deleteReservation, {
        data: deletedReservation,
        isLoading: isDeleteLoading
    }] = reservationAPI.useDeleteMutation();
    // -----

    // Effects
    useEffect(() => {
        if (response) props.getFlat();
    }, [response]);
    useEffect(() => {
        if (deletedReservation) props.getFlat();
    }, [deletedReservation]);
    // -----

    // Handlers
    const confirmHandler = () =>  {
        confirm(props.reservation.id);
    }
    const deleteHandler = () => {
        deleteReservation(props.reservation.id);
    }
    const openHandler = () => {
        props.setVisibleReservationModal(true);
        props.setSelectedReservation(props.reservation);
    }
    // -----

    return(
        <Card title={`${props.reservation.lastname ?? ""} ${props.reservation.firstname ? props.reservation.firstname[0]+"." : ""} ${props.reservation.secondName ? props.reservation.secondName[0]+".":""}`}
              bordered={true}
              style={{width: 340}}>
            <Tag style={{position: 'absolute', top: 8, right: 5}} color={'blue'}>Бронь #{props.reservation.id}</Tag>
            <div>
                Дата заселения: {props.reservation?.dateStart}
            </div>
            <div>
                Дата выселения: {props.reservation?.dateFinish}
            </div>
            <div>
                Место: {props.reservation?.bedName}
            </div>
            <Button disabled={isConfirmLoading} style={{marginTop: 5, width: 300}} onClick={openHandler}>Открыть карточку брони</Button>
            <Popconfirm title={"Вы точно хотите подтвердить бронь?"} onConfirm={confirmHandler}>
                <Button disabled={isConfirmLoading} style={{marginTop: 5, width: 300}}>Подтвердить бронь и добавить жильца</Button>
            </Popconfirm>
            <Popconfirm title={"Вы точно хотите удалить бронь?"} onConfirm={deleteHandler}>
                <Button danger disabled={isDeleteLoading} style={{marginTop: 5, width: 300}}>Удалить запись о бронировании</Button>
            </Popconfirm>
        </Card>
    )
}