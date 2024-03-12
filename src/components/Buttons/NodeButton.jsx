
const NodeButton = ({text = "message", onClick, style = {},ref, ...props}) => {
    return (
        <div ref={ref} style={style} onClick={onClick} className={'node-button'}>
            <img className={'node-button-icon'} src={'./assets/message.png'} alt={'icon'} />
            <button className={'dead-button'}>{text}</button>
        </div>
    )
}

export default NodeButton
