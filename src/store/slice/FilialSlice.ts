import {createSlice} from "@reduxjs/toolkit";
import {FilialModel} from "entities/FilialModel";

export type FilialModelStateType = {
    filialList: FilialModel[]
}

const initialState: FilialModelStateType = {
    filialList: []
}

const filialSlice = createSlice({
    name: 'filialSlice',
    initialState,
    reducers: {
        setFilialList: (state, action: { type: string, payload: FilialModel[] }) => {
            state.filialList = action.payload;
        }
    }
});

export const {setFilialList} = filialSlice.actions;

export default filialSlice.reducer;