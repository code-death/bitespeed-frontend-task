import {Handle, Position} from "reactflow";

const CustomTextNode = ({data, isConnectable, selected, isConnectableStart, validateConn, ...props}) => {
    return(
        <div className={`custom-node ${selected ? 'selected-node' : ''}`}>
            <Handle
                key="a1"
                isConnectable={isConnectable}
                isValidConnection={validateConn}
                type={'target'}
                id={'a1'}
                position={Position.Left}
            />
            <Handle
                key="a2"
                isConnectable={isConnectable}
                isValidConnection={validateConn}
                type={'source'}
                id={'a2'}
                position={Position.Right}
            />
            <div className={'custom-node-header'}>
                <div style={{display: 'flex', gap: "8px"}}>
                    <img height={'20px'} width={'20px'} src={'./assets/message.png'}/>
                    <p className={'custom-node-header-text'}>Send Message</p>
                </div>
                <div style={{display: 'flex', backgroundColor: "white", padding: "2px", borderRadius: 50}}>
                    <img height={'20px'} width={'20px'} src={'./assets/whatsapp.png'} />
                </div>
            </div>
            <div className={'custom-node-body'}>
                {data.message ? data.message : 'Your Text message'}
            </div>
        </div>
    )
}

export default CustomTextNode
