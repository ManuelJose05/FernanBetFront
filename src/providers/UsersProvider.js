import axios from "axios";

export class UsersProvider {
    basePath = 'https://fernanbetbackend.onrender.com/api/v1/'

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

    getUsersBySchool = async (schoolId) => {
        return await axios.get(`${this.basePath}users/getUsersBySchool/${schoolId}/`)
    }

    updateUser = async (user) => {
        return await axios.put(`${this.basePath}users/updateUserByEmail/`, user)
    }
}