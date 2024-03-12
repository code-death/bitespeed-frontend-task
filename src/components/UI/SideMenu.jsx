const SideMenu = ({position = 'right', ...props}) => {

    return (
        <div {...props} className={`side-menu side-menu-${position}`}>
            {props.children}
        </div>
    )
}

export default SideMenu
