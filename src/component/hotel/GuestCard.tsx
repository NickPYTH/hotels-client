import {Button, Card, Flex, Popconfirm} from "antd";
import React from "react";
import {GuestModel} from "../../model/GuestModel";
import {UserModel} from "../../model/UserModel";

type CardProps = {
    guest: GuestModel,
    isCheckoutLoading: boolean,
    isDeleteGuestLoading: boolean,
    setVisibleGuestModal: Function,
    setSelectedGuest: Function,
    setConfirmCheckoutReportVisible: Function,
    checkout: Function,
    currentUser: UserModel,
    deleteGuest: Function
}
export const GuestCard = (props:CardProps) => {
    return(
        <Card loading={props.isCheckoutLoading || props.isDeleteGuestLoading} title={`${props.guest.lastname} ${props.guest.firstname ? props.guest.firstname[0]+"." : ""} ${props.guest.secondName ? props.guest.secondName[0]+".":""}`}
              bordered={true}
              style={{width: 340}}>
            <div>
                Филиал: {props.guest?.filialEmployee}
            </div>
            <div>
                Должность: {props.guest?.post}
            </div>
            <div>
                Общая стоимость проживания: {props.guest?.cost}
            </div>
            <div>
                Стоимость проживания за ночь: {props.guest?.costByNight}
            </div>
            <div>
                Количество ночей: {props.guest?.daysCount}
            </div>
            <div>
                Дата заселения: {props.guest?.dateStart}
            </div>
            <div>
                Дата выселения: {props.guest?.dateFinish}
            </div>
            <div>
                Место: {props.guest?.bedName}
            </div>
            <Button style={{marginTop: 5, width: 280}} onClick={() => {
                props.setVisibleGuestModal(true);
                props.setSelectedGuest(props.guest);
            }}>Карточка жильца</Button>
            <Button style={{marginTop: 5, width: 280}} onClick={() => {
                props.setConfirmCheckoutReportVisible(true);
                props.setSelectedGuest(props.guest);
            }}>Отчетный документ</Button>
            {
                props.guest?.checkouted ?
                    <div style={{width: 280}}>
                        <Flex justify={'center'}>
                            <strong>Выселен</strong>
                        </Flex>
                    </div>
                    :
                    <Popconfirm title={"Вы уверены?"} okText={"Да"} onConfirm={() => {
                        props.checkout(props.guest.id);
                    }}>
                        <Button disabled={props.currentUser.roleId === 4 || props.currentUser.roleId === 3} style={{marginTop: 5, width: 280}} danger>Выселить</Button>
                    </Popconfirm>
            }
            <Popconfirm title={"Вы точно хотите удалить запись о проживани?"} okText={"Да"} onConfirm={() => {
                props.deleteGuest(props.guest.id);
            }}>
                <Button disabled={props.currentUser.roleId === 4 || props.currentUser.roleId === 3} style={{marginTop: 5, width: 280}} danger>Удалить запись о проживании</Button>
            </Popconfirm>
        </Card>
    )
}