import axios from "axios";

export class ApuestasProvider {
    basePath = 'https://fernanbetbackend.onrender.com/api/v1/'

    getApuestasById = async (id) => {
        return axios.get(`${this.basePath}bets/mis_apuestas/?id=${id}`)
    }

    createApuesta = async (apuesta) => {
        return axios.post(`${this.basePath}bets/create/`,apuesta)
    }
}