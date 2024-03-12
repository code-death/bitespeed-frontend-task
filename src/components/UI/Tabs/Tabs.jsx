import '../components.css'
import {useState} from "react";
import Tab from "./Tab.jsx";
import {addNewTab, setActiveTab, tabNameChange} from "../../../redux/store.js";
import {useDispatch, useSelector} from "react-redux";

const Tabs = ({position = 'top',data = [],...props}) => {
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    const dispatch = useDispatch();
    const tabs = useSelector(state => state.tabs);

    const handleAddTab = () => {
        dispatch(addNewTab())
    }

    const handleTabNameChange = (id, name) => {
        dispatch(tabNameChange({id, name}));
    }

    const handleTabChange = (tab, index) => {
        setActiveTabIndex(index);
        dispatch(setActiveTab(tab.id))
    }

    return (
        <div className={`tabs-container tabs-container-${position}`}>
            <div onClick={handleAddTab} className={'add-icon-container'}>
                <img className={'add-icon'}  src={'./assets/plus.png'} alt={'plus'} />
            </div>
            {tabs.map((tab, index) => <Tab onClick={() => handleTabChange(tab, index)} activeTab={activeTabIndex === index} handleTabNameChange={handleTabNameChange} key={tab?.key ? tab.key : index} data={tab} name={tab?.label} />)}
        </div>
    )
}

export default Tabs
