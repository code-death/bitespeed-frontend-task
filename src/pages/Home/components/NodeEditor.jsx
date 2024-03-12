import {useState} from "react";

const NodeEditor = ({data, type = 'Message', handleBack, onChange, ...props}) => {
    const handleChange = (e) => {
        if(onChange) {
            onChange(e.target.value);
        }
    }

    return (
        <div className={'node-editor'}>
            <div className={'node-editor-header'}>
                <img onClick={handleBack} style={{width: '16px', height: '16px', position: 'absolute', left: '10px', opacity: '0.5', cursor: 'pointer'}} src={'./assets/left-arrow.png'} alt={'left'}/>
                <p style={{margin: 0}}>{type}</p>
            </div>
            <div className={'node-editor-body'}>
                <p>Text:</p>
                <textarea onChange={handleChange} className={'node-editor-text-area'} value={data.message} placeholder={'Write your message here'} />
            </div>
        </div>
    )
}

export default NodeEditor
