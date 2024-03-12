const CustomTextNodeDummy = ({data, isConnectable, ...props}) => {
    return(
        <div style={{opacity: "80%", width: '200px'}} className={'custom-node'}>
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
                {data?.message ? data.message : 'Your Text message'}
            </div>
        </div>
    )
}

export default CustomTextNodeDummy
