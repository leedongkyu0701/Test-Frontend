// Redux store 설정
import {configureStore} from "@reduxjs/toolkit"
import cartSlice from "./cart.js"
import uiSlice from "./ui.js"

const store = configureStore({
    reducer:{
        cart: cartSlice.reducer,
        ui: uiSlice.reducer,
    }
})

export default store;

