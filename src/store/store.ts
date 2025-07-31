import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {filialAPI} from "service/FilialService";
import filialSlice, {FilialModelStateType} from "./slice/FilialSlice";
import {hotelAPI} from "service/HotelService";
import {flatAPI} from "service/FlatService";
import {guestAPI} from "service/GuestService";
import {roomAPI} from "service/RoomService";
import {userAPI} from "service/UserService";
import userSlice, {CurrentUserModelStateType} from "./slice/UserSlice";
import {contractAPI} from "service/ContractService";
import {organizationAPI} from "service/OrganizationService";
import {responsibilityAPI} from "service/ResponsibilityService";
import {reasonAPI} from "service/ReasonService";
import {logAPI} from "service/LogService";
import {roomLocksAPI} from "service/RoomLocksService";
import {flatLocksAPI} from "service/FlatLocksService";
import {historyAPI} from "service/HistoryService";
import {eventKindAPI} from "service/EventKindService";
import {MVZAPI} from "service/MVZService";
import {extraAPI} from "service/ExtraService";
import {reservationAPI} from "service/ReservationService";
import {eventTypeAPI} from "service/EventTypeService";
import {paymentTypeAPI} from "service/PaymentTypeService";
import {eventAPI} from "service/EventService";
import {bookReportAPI} from "service/BookReportService";

export type RootStateType = {
    filialList: FilialModelStateType,
    currentUser: CurrentUserModelStateType
};

const rootReducer = combineReducers({
    filialList: filialSlice,
    currentUser: userSlice,
    [reservationAPI.reducerPath]: reservationAPI.reducer,
    [filialAPI.reducerPath]: filialAPI.reducer,
    [hotelAPI.reducerPath]: hotelAPI.reducer,
    [flatAPI.reducerPath]: flatAPI.reducer,
    [guestAPI.reducerPath]: guestAPI.reducer,
    [roomAPI.reducerPath]: roomAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [contractAPI.reducerPath]: contractAPI.reducer,
    [organizationAPI.reducerPath]: organizationAPI.reducer,
    [responsibilityAPI.reducerPath]: responsibilityAPI.reducer,
    [reasonAPI.reducerPath]: reasonAPI.reducer,
    [logAPI.reducerPath]: logAPI.reducer,
    [roomLocksAPI.reducerPath]: roomLocksAPI.reducer,
    [flatLocksAPI.reducerPath]: flatLocksAPI.reducer,
    [historyAPI.reducerPath]: historyAPI.reducer,
    [MVZAPI.reducerPath]: MVZAPI.reducer,
    [eventKindAPI.reducerPath]: eventKindAPI.reducer,
    [extraAPI.reducerPath]: extraAPI.reducer,
    [eventTypeAPI.reducerPath]: eventTypeAPI.reducer,
    [eventAPI.reducerPath]: eventAPI.reducer,
    [paymentTypeAPI.reducerPath]: paymentTypeAPI.reducer,
    [bookReportAPI.reducerPath]: bookReportAPI.reducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(filialAPI.middleware)
                .concat(hotelAPI.middleware)
                .concat(flatAPI.middleware)
                .concat(guestAPI.middleware)
                .concat(roomAPI.middleware)
                .concat(userAPI.middleware)
                .concat(contractAPI.middleware)
                .concat(organizationAPI.middleware)
                .concat(responsibilityAPI.middleware)
                .concat(reasonAPI.middleware)
                .concat(logAPI.middleware)
                .concat(MVZAPI.middleware)
                .concat(roomLocksAPI.middleware)
                .concat(flatLocksAPI.middleware)
                .concat(historyAPI.middleware)
                .concat(eventKindAPI.middleware)
                .concat(extraAPI.middleware)
                .concat(reservationAPI.middleware)
                .concat(eventTypeAPI.middleware)
                .concat(eventAPI.middleware)
                .concat(paymentTypeAPI.middleware)
                .concat(bookReportAPI.middleware)
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
