import axios from "axios";

export class UserProvider {
    basePath = 'http://localhost:8000/api/v1/'

    verifyCode = async (code) => {
        return await axios.post(`${this.basePath}users/verify_code/`,{
            code: code,
        })
    }

    resendCode = async (email) => {
        return await axios.post(`${this.basePath}users/resend_code/`,{
            email: email,
        })
    }
}