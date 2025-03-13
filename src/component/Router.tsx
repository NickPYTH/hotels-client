import {BrowserRouter, Route, Routes} from 'react-router-dom'
import React from "react";
import {Navbar} from "./Navbar";
import MainScreen from "../screen/MainScreen";
import FilialScreen from "../screen/FilialScreen";
import HotelScreen from "../screen/HotelScreen";
import GuestScreen from "../screen/dict/GuestScreen";
import CommendantScreen from "../screen/CommendantScreen";
import UserScreen from "../screen/admin/UserScreen";
import ContractScreen from "../screen/dict/ContractScreen";
import OrganizationScreen from "../screen/dict/OrganizationScreen";
import ResponsibilityScreen from "../screen/dict/ResponsibilityScreen";
import ReasonScreen from "../screen/dict/ReasonScreen";
import LogScreen from "../screen/admin/LogScreen";
import MVZScreen from "../screen/dict/MVZScreen";
import {Result} from "antd";
import AboutScreen from "../screen/AboutScreen";
import EventScreen from "../screen/dict/EventScreen";
import ExtraScreen from "../screen/dict/ExtraScreen";
import ReservationScreen from "../screen/dict/ReservationScreen";


export const Router: React.FC = () => {
    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route
                    path='hotels/reasons'
                    element={<ReasonScreen/>}
                />
                <Route
                    path='hotels/responsibilities'
                    element={<ResponsibilityScreen/>}
                />
                <Route
                    path='hotels/organizations'
                    element={<OrganizationScreen/>}
                />
                <Route
                    path='hotels/MVZ'
                    element={<MVZScreen/>}
                />
                <Route
                    path='hotels/contracts'
                    element={<ContractScreen/>}
                />
                <Route
                    path='hotels/users'
                    element={<UserScreen/>}
                />
                <Route
                    path='hotels/logs'
                    element={<LogScreen/>}
                />
                <Route
                    path='hotels/hotels'
                    element={<CommendantScreen/>}
                />
                <Route
                    path='hotels/filials'
                    element={<MainScreen/>}
                />
                <Route
                    path='hotels/guests'
                    element={<GuestScreen/>}
                />
                <Route
                    path='hotels/reservations'
                    element={<ReservationScreen/>}
                />
                <Route
                    path='hotels/filials/:id'
                    element={<FilialScreen/>}
                />
                <Route
                    path='hotels/hotels/:id'
                    element={<HotelScreen/>}
                />
                <Route
                    path='hotels/events'
                    element={<EventScreen/>}
                />
                <Route
                    path='hotels/extras'
                    element={<ExtraScreen/>}
                />
                <Route
                    path='hotels/about'
                    element={<AboutScreen/>}
                />
                <Route
                    path='*'
                    element={<Result
                        status="404"
                        title="404"
                        subTitle="Извините, страницы на которую вы перешли не существует."
                    />}
                />
            </Routes>
        </BrowserRouter>)
};