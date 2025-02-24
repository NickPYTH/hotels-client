import React, {useEffect, useState} from 'react';
import type {MenuProps} from 'antd';
import {Flex, Menu} from 'antd';
import {useLocation, useNavigate} from "react-router-dom";
import {userAPI} from "../service/UserService";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentUser} from "../store/slice/UserSlice";
import {RootStateType} from "../store/store";
import {ReportMonthModal} from "./report/ReportMonthModal";
import {GuestReportModal} from "./report/GuestReportModal";
import {HotelReportModal} from "./report/HotelReportModal";
import {ReportMVZModal} from "./report/ReportMVZModal";

type propsType = {}

export const Navbar = (props: propsType) => {
    const [items, setItems] = useState<MenuProps['items']>([]);
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootStateType) => state.currentUser.user);
    const navigate = useNavigate();
    const location = useLocation();
    const [guestModalReport, setGuestModalReport] = useState(false);
    const [hotelModalReport, setHotelModalReport] = useState(false);
    const [mvzModalReport, setMvzModalReport] = useState(false);
    const [getCurrentUser, {
        data: currentUserData,
        isLoading: isCurrentUserLoading
    }] = userAPI.useGetCurrentMutation();
    const [updateRole, {
        data: updatedRole,
        isLoading: isUpdateRoleLoading
    }] = userAPI.useUpdateRoleMutation();
    useEffect(() => {
        if (updatedRole) {
            window.location.reload();
        }
    }, [updatedRole]);
    useEffect(() => {
        getCurrentUser();
    }, []);
    useEffect(() => {
        if (currentUserData) {
            if (currentUserData.roleId === 1) { // Админ
                setItems([
                    {
                        label: 'Филиалы',
                        key: 'filials',
                    },
                    {
                        label: 'Справочники',
                        key: 'dicts',
                        children: [
                            {
                                label: 'Записи о проживании',
                                key: 'guests',
                            },
                            {
                                label: 'Договоры',
                                key: 'contracts',
                            },
                            {
                                label: 'Организации',
                                key: 'organizations',
                            },
                            {
                                label: 'МВЗ',
                                key: 'MVZ',
                            },
                            {
                                label: 'Ответственные лица',
                                key: 'responsibilities',
                            },
                            {
                                label: 'Основания',
                                key: 'reasons',
                            },
                            {
                                label: 'Доп. услуги',
                                key: 'extras',
                            },
                        ]
                    },
                    {
                        label: 'Отчеты',
                        key: 'reports',
                        children: [
                            {
                                label: 'Ежемесячный отчет по филиалам',
                                key: 'monthReport',
                            },
                            {
                                label: 'Отчет по МВЗ',
                                key: 'mvzReport',
                            },
                            {
                                label: 'Отчет о проживающих',
                                key: 'guestReport',
                            },
                            {
                                label: 'Загрузка общежитий',
                                key: 'hotelReport',
                            },
                        ]
                    },
                    {
                        label: 'Администрирование',
                        key: 'adm',
                        children: [
                            {
                                label: 'Пользователи',
                                key: 'users',
                            },
                            {
                                label: 'Журнал',
                                key: 'logs',
                            },
                        ]
                    },
                    // {
                    //     label: 'Мероприятия',
                    //     key: 'events',
                    // },
                    {
                        label: 'Справка',
                        key: 'about',
                    },
                ]);
            } else if (currentUserData.roleId === 5) { // Работник ОСР
                setItems([
                    {
                        label: 'Филиалы',
                        key: 'filials',
                    },
                    {
                        label: 'Справочники',
                        key: 'dicts',
                        children: [
                            {
                                label: 'Записи о проживании',
                                key: 'guests',
                            },
                            {
                                label: 'Договоры',
                                key: 'contracts',
                            },
                            {
                                label: 'Организации',
                                key: 'organizations',
                            },
                            {
                                label: 'МВЗ',
                                key: 'MVZ',
                            },
                            {
                                label: 'Ответственные лица',
                                key: 'responsibilities',
                            },
                            {
                                label: 'Основания',
                                key: 'reasons',
                            },
                            {
                                label: 'Доп. услуги',
                                key: 'extras',
                            },
                        ]
                    },
                    {
                        label: 'Отчеты',
                        key: 'reports',
                        children: [
                            {
                                label: 'Ежемесячный отчет по филиалам',
                                key: 'monthReport',
                            },
                            {
                                label: 'Отчет по МВЗ',
                                key: 'mvzReport',
                            },
                            {
                                label: 'Отчет о проживающих',
                                key: 'guestReport',
                            },
                            {
                                label: 'Загрузка общежитий',
                                key: 'hotelReport',
                            },
                        ]
                    },
                    {
                        label: 'Справка',
                        key: 'about',
                    },
                ]);
            } else if (currentUserData.roleId === 2 || currentUserData.roleId === 3) { // Дежурный и работник филиала
                setItems([
                    {
                        label: 'Общежития',
                        key: 'hotels',
                    },
                    {
                        label: 'Справочники',
                        key: 'dicts',
                        children: [
                            {
                                label: 'Записи о проживании',
                                key: 'guests',
                            }
                        ]
                    },
                    {
                        label: 'Отчеты',
                        key: 'reports',
                        children: [
                            {
                                label: 'Ежемесячный отчет по филиалам',
                                key: 'monthReport',
                            },
                            {
                                label: 'Отчет о проживающих',
                                key: 'guestReport',
                            },
                            {
                                label: 'Загрузка общежитий',
                                key: 'hotelReport',
                            },
                            {
                                label: 'Отчет по МВЗ',
                                key: 'mvzReport',
                            },
                        ]
                    },
                    {
                        label: 'Справка',
                        key: 'about',
                    },
                ]);
            } else if (currentUserData.roleId === 4) {  // Наблюдатель
                setItems([
                    {
                        label: 'Филиалы',
                        key: 'filials',
                    },
                    {
                        label: 'Отчеты',
                        key: 'reports',
                        children: [
                            {
                                label: 'Ежемесячный отчет по филиалам',
                                key: 'monthReport',
                            },
                            {
                                label: 'Отчет о проживающих',
                                key: 'guestReport',
                            },
                            {
                                label: 'Загрузка общежитий',
                                key: 'hotelReport',
                            },
                            {
                                label: 'Отчет по МВЗ',
                                key: 'mvzReport',
                            },
                        ]
                    },
                    {
                        label: 'Справка',
                        key: 'about',
                    },
                ]);
            }
            if ((location.pathname === "/hotels" || location.pathname === "/hotels/") && (currentUserData.roleId === 2 || currentUserData.roleId === 3)) navigate(`/hotels/hotels`);
            dispatch(setCurrentUser(currentUserData))
        }
    }, [currentUserData]);
    const [current, setCurrent] = useState(() => {
        if (location.pathname === "/hotels/reasons") return 'reasons';
        if (location.pathname === "/hotels/responsibilities") return 'responsibilities';
        if (location.pathname === "/hotels/organizations") return 'organizations';
        if (location.pathname === "/hotels/MVZ") return 'MVZ';
        if (location.pathname === "/hotels/contracts") return 'contracts';
        if (location.pathname === "/hotels/users") return 'users';
        if (location.pathname === "/hotels/hotels") return 'hotels';
        if (location.pathname.includes('guests')) return 'guests';
        if (location.pathname.includes('filials')) return 'filials';
        if (location.pathname.includes('hotels')) return 'filials';
        if (location.pathname.includes('events')) return 'events';
        if (location.pathname.includes('extras')) return 'extras';
        if (location.pathname.includes('about')) return 'about';
        return "";
    });
    useEffect(() => {
        setCurrent(() => {
            if (location.pathname === "/hotels/reasons") return 'reasons';
            if (location.pathname === "/hotels/responsibilities") return 'responsibilities';
            if (location.pathname === "/hotels/organizations") return 'organizations';
            if (location.pathname === "/hotels/contracts") return 'contracts';
            if (location.pathname === "/hotels/users") return 'users';
            if (location.pathname.includes('/hotels/hotels')) return 'hotels';
            if (location.pathname.includes('guests')) return 'guests';
            if (location.pathname.includes('filials')) return 'filials';
            if (location.pathname.includes('hotels')) return 'filials';
            if (location.pathname.includes('events')) return 'events';
            if (location.pathname.includes('extras')) return 'extras';
            if (location.pathname.includes('about')) return 'about';
            return "";
        });
    }, [location]);

    const [visibleMonthReport, setVisibleMonthReport] = useState(false);

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        if (e.key === 'monthReport') {
            setVisibleMonthReport(true);
        }
        if (e.key === 'mvzReport') {
            setMvzModalReport(true);
        }
        if (e.key === 'guestReport') {
            setGuestModalReport(true);
        }
        if (e.key === 'hotelReport') {
            setHotelModalReport(true);
        }
        if (e.key === 'reasons') navigate(`hotels/reasons`)
        if (e.key === 'contracts') navigate(`hotels/contracts`)
        if (e.key === 'filials') navigate(`hotels/filials`)
        if (e.key === 'events') navigate(`hotels/events`)
        if (e.key === 'extras') navigate(`hotels/extras`)
        if (e.key === 'hotels') navigate(`hotels/hotels`)
        if (e.key === 'guests') navigate(`hotels/guests`)
        if (e.key === 'users') navigate(`hotels/users`)
        if (e.key === 'logs') navigate(`hotels/logs`)
        if (e.key === 'about') navigate(`hotels/about`)
        if (e.key === 'organizations') navigate(`hotels/organizations`)
        if (e.key === 'MVZ') navigate(`hotels/MVZ`)
        if (e.key === 'responsibilities') navigate(`hotels/responsibilities`)
    };

    return (<>
            <div style={{position: 'absolute', top: 10, right: 10}}>
                <Flex align={'flex-end'} justify={'flex-end'}>
                    {/*<Select*/}
                    {/*    value={currentUserData?.roleId}*/}
                    {/*    placeholder={"Выберите роль"}*/}
                    {/*    style={{width: '100%', marginRight: '1rem'}}*/}
                    {/*    onChange={(e) => {*/}
                    {/*        updateRole(e);*/}
                    {/*    }}*/}
                    {/*    options={[*/}
                    {/*        {value: 1, label: "Администратор"},*/}
                    {/*        {value: 2, label: "Дежурный (назначить общаги через адм)"},*/}
                    {/*        {value: 3, label: "Работник филиала"},*/}
                    {/*        {value: 4, label: "Наблюдатель"}*/}
                    {/*    ]}*/}
                    {/*/>*/}
                    <div style={{width: 110, marginBottom: 5}}>
                      {currentUser?.fio}
                    </div>
                </Flex>
            </div>
            <Menu disabled={isCurrentUserLoading} onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}/>
            {visibleMonthReport && <ReportMonthModal visible={visibleMonthReport} setVisible={setVisibleMonthReport}/>}
            {mvzModalReport && <ReportMVZModal visible={mvzModalReport} setVisible={setMvzModalReport}/>}
            {guestModalReport && <GuestReportModal visible={guestModalReport} setVisible={setGuestModalReport}/>}
            {hotelModalReport && <HotelReportModal visible={hotelModalReport} setVisible={setHotelModalReport}/>}
        </>

    );
};
