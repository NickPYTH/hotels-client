import React, {useEffect, useState} from 'react';
import {Divider, Flex, message, Spin, Switch} from 'antd';
import {useNavigate} from "react-router-dom";
import {hotelAPI} from "../service/HotelService";
import {HotelModel} from "../model/HotelModel";
import {RootStateType} from "../store/store";
import {useSelector} from 'react-redux';
import {HotelCard} from "../component/filial/HotelCard";
import dayjs from 'dayjs';

const CommendantScreen: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = useSelector((state: RootStateType) => state.currentUser.user);
    if (currentUser.roleId !== 2 && currentUser.roleId !== 3) navigate(`../hotels/`);
    const [messageApi, messageContextHolder] = message.useMessage();
    const [hotels, setHotels] = useState<HotelModel[] | null>(null);
    const [includeEmpty, setIncludeEmpty] = useState<boolean>(false);
    const [bedsCountSort, setBedsCountSort] = useState<boolean>(false);
    const [getAllHotelsByCommendant, {
        data: hotelsData,
        isLoading: isHotelsLoading
    }] = hotelAPI.useGetAllHotelsByCommendantMutation();
    const [getAllHotelsByCommendantWithStats, {
        data: hotelsDataWithStats,
    }] = hotelAPI.useGetAllHotelsByCommendantWithStatsMutation();
    useEffect(() => {
        getAllHotelsByCommendant();
        getAllHotelsByCommendantWithStats();
    }, []);
    const showWarningMsg = (msg: string) => {
        messageApi.warning(msg);
    };
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
                    setHotels(deepCopy.sort((a, b) => a.bedsCount - b.bedsCount).reverse());
                } else
                    setHotels(hotelsData);
            } else setHotels(hotelsData.filter((f: HotelModel) => f.bedsCount > 0));
    }, [includeEmpty]);
    useEffect(() => {
        if (hotelsData) {
            let deepCopy: HotelModel[] = JSON.parse(JSON.stringify(hotels));
            if (bedsCountSort) setHotels(deepCopy.sort((a, b) => a.bedsCount - b.bedsCount).reverse());
            else {
                if (includeEmpty) setHotels(hotelsData);
                else setHotels(hotelsData.filter((f: HotelModel) => f.bedsCount > 0));
            }
        }
    }, [bedsCountSort])
    if (isHotelsLoading)
        return <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100vw'}}>
            <Spin size={'large'}/>
        </div>
    return (
        <Flex gap="middle" align="start" vertical={true} wrap={'wrap'}>
            {messageContextHolder}
            <Flex style={{marginTop: 20, marginLeft: 15}} gap={'small'} align={'center'}>
                <div style={{marginLeft: 20, fontSize: 24, fontWeight: 600}}>{hotels !== null ? hotels[0]?.filialName : ""}</div>
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