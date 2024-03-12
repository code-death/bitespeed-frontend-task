const Button = ({text = "Save Changes", style = {}, ...props}) => {
    return (
            <button {...props} style={style} className={'custom-button'}>
                {text}
            </button>
    )
}

export default Button
