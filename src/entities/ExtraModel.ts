import {PaymentTypeModel} from "entities/PaymentTypeModel";

export type ExtraModel = {
    id: number;
    name: string;
    description: string;
    cost: number;

    // Значения из таблицы guests_extras
    guestId?: number;
    isPaid: boolean;
    paymentType: PaymentTypeModel | null;

    // Вчисляемые поля
    count?: number;
    totalCost?: number;
}