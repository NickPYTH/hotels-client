import {RouteProps} from "react-router-dom";
import React from "react";
import {MainPage} from "pages/MainPage";
import {AboutPage} from "pages/AboutPage";
import {CommendantPage} from "pages/CommendantPage";
import {FilialPage} from "pages/FilialPage";
import {HotelPage} from "pages/HotelPage";
import {LogPage} from "pages/LogPage";
import UserPage from "pages/UserPage/ui/UserPage";
import ReasonPage from "pages/ReasonPage/ui/ReasonPage";
import {ContractPage} from "pages/ContractPage";
import {EventKindPage} from "pages/EventKindPage";
import EventTypePage from "pages/EventTypePage/ui/EventTypePage";
import {ExtraPage} from "pages/ExtraPage";
import {GuestPage} from "pages/GuestPage";
import {MvzPage} from "pages/MvzPage";
import {OrganizationPage} from "pages/Organizationpage";
import {ReservationPage} from "pages/ReservationPage";
import {ResponsibilityPage} from "pages/ResponsibilityPage";
import {EventPage} from "pages/EventPage";

export enum AppRoutes {
    MAIN = 'MAIN',
    ABOUT = 'ABOUT',
    COMMENDANT = 'COMMENDANT',
    FILIAL = 'FILIAL',
    HOTEL = 'HOTEL',

    // Администрирование
    LOG = 'LOG',
    USER = 'USER',
    // -----

    // Справочники
    REASON = 'REASON',
    CONTRACT = 'CONTRACT',
    EVENT_KIND = 'EVENT_KIND',
    EVENT_TYPE = 'EVENT_TYPE',
    EVENT = 'EVENT',
    EXTRA = 'EXTRA',
    GUEST = 'GUEST',
    MVZ = 'MVZ',
    ORGANIZATION = 'ORGANIZATION',
    RESERVATION = 'RESERVATION',
    RESPONSIBILITY = 'RESPONSIBILITY',
    // -----
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.MAIN]: '/hotels/filials',
    [AppRoutes.ABOUT]: '/hotels/about',
    [AppRoutes.COMMENDANT]: '/hotels/hotels',
    [AppRoutes.FILIAL]: 'hotels/filials/:id',
    [AppRoutes.HOTEL]: 'hotels/hotels/:id',

    // Администрирование
    [AppRoutes.LOG]: 'hotels/logs',
    [AppRoutes.USER]: 'hotels/users',
    // -----

    // Справочники
    [AppRoutes.REASON]: 'hotels/reasons',
    [AppRoutes.CONTRACT]: 'hotels/contracts',
    [AppRoutes.EVENT_KIND]: 'hotels/eventKinds',
    [AppRoutes.EVENT_TYPE]: 'hotels/eventTypes',
    [AppRoutes.EVENT]: 'hotels/events',
    [AppRoutes.EXTRA]: 'hotels/extras',
    [AppRoutes.GUEST]: 'hotels/guests',
    [AppRoutes.MVZ]: 'hotels/MVZ',
    [AppRoutes.ORGANIZATION]: 'hotels/organizations',
    [AppRoutes.RESERVATION]: 'hotels/reservations',
    [AppRoutes.RESPONSIBILITY]: 'hotels/responsibilities',
    // -----
}

export const routeConfig: Record<AppRoutes, RouteProps> = {
    [AppRoutes.MAIN]: {
        path: RoutePath.MAIN,
        element: <MainPage/>
    },
    [AppRoutes.ABOUT]: {
        path: RoutePath.ABOUT,
        element: <AboutPage/>
    },
    [AppRoutes.COMMENDANT]: {
        path: RoutePath.COMMENDANT,
        element: <CommendantPage/>
    },
    [AppRoutes.FILIAL]: {
        path: RoutePath.FILIAL,
        element: <FilialPage/>
    },
    [AppRoutes.HOTEL]: {
        path: RoutePath.HOTEL,
        element: <HotelPage/>
    },

    // Администрирование
    [AppRoutes.LOG]: {
        path: RoutePath.LOG,
        element: <LogPage/>
    },
    [AppRoutes.USER]: {
        path: RoutePath.USER,
        element: <UserPage/>
    },
    // -----

    // Справочники
    [AppRoutes.REASON]: {
        path: RoutePath.REASON,
        element: <ReasonPage/>
    },
    [AppRoutes.CONTRACT]: {
        path: RoutePath.CONTRACT,
        element: <ContractPage/>
    },
    [AppRoutes.EVENT_KIND]: {
        path: RoutePath.EVENT_KIND,
        element: <EventKindPage/>
    },
    [AppRoutes.EVENT_TYPE]: {
        path: RoutePath.EVENT_TYPE,
        element: <EventTypePage/>
    },
    [AppRoutes.EVENT]: {
        path: RoutePath.EVENT,
        element: <EventPage/>
    },
    [AppRoutes.EXTRA]: {
        path: RoutePath.EXTRA,
        element: <ExtraPage/>
    },
    [AppRoutes.GUEST]: {
        path: RoutePath.GUEST,
        element: <GuestPage/>
    },
    [AppRoutes.MVZ]: {
        path: RoutePath.MVZ,
        element: <MvzPage/>
    },
    [AppRoutes.ORGANIZATION]: {
        path: RoutePath.ORGANIZATION,
        element: <OrganizationPage/>
    },
    [AppRoutes.RESERVATION]: {
        path: RoutePath.RESERVATION,
        element: <ReservationPage/>
    },
    [AppRoutes.RESPONSIBILITY]: {
        path: RoutePath.RESPONSIBILITY,
        element: <ResponsibilityPage/>
    },
    // -----
}