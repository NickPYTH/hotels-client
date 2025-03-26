import React, {useEffect, useState} from 'react';
import {Divider, Flex, message, Switch} from 'antd';
import {useNavigate} from "react-router-dom";
import {hotelAPI} from "../service/HotelService";
import {HotelModel} from "../model/HotelModel";
import {RootStateType} from "../store/store";
import {useSelector} from 'react-redux';
import {HotelCard} from "../component/filial/HotelCard";

const CommendantScreen: React.FC = () => {

    // States
    const [messageApi, messageContextHolder] = message.useMessage();
    const [hotels, setHotels] = useState<HotelModel[] | null>(null);
    const [includeEmpty, setIncludeEmpty] = useState<boolean>(false);
    const [bedsCountSort, setBedsCountSort] = useState<boolean>(false);
    // -----

    // Web requests
    const [getAllHotelsByCommendant, {
        data: hotelsData,
    }] = hotelAPI.useGetAllHotelsByCommendantMutation();
    const [getAllHotelsByCommendantWithStats, {
        data: hotelsDataWithStats,
    }] = hotelAPI.useGetAllHotelsByCommendantWithStatsMutation();
    // -----

    // Useful utils
    const navigate = useNavigate();
    const currentUser = useSelector((state: RootStateType) => state.currentUser.user);
    if (currentUser.roleId !== 2 && currentUser.roleId !== 3) navigate(`../hotels/`);
    const showWarningMsg = (msg: string) => {
        messageApi.warning(msg);
    };
    // -----

    // Effects
    useEffect(() => {
        getAllHotelsByCommendant();
        getAllHotelsByCommendantWithStats();
    }, []);
    useEffect(() => {
        if (hotelsDataWithStats) setHotels(hotelsDataWithStats);
    }, [hotelsDataWithStats]);
    useEffect(() => {
        if (hotelsData) setHotels(hotelsData);
    }, [hotelsData]);
    useEffect(() => {
        if (hotelsData)
            if (includeEmpty) {
                if (bedsCountSort) {
                    let deepCopy: HotelModel[] = JSON.parse(JSON.stringify(hotelsData));
                    setHotels(deepCopy.sort((a, b) => (a.bedsCount ?? 0) - (b.bedsCount ?? 0)).reverse());
                } else
                    setHotels(hotelsData);
            } else setHotels(hotelsData.filter((f: HotelModel) => (f.bedsCount ?? 0) > 0));
    }, [includeEmpty]);
    useEffect(() => {
        if (hotelsData) {
            let deepCopy: HotelModel[] = JSON.parse(JSON.stringify(hotels));
            if (bedsCountSort) setHotels(deepCopy.sort((a, b) => (a.bedsCount ?? 0) - (b.bedsCount ?? 0)).reverse());
            else {
                if (includeEmpty) setHotels(hotelsData);
                else setHotels(hotelsData.filter((f: HotelModel) => (f.bedsCount ?? 0) > 0));
            }
        }
    }, [bedsCountSort]);
    // -----

    return (
        <Flex gap="middle" align="start" vertical={true} wrap={'wrap'}>
            {messageContextHolder}
            <Flex style={{marginTop: 20, marginLeft: 15}} gap={'small'} align={'center'}>
                <div style={{marginLeft: 20, fontSize: 24, fontWeight: 600}}>{hotels !== null ? hotels[0]?.filial.name : ""}</div>
                <Divider style={{height: 44}} type={'vertical'}/>
                <Flex align={'center'}>
                    <div style={{width: 240, height: 44, wordBreak: 'break-word', whiteSpace: 'normal'}}>Остортировать по убыванию общего колличества мест</div>
                    <div>
                        <Switch value={bedsCountSort} onChange={(e) => setBedsCountSort(e)} style={{marginLeft: 5}}/>
                    </div>
                </Flex>
                <Divider style={{height: 44}} type={'vertical'}/>
            </Flex>
            <Divider style={{marginTop: 5, marginBottom: 0}}/>
            <Flex style={{marginRight: 15, marginLeft: 15}} gap="middle" align="start" vertical={false} wrap={'wrap'} justify="center">
                {hotels?.map((hotel: HotelModel) => (
                    <HotelCard showWarningMsg={showWarningMsg} hotel={hotel}/>
                ))}
            </Flex>
        </Flex>
    );
};

export default CommendantScreen;