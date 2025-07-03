import {createSlice} from "@reduxjs/toolkit";
import {UserModel} from "entities/UserModel";

export type CurrentUserModelStateType = {
    user: UserModel
}

const initialState: CurrentUserModelStateType = {
    user: {id: 999, roleId: 999, username: "9999", fio: "", roleName: "", filial: "", tabnum: 999, customPost: null}
}

const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        setCurrentUser: (state, action: { type: string, payload: UserModel }) => {
            state.user = action.payload;
        }
    }
});

export const {setCurrentUser} = userSlice.actions;

export default userSlice.reducer;