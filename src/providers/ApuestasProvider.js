import axios from "axios";

export class ApuestasProvider {
    basePath = 'http://localhost:8000/api/v1/'

    getApuestasById = async (id) => {
        return axios.get(`${this.basePath}bets/mis_apuestas/?id=${id}`)
    }

    createApuesta = async (apuesta) => {
        return axios.post(`${this.basePath}bets/create/`,apuesta)
    }
}