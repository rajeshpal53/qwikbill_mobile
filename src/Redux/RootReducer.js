import {combineReducers} from "redux"
import { Reducer } from "./Reducer"
import { ProviderItemsReducer } from "./ProviderItemsReducer"


export default combineReducers({
    cart: Reducer,
    ProviderItems: ProviderItemsReducer,
    // nextReducer
})