import axios from "axios";

export class MatchsProvider {
    base_path = 'https://fernanbetbackend.onrender.com/api/v1/'

    getMatchById = async (id) => {
        return await axios.get(`${this.base_path}matchs/${id}/getMatchById/`)
    }

    updateMatchStatus = async (id, status) => {
        return await axios.patch(`${this.base_path}matchs/${id}/updateMatchStatus/`, {
            status: status
        })
    }

    updateMatchStats = async (id, stats) => {
        return await axios.post(`${this.base_path}matchs/${id}/updateMatchStats/`,stats)
    }

    finishMatch = async (body) => {
        return await axios.post(`${this.base_path}matchs/finishMatch/`,body)
    }

    createMatch = async (body) => {
        return await axios.post(`${this.base_path}matchs/createMatch/`, body)
    }
}