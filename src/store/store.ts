import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {filialAPI} from "../service/FilialService";
import filialSlice, {FilialModelStateType} from "./slice/FilialSlice";
import {hotelAPI} from "../service/HotelService";
import {flatAPI} from "../service/FlatService";
import {guestAPI} from "../service/GuestService";
import {roomAPI} from "../service/RoomService";
import {userAPI} from "../service/UserService";
import userSlice, {CurrentUserModelStateType} from "./slice/UserSlice";
import {contractAPI} from "../service/ContractService";
import {organizationAPI} from "../service/OrganizationService";
import {responsibilityAPI} from "../service/ResponsibilityService";
import {reasonAPI} from "../service/ReasonService";
import {logAPI} from "../service/LogService";
import {roomLocksAPI} from "../service/RoomLocksService";
import {flatLocksAPI} from "../service/FlatLocksService";
import {historyAPI} from "../service/HistoryService";
import {eventAPI} from "../service/EventService";
import {MVZAPI} from "../service/MVZService";
import {extraAPI} from "../service/ExtraService";

export type RootStateType = {
    filialList: FilialModelStateType,
    currentUser: CurrentUserModelStateType
};

const rootReducer = combineReducers({
    filialList: filialSlice,
    currentUser: userSlice,
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
    [eventAPI.reducerPath]: eventAPI.reducer,
    [extraAPI.reducerPath]: extraAPI.reducer,
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
                .concat(eventAPI.middleware)
                .concat(extraAPI.middleware)
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
