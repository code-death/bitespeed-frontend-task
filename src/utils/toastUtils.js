export const getToastStyles = (type = 'success') =>  {
    let styles = {};
    switch (type) {
        case "success":
            styles.backgroundColor = "#b4efe2";
            break
        case "error":
            styles.backgroundColor = "#efb4b4";
            break
        case "warn":
            styles.backgroundColor = "#efe1b4";
            break
        default:
            styles.backgroundColor = "#b4efe2";
            break
    }

    return styles
}
