import {createSlice, configureStore} from '@reduxjs/toolkit'
import toast from "react-hot-toast";
import {getToastStyles} from "../utils/toastUtils.js";

const roomSlice = createSlice({
    name: 'biteSpeed',
    initialState: {
        activeTabId: 1,
        allData: {},
        tabs: [
            {
                id: 1,
                key: '1',
                label: 'Tab1',
            }
        ]
    },
    reducers: {
        setActiveTab: (state, action) => {
            return {
                ...state,
                activeTabId: action.payload,
            }
        },
        setSheetData: (state, action) => {
            let tempData = {...state.allData}
            tempData[action.payload.tabId] = action.payload.data
            return {
                ...state,
                allData: tempData
            }
        },
        replaceSheetData: (state, action) => {
            return {
                ...state,
                allData: action.payload
            }
        },
        replaceTabs: (state, action) => {
            return {
                ...state,
                tabs: action.payload
            }
        },
        addNewTab: (state) => {
            if(state.tabs?.length < 8) {
                let newTab = {};
                const tabLength = state.tabs.length + 1;
                newTab.id = tabLength;
                newTab.key = tabLength.toString();
                newTab.label = `Tab${tabLength.toString()}`

                return {
                    ...state,
                    tabs: [...state.tabs, newTab]
                }
            } else {
                toast("Max 8 tabs allowed", {
                    style: getToastStyles('error')
                });
            }
        },
        tabNameChange: (state, action) => {
            return {
                ...state,
                tabs: state.tabs.map(tab => {
                    if(tab.id === action.payload.id) {
                        return {
                            ...tab,
                            label: action.payload.name
                        }
                    } else {
                        return tab
                    }
                })
            }
        },
    }
})

export const {
    getActiveTab,
    setActiveTab,
    setSheetData,
    replaceSheetData,
    addNewTab,
    tabNameChange,
    replaceTabs
} = roomSlice.actions

const store = configureStore({
    reducer: roomSlice.reducer
})

export default store;
