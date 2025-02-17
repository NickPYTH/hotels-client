import {Divider, Flex, Popconfirm} from "antd";
import "../component/customPaint/customPaint.scss";
import {FlatModel} from "../model/FlatModel";
import {RoomModel} from "../model/RoomModel";
import {GuestModel} from "../model/GuestModel";
//@ts-ignore
import ThirdFloor from "../assets/thirdFloorMap.png";
import {Dayjs} from "dayjs";
import {FlatModal} from "../component/hotel/FlatModal";
import React, {useState} from "react";

type ModalProps = {
    flats: FlatModel[],
    visibleFlatModal: boolean,
    setFlatModalVisible: Function,
    date: Dayjs,
    setSelectedFlatId: Function,
    selectedFlatId: number
}

export const CustomPaintScreen = (props: ModalProps) => {


    return (
        <div style={{height: 820, width: window.innerWidth}}>
            {props.selectedFlatId &&
                <FlatModal date={props.date} flatId={props.selectedFlatId} visible={props.visibleFlatModal} setVisible={props.setFlatModalVisible}/>
            }
            <Flex align="start" justify="start">
                <div style={{height: 330, width: 1200, marginTop: 250}}>
                    <img width={'100%'} height={'100%'} src={ThirdFloor}/>
                    {/*Комната 301*/}
                    <div className={'line line301'}></div>
                    <div className={'card card301'}>
                        <div>№ 301</div>
                        <div>S = 20,2 кв.м.</div>
                        <div>2 к/места</div>
                        <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "301")?.rooms.map((room: RoomModel) => {
                            return room.guests.map((guest: GuestModel) => (
                                <>
                                    <div>{guest.lastname} {guest.firstname[0]}. {guest.secondName[0]}.</div>
                                    <div>{guest.post}</div>
                                    <div>{guest.filialEmployee}</div>
                                </>
                            ))
                        })
                        }
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "301")?.note &&
                            <>
                                <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                                {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "301")?.note}
                            </>
                        }
                    </div>
                    <Popconfirm okText={'Да'} title={"Открыть карточку комнаты?"} onConfirm={() => {
                        props.setSelectedFlatId(props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "301")?.id ?? null);
                        props.setFlatModalVisible(true);
                    }}>
                        <div className={"room room301 room-vacant-color"}></div>
                    </Popconfirm>
                    {/*Комната 302*/}
                    <div className={'line line302'}></div>
                    <div className={'card card302'}>
                        <div>№ 302</div>
                        <div>S = 21,5 кв.м.</div>
                        <div>2 к/места</div>
                        <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "302")?.rooms.map((room: RoomModel) => {
                            return room.guests.map((guest: GuestModel) => (
                                <>
                                    <div>{guest.lastname} {guest.firstname[0]}. {guest.secondName[0]}.</div>
                                </>
                            ))
                        })
                        }
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "302")?.note &&
                            <>
                                <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                                {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "302")?.note}
                            </>
                        }
                    </div>
                    <Popconfirm okText={'Да'} title={"Открыть карточку комнаты?"} onConfirm={() => {
                        props.setSelectedFlatId(props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "302")?.id ?? null);
                        props.setFlatModalVisible(true);
                    }}>
                        <div className={"room room302 room-vacant-color"}></div>
                    </Popconfirm>
                    {/*Комната 303*/}
                    <div className={'line line303'}></div>
                    <div className={'card card303'}>
                        <div>№ 303</div>
                        <div>S = 31,3 кв.м.</div>
                        <div>2 к/места</div>
                        <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "303")?.rooms.map((room: RoomModel) => {
                            return room.guests.map((guest: GuestModel) => (
                                <>
                                    <div>{guest.lastname} {guest.firstname[0]}. {guest.secondName[0]}.</div>
                                </>
                            ))
                        })
                        }
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "303")?.note &&
                            <>
                                <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                                {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "303")?.note}
                            </>
                        }
                    </div>
                    <Popconfirm okText={'Да'} title={"Открыть карточку комнаты?"} onConfirm={() => {
                        props.setSelectedFlatId(props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "303")?.id ?? null);
                        props.setFlatModalVisible(true);
                    }}>
                        <div className={"room room303 room-vacant-color"}></div>
                    </Popconfirm>
                    {/*Комната 304*/}
                    <div className={'line line304'}></div>
                    <div className={'card card304'}>
                        <div>№ 304</div>
                        <div>S = 33,7 кв.м.</div>
                        <div>2 к/места</div>
                        <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "304")?.rooms.map((room: RoomModel) => {
                            return room.guests.map((guest: GuestModel) => (
                                <>
                                    <div>{guest.lastname} {guest.firstname[0]}. {guest.secondName[0]}.</div>
                                </>
                            ))
                        })
                        }
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "304")?.note &&
                            <>
                                <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                                {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "304")?.note}
                            </>
                        }
                    </div>
                    <Popconfirm okText={'Да'} title={"Открыть карточку комнаты?"} onConfirm={() => {
                        props.setSelectedFlatId(props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "304")?.id ?? null);
                        props.setFlatModalVisible(true);
                    }}>
                        <div className={"room room304 room-vacant-color"}></div>
                    </Popconfirm>
                    {/*Комната 305*/}
                    <div className={'line line305'}></div>
                    <div className={'card card305'}>
                        <div>№ 305</div>
                        <div>S = 26,8 кв.м.</div>
                        <div>2 к/места</div>
                        <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "305")?.rooms.map((room: RoomModel) => {
                            return room.guests.map((guest: GuestModel) => (
                                <>
                                    <div>{guest.lastname} {guest.firstname[0]}. {guest.secondName[0]}.</div>
                                </>
                            ))
                        })
                        }
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "305")?.note &&
                            <>
                                <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                                {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "305")?.note}
                            </>
                        }
                    </div>
                    <Popconfirm okText={'Да'} title={"Открыть карточку комнаты?"} onConfirm={() => {
                        props.setSelectedFlatId(props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "305")?.id ?? null);
                        props.setFlatModalVisible(true);
                    }}>
                        <div className={"room room305 room-vacant-color"}></div>
                    </Popconfirm>
                    {/*Комната 313-1*/}
                    <div className={'line line313'}></div>
                    <div className={'card card313'}>
                        <div>№ 313</div>
                        <div>S = 38,3 кв.м.</div>
                        <div>2 к/места</div>
                        <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "313")?.rooms.map((room: RoomModel) => {
                            return room.guests.map((guest: GuestModel) => (
                                <>
                                    <div>{guest.lastname} {guest.firstname[0]}. {guest.secondName[0]}.</div>
                                </>
                            ))
                        })
                        }
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "313")?.note &&
                            <>
                                <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                                {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "313")?.note}
                            </>
                        }
                    </div>
                    <Popconfirm okText={'Да'} title={"Открыть карточку комнаты?"} onConfirm={() => {
                        props.setSelectedFlatId(props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "313-1")?.id ?? null);
                        props.setFlatModalVisible(true);
                    }}>
                        <div className={"room room313-1 room-vacant-color"}></div>
                    </Popconfirm>
                    <Popconfirm okText={'Да'} title={"Открыть карточку комнаты?"} onConfirm={() => {
                        props.setSelectedFlatId(props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "313-2")?.id ?? null);
                        props.setFlatModalVisible(true);
                    }}>
                        <div className={"room room313-2 room-vacant-color"}></div>
                    </Popconfirm>
                    {/*Комната 312*/}
                    <div className={'line line312'}></div>
                    <div className={'card card312'}>
                        <div>№ 312</div>
                        <div>S = 31,8 кв.м.</div>
                        <div>2 к/места</div>
                        <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "312")?.rooms.map((room: RoomModel) => {
                            return room.guests.map((guest: GuestModel) => (
                                <>
                                    <div>{guest.lastname} {guest.firstname[0]}. {guest.secondName[0]}.</div>
                                </>
                            ))
                        })
                        }
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "312")?.note &&
                            <>
                                <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                                {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "312")?.note}
                            </>
                        }
                    </div>
                    <Popconfirm okText={'Да'} title={"Открыть карточку комнаты?"} onConfirm={() => {
                        props.setSelectedFlatId(props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "312")?.id ?? null);
                        props.setFlatModalVisible(true);
                    }}>
                        <div className={"room room312 room-vacant-color"}></div>
                    </Popconfirm>
                    {/*Комната 311*/}
                    <div className={'line line311'}></div>
                    <div className={'card card311'}>
                        <div>№ 311</div>
                        <div>S = 32,1 кв.м.</div>
                        <div>2 к/места</div>
                        <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "311")?.rooms.map((room: RoomModel) => {
                            return room.guests.map((guest: GuestModel) => (
                                <>
                                    <div>{guest.lastname} {guest.firstname[0]}. {guest.secondName[0]}.</div>
                                </>
                            ))
                        })
                        }
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "311")?.note &&
                            <>
                                <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                                {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "311")?.note}
                            </>
                        }
                    </div>
                    <Popconfirm okText={'Да'} title={"Открыть карточку комнаты?"} onConfirm={() => {
                        props.setSelectedFlatId(props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "311")?.id ?? null);
                        props.setFlatModalVisible(true);
                    }}>
                        <div className={"room room311 room-vacant-color"}></div>
                    </Popconfirm>
                    {/*Комната 310*/}
                    <div className={'line line310'}></div>
                    <div className={'card card310'}>
                        <div>№ 310</div>
                        <div>S = 30,1 кв.м.</div>
                        <div>1 к/места</div>
                        <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "310")?.rooms.map((room: RoomModel) => {
                            return room.guests.map((guest: GuestModel) => (
                                <>
                                    <div>{guest.lastname} {guest.firstname[0]}. {guest.secondName[0]}.</div>
                                </>
                            ))
                        })
                        }
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "310")?.note &&
                            <>
                                <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                                {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "310")?.note}
                            </>
                        }
                    </div>
                    <Popconfirm okText={'Да'} title={"Открыть карточку комнаты?"} onConfirm={() => {
                        props.setSelectedFlatId(props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "310")?.id ?? null);
                        props.setFlatModalVisible(true);
                    }}>
                        <div className={"room room310 room-vacant-color"}></div>
                    </Popconfirm>
                    {/*Комната 309*/}
                    <div className={'line line309'}></div>
                    <div className={'card card309'}>
                        <div>№ 309</div>
                        <div>S = 32,7 кв.м.</div>
                        <div>2 к/места</div>
                        <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "309")?.rooms.map((room: RoomModel) => {
                            return room.guests.map((guest: GuestModel) => (
                                <>
                                    <div>{guest.lastname} {guest.firstname[0]}. {guest.secondName[0]}.</div>
                                </>
                            ))
                        })
                        }
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "309")?.note &&
                            <>
                                <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                                {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "309")?.note}
                            </>
                        }
                    </div>
                    <Popconfirm okText={'Да'} title={"Открыть карточку комнаты?"} onConfirm={() => {
                        props.setSelectedFlatId(props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "309")?.id ?? null);
                        props.setFlatModalVisible(true);
                    }}>
                        <div className={"room room309 room-vacant-color"}></div>
                    </Popconfirm>
                    {/*Комната 308*/}
                    <div className={'line line308'}></div>
                    <div className={'card card308'}>
                        <div>№ 308</div>
                        <div>S = 30,1 кв.м.</div>
                        <div>1 к/места</div>
                        <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "308")?.rooms.map((room: RoomModel) => {
                            return room.guests.map((guest: GuestModel) => (
                                <>
                                    <div>{guest.lastname} {guest.firstname[0]}. {guest.secondName[0]}.</div>
                                </>
                            ))
                        })
                        }
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "308")?.note &&
                            <>
                                <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                                {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "308")?.note}
                            </>
                        }
                    </div>
                    <Popconfirm okText={'Да'} title={"Открыть карточку комнаты?"} onConfirm={() => {
                        props.setSelectedFlatId(props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "308")?.id ?? null);
                        props.setFlatModalVisible(true);
                    }}>
                        <div className={"room room308 room-vacant-color"}></div>
                    </Popconfirm>
                    {/*Комната 307*/}
                    <div className={'line line307'}></div>
                    <div className={'card card307'}>
                        <div>№ 307</div>
                        <div>S = 17,6 кв.м.</div>
                        <div>1 к/места</div>
                        <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "307")?.rooms.map((room: RoomModel) => {
                            return room.guests.map((guest: GuestModel) => (
                                <>
                                    <div>{guest.lastname} {guest.firstname[0]}. {guest.secondName[0]}.</div>
                                </>
                            ))
                        })
                        }
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "307")?.note &&
                            <>
                                <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                                {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "307")?.note}
                            </>
                        }
                    </div>
                    <Popconfirm okText={'Да'} title={"Открыть карточку комнаты?"} onConfirm={() => {
                        props.setSelectedFlatId(props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "307")?.id ?? null);
                        props.setFlatModalVisible(true);
                    }}>
                        <div className={"room room307 room-vacant-color"}></div>
                    </Popconfirm>
                    {/*Комната 306*/}
                    <div className={'line line306'}></div>
                    <div className={'card card306'}>
                        <div>№ 306</div>
                        <div>S = 53,9 кв.м.</div>
                        <div>2 к/места</div>
                        <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "306")?.rooms.map((room: RoomModel) => {
                            return room.guests.map((guest: GuestModel) => (
                                <>
                                    <div>{guest.lastname} {guest.firstname[0]}. {guest.secondName[0]}.</div>
                                </>
                            ))
                        })
                        }
                        {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "306")?.note &&
                            <>
                                <Divider style={{margin: 0, marginTop: 5, marginBottom: 5}}/>
                                {props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "306")?.note}
                            </>
                        }
                    </div>
                    <Popconfirm okText={'Да'} title={"Открыть карточку комнаты?"} onConfirm={() => {
                        props.setSelectedFlatId(props.flats.find((flat: FlatModel) => flat.floor === 3 && flat.name === "306")?.id ?? null);
                        props.setFlatModalVisible(true);
                    }}>
                        <div className={"room room306 room-vacant-color"}></div>
                    </Popconfirm>
                </div>
            </Flex>
        </div>
    )
}