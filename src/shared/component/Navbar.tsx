import React, {useEffect, useState} from 'react';
import {Flex, Menu, MenuProps} from 'antd';
import {useLocation, useNavigate} from "react-router-dom";
import {userAPI} from "service/UserService";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentUser} from "store/slice/UserSlice";
import {RootStateType} from "store/store";
import {ReportMonthModal} from "shared/component/report/ReportMonthModal";
import {GuestReportModal} from "shared/component/report/GuestReportModal";
import {HotelReportModal} from "shared/component/report/HotelReportModal";
import {ReportMVZModal} from "shared/component/report/ReportMVZModal";
import {LoadStatsReportModal} from "shared/component/report/LoadStatsReportModal";
import {ReportReestrRabotModal} from "shared/component/report/ReportReestrRabotModal";
import {PlanZaezdReportModal} from "shared/component/report/PlanZaezdReportModal";
import {WeekReportModal} from "shared/component/report/WeekReportModal";
import {ExtrasReportModal} from "shared/component/report/ExtrasReportModal";
import {AvdReportModal} from "shared/component/report/AvdReportModal";
import {ReservationConfirmReportModal} from "shared/component/report/ReservationConfirmReportModal";
import {YearReservationReportModal} from "shared/component/report/YearReservationReportModal";

