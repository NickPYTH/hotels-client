import React, {useEffect, useState} from 'react';
import {Button, Flex, Input, InputNumber, Modal, Select} from 'antd';
import {filialAPI} from "../../service/FilialService";
import {FilialModel} from "../../model/FilialModel";
import {hotelAPI} from "../../service/HotelService";
import {HotelModel} from "../../model/HotelModel";
import {ResponsibilityModel} from "../../model/ResponsibilityModel";
import {responsibilityAPI} from "../../service/ResponsibilityService";
import {guestAPI} from "../../service/GuestService";

type ModalProps = {
    selected: ResponsibilityModel | null,
    visible: boolean,
    setVisible: Function,
    refresh: Function
}
export const ResponsibilityModal = (props: ModalProps) => {

    // States
    const [tabnum, setTabnum] = useState<number | null>(null);
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [secondName, setSecondName] = useState("");
    const [selectedFilialId, setSelectedFilialId] = useState<number | null>(null);
    const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
    // -----

    // Web requests
    const [create, {
        data: created,
        isLoading: isCreateLoading
    }] = responsibilityAPI.useCreateMutation();
    const [update, {
        data: updated,
        isLoading: isUpdateLoading
    }] = responsibilityAPI.useUpdateMutation();
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
    // -----

    // Effects
    useEffect(() => {
        if (props.selected) {
            setTabnum(props.selected.tabnum);
            getFioByTabnum(props.selected.tabnum);
            setSelectedHotelId(props.selected.hotelId);
            setSelectedFilialId(props.selected.filialId);
            getAllHotels({filialId: props.selected.hotelId.toString()});
        }
    }, [props.selected]);
    useEffect(() => {
        getAllFilials();
    }, []);
    useEffect(() => {
        if (created || updated) {
            props.setVisible(false);
            props.refresh();
        }
    }, [created, updated]);
    useEffect(() => {
        if (fioByTabnum) {
            setFirstname(fioByTabnum.firstname);
            setLastname(fioByTabnum.lastname);
            setSecondName(fioByTabnum.secondName);
        }
    }, [fioByTabnum]);
    useEffect(() => {
        if (selectedFilialId)
            getAllHotels({filialId: selectedFilialId.toString()});
    }, [selectedFilialId]);
    // -----

    // Handlers
    const confirmHandler = () => {
        if (tabnum && selectedHotelId) {
            let responsibilityModel: ResponsibilityModel = {
                id: 0,
                tabnum,
                employeeId: 0,
                filial: '',
                filialId: 0,
                fio: '',
                hotelId: selectedHotelId,
                hotel: ''
            };
            if (props.selected) update({...responsibilityModel, id: props.selected.id});
            else create(responsibilityModel);
        }
    };
    // -----

    return (
        <Modal title={props.selected ? "Редактирование" : "Создание"}
               open={props.visible}
               loading={(isCreateLoading || isUpdateLoading || isFilialsLoading)}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={props.selected ? "Сохранить" : "Создать"}
               width={'450px'}
        >
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Табельный</div>
                    <InputNumber disabled={isGetFioByTabnumLoading} style={{width: 450}} value={tabnum} onChange={(e) => {
                        if (e)
                            setTabnum(e);
                    }}/>
                    <Button disabled={isGetFioByTabnumLoading} style={{marginLeft: 5}} onClick={() => {
                        if (tabnum) getFioByTabnum(tabnum);
                    }}>Найти</Button>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 146}}>Фамилия</div>
                    <Input disabled={true} value={lastname} onChange={(e) => setLastname(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 146}}>Имя</div>
                    <Input disabled={true} value={firstname} onChange={(e) => setFirstname(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 146}}>Отчество</div>
                    <Input disabled={true} value={secondName} onChange={(e) => setSecondName(e.target.value)}/>
                </Flex>
                <Select
                    value={selectedFilialId}
                    placeholder={"Выберите филиал"}
                    style={{width: '100%'}}
                    onChange={(e) => setSelectedFilialId(e)}
                    options={filials?.map((filial: FilialModel) => ({value: filial.id, label: filial.name}))}
                />
                <Select
                    value={selectedHotelId}
                    loading={isHotelsLoading}
                    placeholder={"Выберите общежитие"}
                    style={{width: '100%'}}
                    onChange={(e) => setSelectedHotelId(e)}
                    options={hotels?.map((hotel: HotelModel) => ({value: hotel.id, label: hotel.name}))}
                />
            </Flex>
        </Modal>
    );
};
