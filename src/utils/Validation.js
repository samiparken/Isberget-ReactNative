
emailValidation = (email) => {
    const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    return emailValidation.test(email);
}

export default emailValidation;