export const Navbar = () => {

    // Useful utils
    const currentUser = useSelector((state: RootStateType) => state.currentUser.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    // -----

    // States
    const [items, setItems] = useState<MenuProps['items']>([]);
    const [current, setCurrent] = useState(() => {
        if (location.pathname === "/hotels/reasons") return 'reasons';
        if (location.pathname === "/hotels/responsibilities") return 'responsibilities';
        if (location.pathname === "/hotels/organizations") return 'organizations';
        if (location.pathname === "/hotels/MVZ") return 'MVZ';
        if (location.pathname === "/hotels/contracts") return 'contracts';
        if (location.pathname === "/hotels/users") return 'users';
        if (location.pathname === "/hotels/hotels") return 'hotels';
        if (location.pathname.includes('guests')) return 'guests';
        if (location.pathname.includes('reservations')) return 'reservations';
        if (location.pathname.includes('filials')) return 'filials';
        if (location.pathname.includes('eventTypes')) return 'eventTypes';
        if (location.pathname.includes('eventKinds')) return 'eventKinds';
        if (location.pathname.includes('events')) return 'events';
        if (location.pathname.includes('extras')) return 'extras';
        if (location.pathname.includes('about')) return 'about';
        if (location.pathname.includes('hotels')) return 'filials';
        return "";
    });
    const [guestModalReport, setGuestModalReport] = useState(false);
    const [hotelModalReport, setHotelModalReport] = useState(false);
    const [mvzModalReport, setMvzModalReport] = useState(false);
    const [loadStatsModalReport, setVisibleLoadStatsModalReport] = useState(false);
    const [visibleMonthReport, setVisibleMonthReport] = useState(false);
    const [visibleReestrRabotReport, setVisibleReestrRabotReport] = useState(false);
    const [planZaezdReport, setPlanZaezdReport] = useState(false);
    const [weekReport, setWeekReport] = useState(false);
    const [extrasReport, setExtrasReport] = useState(false);
    const [avdReport, setAvdReport] = useState(false);
    const [reservationConfirmReport, setReservationConfirmReport] = useState(false);
    const [yearReservationReport, setYearReservationReport] = useState(false);
    // -----

    // Web requests
    const [getCurrentUser, {
        data: currentUserData,
        isLoading: isCurrentUserLoading
    }] = userAPI.useGetCurrentMutation();
    const [updateRole, {
        data: updatedRole,
        isLoading: isUpdateRoleLoading
    }] = userAPI.useUpdateRoleMutation();
    // -----

    // Effects
    useEffect(() => {
        getCurrentUser();
    }, []);
    useEffect(() => {
        if (updatedRole) {
            window.location.reload();
        }
    }, [updatedRole]);
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
                                label: 'Записи о бронировании',
                                key: 'reservations',
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
                            {
                                label: 'Мероприятия',
                                key: 'events',
                            },
                            {
                                label: 'Виды мероприятий',
                                key: 'eventKinds',
                            },
                            {
                                label: 'Типы мероприятий',
                                key: 'eventTypes',
                            },
                        ]
                    },
                    {
                        label: 'Отчеты',
                        key: 'reports',
                        children: [
                            {
                                label: 'Расшифровка к реестру',
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
                                label: 'Диаграмма загрузки общежитий',
                                key: 'hotelReport',
                            },
                            {
                                label: 'Отчет загрузки общежитий',
                                key: 'loadStatsReport',
                            },
                            {
                                label: 'Реестр внутрихозяйственных работ',
                                key: 'reestrRabotReport',
                            },
                            {
                                label: 'Планируемый заезд',
                                key: 'planZaezdReport',
                            },
                            {
                                label: 'Информация о еженедельном бронирование',
                                key: 'weekReport',
                            },
                            {
                                label: 'Информация о дополнительных услугах',
                                key: 'extrasReport',
                            },
                            {
                                label: 'Абонемент выходного дня',
                                key: 'avdReport',
                            },
                            {
                                label: 'Подтверждение бронирования',
                                key: 'reservationConfirmReport',
                            },
                            {
                                label: 'Годовой отчет о бронированиях',
                                key: 'yearReservationReport',
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
                                label: 'Записи о бронировании',
                                key: 'reservations',
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
                            {
                                label: 'Мероприятия',
                                key: 'events',
                            },
                            {
                                label: 'Виды мероприятий',
                                key: 'eventKinds',
                            },
                            {
                                label: 'Типы мероприятий',
                                key: 'eventTypes',
                            },
                        ]
                    },
                    {
                        label: 'Отчеты',
                        key: 'reports',
                        children: [
                            {
                                label: 'Расшифровка к реестру',
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
                                label: 'Диаграмма загрузки общежитий',
                                key: 'hotelReport',
                            },
                            {
                                label: 'Отчет загрузки общежитий',
                                key: 'loadStatsReport',
                            },
                            {
                                label: 'Реестр внутрихозяйственных работ',
                                key: 'reestrRabotReport',
                            },
                            {
                                label: 'Планируемый заезд',
                                key: 'planZaezdReport',
                            },
                            {
                                label: 'Информация о еженедельном бронирование',
                                key: 'weekReport',
                            },
                            {
                                label: 'Информация о дополнительных услугах',
                                key: 'extrasReport',
                            },
                            {
                                label: 'Абонемент выходного дня',
                                key: 'avdReport',
                            },
                            {
                                label: 'Подтверждение бронирования',
                                key: 'reservationConfirmReport',
                            },
                            {
                                label: 'Годовой отчет о бронированиях',
                                key: 'yearReservationReport',
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
                            },
                            {
                                label: 'Записи о бронировании',
                                key: 'reservations',
                            },
                        ]
                    },
                    {
                        label: 'Отчеты',
                        key: 'reports',
                        children: [
                            {
                                label: 'Расшифровка к реестру',
                                key: 'monthReport',
                            },
                            {
                                label: 'Отчет о проживающих',
                                key: 'guestReport',
                            },
                            {
                                label: 'Диаграмма загрузки общежитий',
                                key: 'hotelReport',
                            },
                            {
                                label: 'Отчет загрузки общежитий',
                                key: 'loadStatsReport',
                            },
                            {
                                label: 'Отчет по МВЗ',
                                key: 'mvzReport',
                            },
                            {
                                label: 'Реестр внутрихозяйственных работ',
                                key: 'reestrRabotReport',
                            },
                            {
                                label: 'Планируемый заезд',
                                key: 'planZaezdReport',
                            },
                            {
                                label: 'Информация о еженедельном бронирование',
                                key: 'weekReport',
                            },
                            {
                                label: 'Информация о дополнительных услугах',
                                key: 'extrasReport',
                            },
                            {
                                label: 'Абонемент выходного дня',
                                key: 'avdReport',
                            },
                            {
                                label: 'Подтверждение бронирования',
                                key: 'reservationConfirmReport',
                            },
                            {
                                label: 'Годовой отчет о бронированиях',
                                key: 'yearReservationReport',
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
                                label: 'Расшифровка к реестру',
                                key: 'monthReport',
                            },
                            {
                                label: 'Отчет о проживающих',
                                key: 'guestReport',
                            },
                            {
                                label: 'Диаграмма загрузки общежитий',
                                key: 'hotelReport',
                            },
                            {
                                label: 'Отчет загрузки общежитий',
                                key: 'loadStatsReport',
                            },
                            {
                                label: 'Отчет по МВЗ',
                                key: 'mvzReport',
                            },
                            {
                                label: 'Реестр внутрихозяйственных работ',
                                key: 'reestrRabotReport',
                            },
                            {
                                label: 'Планируемый заезд',
                                key: 'planZaezdReport',
                            },
                            {
                                label: 'Информация о еженедельном бронирование',
                                key: 'weekReport',
                            },
                            {
                                label: 'Информация о дополнительных услугах',
                                key: 'extrasReport',
                            },
                            {
                                label: 'Абонемент выходного дня',
                                key: 'avdReport',
                            },
                            {
                                label: 'Подтверждение бронирования',
                                key: 'reservationConfirmReport',
                            },
                            {
                                label: 'Годовой отчет о бронированиях',
                                key: 'yearReservationReport',
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
    useEffect(() => {
        setCurrent(() => {
            if (location.pathname === "/hotels/reasons") return 'reasons';
            if (location.pathname === "/hotels/responsibilities") return 'responsibilities';
            if (location.pathname === "/hotels/organizations") return 'organizations';
            if (location.pathname === "/hotels/contracts") return 'contracts';
            if (location.pathname === "/hotels/users") return 'users';
            if (location.pathname.includes('/hotels/hotels')) return 'hotels';
            if (location.pathname.includes('guests')) return 'guests';
            if (location.pathname.includes('reservations')) return 'reservations';
            if (location.pathname.includes('filials')) return 'filials';
            if (location.pathname.includes('eventTypes')) return 'eventTypes';
            if (location.pathname.includes('eventKinds')) return 'eventKinds';
            if (location.pathname.includes('events')) return 'events';
            if (location.pathname.includes('extras')) return 'extras';
            if (location.pathname.includes('about')) return 'about';
            if (location.pathname.includes('hotels')) return 'filials';
            return "";
        });
    }, [location]);
    // -----

    // Handlers
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
        if (e.key === 'loadStatsReport') {
            setVisibleLoadStatsModalReport(true);
        }
        if (e.key === 'reestrRabotReport') {
            setVisibleReestrRabotReport(true);
        }
        if (e.key === 'planZaezdReport') {
            setPlanZaezdReport(true);
        }
        if (e.key === 'weekReport') {
            setWeekReport(true);
        }
        if (e.key === 'extrasReport') {
            setExtrasReport(true);
        }
        if (e.key === 'avdReport') {
            setAvdReport(true);
        }
        if (e.key === 'reservationConfirmReport') {
            setReservationConfirmReport(true);
        }
        if (e.key === 'yearReservationReport') {
            setYearReservationReport(true);
        }
        if (e.key === 'reasons') navigate(`hotels/reasons`)
        if (e.key === 'contracts') navigate(`hotels/contracts`)
        if (e.key === 'filials') navigate(`hotels/filials`)
        if (e.key === 'eventTypes') navigate(`hotels/eventTypes`)
        if (e.key === 'eventKinds') navigate(`hotels/eventKinds`)
        if (e.key === 'events') navigate(`hotels/events`)
        if (e.key === 'extras') navigate(`hotels/extras`)
        if (e.key === 'hotels') navigate(`hotels/hotels`)
        if (e.key === 'guests') navigate(`hotels/guests`)
        if (e.key === 'reservations') navigate(`hotels/reservations`)
        if (e.key === 'users') navigate(`hotels/users`)
        if (e.key === 'logs') navigate(`hotels/logs`)
        if (e.key === 'about') navigate(`hotels/about`)
        if (e.key === 'organizations') navigate(`hotels/organizations`)
        if (e.key === 'MVZ') navigate(`hotels/MVZ`)
        if (e.key === 'responsibilities') navigate(`hotels/responsibilities`)
    };
    // -----

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
            {visibleReestrRabotReport && <ReportReestrRabotModal visible={visibleReestrRabotReport} setVisible={setVisibleReestrRabotReport}/>}
            {visibleMonthReport && <ReportMonthModal visible={visibleMonthReport} setVisible={setVisibleMonthReport}/>}
            {mvzModalReport && <ReportMVZModal visible={mvzModalReport} setVisible={setMvzModalReport}/>}
            {guestModalReport && <GuestReportModal visible={guestModalReport} setVisible={setGuestModalReport}/>}
            {hotelModalReport && <HotelReportModal visible={hotelModalReport} setVisible={setHotelModalReport}/>}
            {loadStatsModalReport && <LoadStatsReportModal visible={loadStatsModalReport} setVisible={setVisibleLoadStatsModalReport}/>}
            {planZaezdReport && <PlanZaezdReportModal visible={planZaezdReport} setVisible={setPlanZaezdReport}/>}
            {weekReport && <WeekReportModal visible={weekReport} setVisible={setWeekReport}/>}
            {extrasReport && <ExtrasReportModal visible={extrasReport} setVisible={setExtrasReport}/>}
            {avdReport && <AvdReportModal visible={avdReport} setVisible={setAvdReport}/>}
            {reservationConfirmReport && <ReservationConfirmReportModal visible={reservationConfirmReport} setVisible={setReservationConfirmReport}/>}
            {yearReservationReport && <YearReservationReportModal visible={yearReservationReport} setVisible={setYearReservationReport}/>}
        </>
    );
};
