import './App.css'
import Navbar from "./components/UI/Navbar.jsx";
import Home from "./pages/Home/Home.jsx";
import { DragDropContext } from 'react-beautiful-dnd';
import {Toaster} from "react-hot-toast";
import Tabs from "./components/UI/Tabs/Tabs.jsx";
import {useEffect, useState} from "react";
import _ from "lodash";
import {replaceSheetData, replaceTabs, setSheetData} from "./redux/store.js";
import {useDispatch, useSelector} from "react-redux";

function App() {
    const [localData, setLocalData] = useState({});

    const activeTabId = useSelector(state => state.activeTabId);

    const dispatch = useDispatch();

    useEffect(() => {
            if(_.isEmpty(localData)) {
                let storageData = JSON.parse(window.localStorage.getItem('sheetData'));
                let localTabs = JSON.parse(window.localStorage.getItem('tabs'));
                setLocalData(storageData);
                dispatch(replaceSheetData(storageData));
                if(localTabs) {
                    dispatch(replaceTabs(localTabs));
                }
            }
    }, [])

  return (
    <>
        <Toaster position={'top-center'} />
        <Home activeTabId={activeTabId} localData={localData?.[activeTabId]}/>
        <Tabs position={'bottom'} />
    </>
  )
}

export default App
