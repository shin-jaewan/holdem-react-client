const Patterns = {
    id: /^[a-z0-9_-]{5,20}$/,
    password: /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?:[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{8,20}$/,
    email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i,
    isOnlyNumber: /^(\s|\d)+$/,
    phoneNumberPattern: /^0[0-9]{1,2}-?[0-9]{3,4}-?[0-9]{4}$/,
}

export default Patterns;