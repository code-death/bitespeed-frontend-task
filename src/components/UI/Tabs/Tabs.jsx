import '../components.css'
import {useState} from "react";
import Tab from "./Tab.jsx";

const Tabs = ({position = 'top',data = [],...props}) => {
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [tabs, setTabs] = useState([{
        id: 1,
        key: '1',
        label: 'Tab1',
    }])

    const handleAddTab = () => {
        let newTab = {};
        const tabLength = tabs.length + 1;
        newTab.id = tabLength;
        newTab.key = tabLength.toString();
        newTab.label = `Tab${tabLength.toString()}`

        setTabs(prev => ([...prev, newTab]));
    }

    const handleTabNameChange = (id, name) => {
        setTabs(prev => prev.map(tab => {
            if(tab.id === id) {
                return {
                    ...tab,
                    label: name
                }
            } else {
                return tab
            }
        }))
    }

    return (
        <div className={`tabs-container tabs-container-${position}`}>
            <div onClick={handleAddTab} className={'add-icon-container'}>
                <img className={'add-icon'}  src={'./assets/plus.png'} alt={'plus'} />
            </div>
            {tabs.map((tab, index) => <Tab onClick={() => setActiveTabIndex(index)} activeTab={activeTabIndex === index} handleTabNameChange={handleTabNameChange} key={tab?.key ? tab.key : index} data={tab} name={tab?.label} />)}
        </div>
    )
}

export default Tabs
