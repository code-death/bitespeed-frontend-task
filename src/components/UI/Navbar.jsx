import Button from "../Buttons/Button.jsx";

const Navbar = ({onSave, ...props}) => {

    return (
        <nav className={'navbar'}>
            <Button onClick={onSave} text={'Save Changes'} />
        </nav>
    )
}

export default Navbar
