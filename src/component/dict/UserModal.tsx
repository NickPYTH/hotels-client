import React, {useEffect, useState} from 'react';
import {Button, Flex, Input, InputNumber, message, Modal, Select} from 'antd';
import {guestAPI} from "../../service/GuestService";
import {UserModel} from "../../model/UserModel";
import {userAPI} from "../../service/UserService";
import {filialAPI} from "../../service/FilialService";
import {FilialModel} from "../../model/FilialModel";
import {HotelModel} from "../../model/HotelModel";
import {hotelAPI} from "../../service/HotelService";

type ModalProps = {
    selectedUser: UserModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
}
export const UserModal = (props: ModalProps) => {
    const [messageApi, messageContextHolder] = message.useMessage();
    const [selectedFilialId, setSelectedFilialId] = useState<number | null>(null);
    const [selectedHotelIdList, setSelectedHotelIdList] = useState<number[] | null>(null);
    const [tabnum, setTabnum] = useState<number | null>(null);
    const [fio, setFio] = useState("");
    const [username, setUsername] = useState("");
    const [role, setRole] = useState<number | null>(null);
    const [createUser, {
        data: createdUser,
        isLoading: isCreateUserLoading
    }] = userAPI.useCreateMutation();
    const [updateUser, {
        data: updatedUser,
        isLoading: isUpdatedUserLoading
    }] = userAPI.useUpdateMutation();
    const [getFioByTabnum, {
        data: fioByTabnum,
        isLoading: isGetFioByTabnumLoading
    }] = guestAPI.useGetFioByTabnumMutation();
    const [getAllFilials, {
        data: filials,
        isLoading: isFilialsLoading
    }] = filialAPI.useGetAllMutation();
    const [getAllHotels, {
        data: hotels,
        isLoading: isHotelsLoading
    }] = hotelAPI.useGetAllByFilialIdMutation();
    useEffect(() => {
        getAllFilials();
    }, []);
    useEffect(() => {
        if (selectedFilialId)
            getAllHotels({filialId: selectedFilialId.toString()});
    }, [selectedFilialId]);
    useEffect(() => {
        if (fioByTabnum) {
            if (fioByTabnum.lastname && fioByTabnum.email) {
                setUsername(`sgp\\${fioByTabnum.email.split('@')[0]}`);
                setFio(fioByTabnum.lastname + " " + fioByTabnum.firstname + " " + fioByTabnum.secondName);
            }
        }
    }, [fioByTabnum]);
    useEffect(() => {
        if (props.selectedUser) {
            setFio(props.selectedUser.fio);
            setTabnum(props.selectedUser.tabnum);
            setUsername(props.selectedUser.username);
            setRole(props.selectedUser.roleId);
            if (props.selectedUser.hotels && props.selectedUser.filialId) {
                setSelectedFilialId(props.selectedUser.filialId);
                setSelectedHotelIdList(props.selectedUser.hotels);
            }
        }
    }, [props.selectedUser]);
    useEffect(() => {
        if (createdUser || updatedUser) {
            props.setVisible(false);
            props.refresh();
        }
    }, [createdUser, updatedUser]);
    const showWarningMsg = (msg: string) => {
        messageApi.warning(msg);
    };
    const confirmHandler = () => {
        if (role === 2 && selectedHotelIdList !== null) {
            if (selectedHotelIdList.length === 0) {
                showWarningMsg("Подответственные общежития не выбраны");
                return;
            }
        }
        if (tabnum && username && role) {
            if (props.selectedUser) {
                let user: UserModel = {
                    id: props.selectedUser.id,
                    username,
                    roleId: role,
                    fio,
                    tabnum,
                    filial: "",
                    roleName: "",
                    hotels: selectedHotelIdList ?? undefined
                };
                updateUser(user);
            } else {
                let user: UserModel = {
                    id: 0,
                    username,
                    roleId: role,
                    fio,
                    tabnum,
                    filial: "",
                    roleName: "",
                    hotels: selectedHotelIdList ?? undefined
                };
                createUser(user);
            }
        } else showWarningMsg("Некторрые поля остались пустыми")
    }
    return (
        <Modal title={props.selectedUser ? "Редактирование пользователя" : "Создание пользователя"}
               open={props.visible}
               loading={(isCreateUserLoading || isUpdatedUserLoading || isFilialsLoading)}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={props.selectedUser ? "Сохранить" : "Создать"}
               width={'690px'}
               maskClosable={false}
        >
            {messageContextHolder}
            <Flex gap={'small'} vertical={true}>
                <Flex align={"flex-start"}>
                    <div style={{width: 100}}>Табельный</div>
                    <InputNumber controls={false} disabled={isGetFioByTabnumLoading} style={{width: 300}} value={tabnum} onChange={(e) => setTabnum(e)}/>
                    <Button disabled={isGetFioByTabnumLoading} style={{marginLeft: 5}} onClick={() => {
                        if (tabnum) getFioByTabnum(tabnum);
                    }}>Найти</Button>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 120}}>ФИО</div>
                    <Input disabled={true} value={fio}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 120}}>Логин</div>
                    <Input disabled={!fio} value={username} onChange={(e) => setUsername(e.target.value)}/>
                </Flex>
                <Select
                    value={role}
                    placeholder={"Выберите роль"}
                    style={{width: '100%'}}
                    onChange={(e) => {
                        setSelectedFilialId(null);
                        setSelectedHotelIdList(null);
                        setRole(e);
                    }}
                    options={[{value: 1, label: "Администратор"}, {value: 2, label: "Дежурный"}, {value: 3, label: "Работник филиала"}, {value: 4, label: "Наблюдатель"}, {value: 5, label: "Работник ОСР"}]}
                />
                {(role && role === 2) &&
                    <>
                        <Select
                            disabled={isFilialsLoading}
                            value={selectedFilialId}
                            placeholder={"Выберите филиал"}
                            style={{width: '100%'}}
                            onChange={(e) => {
                                setSelectedFilialId(e);
                                setSelectedHotelIdList(null);
                            }}
                            options={filials?.map((filial: FilialModel) => ({value: filial.id, label: filial.name}))}
                        />
                        <Select
                            allowClear={true}
                            value={selectedHotelIdList}
                            mode={'multiple'}
                            loading={isHotelsLoading}
                            disabled={selectedFilialId === null || isHotelsLoading}
                            placeholder={"Выберите общежитие"}
                            style={{width: '100%'}}
                            onChange={(e) => setSelectedHotelIdList(e)}
                            options={hotels?.map((hotel: HotelModel) => ({value: hotel.id, label: hotel.name}))}
                        />
                    </>
                }
            </Flex>
        </Modal>
    );
};
