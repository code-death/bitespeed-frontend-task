import {useEffect, useState} from "react";

const Tab = ({name, activeTab = false, data, handleTabNameChange, ...props}) => {
    const [value, setValue] = useState(name ? name : "");
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        if(value.length !== 0) {
            setIsEditing(false);
            handleTabNameChange(data?.id, value);
        }
    }

    useEffect(() => {
        const handleKeyUp = (event) => {
            if (event.key === "Enter") {
                handleSave();
            }
        };

        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, [handleSave]);

    return (
        <div onClick={props.onClick} onDoubleClick={() => setIsEditing(true)} className={`single-tab ${activeTab ? 'active-tab' : ''}`} {...props}>
            {
                isEditing ?
                    <input autoFocus={true} onBlur={handleSave} className={'tab-input'} type={'text'} value={value} onChange={e => setValue(e.target.value)} />
                    :
                    <p className={'tab-text'}>{name}</p>
            }
        </div>
    )
}

export default Tab
