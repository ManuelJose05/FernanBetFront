import axios from "axios";

export class TeamProvider {
    basePath = 'http://localhost:8000/api/v1/'

    getAllEquipos = () => {
        return axios.get(`${this.basePath}teams/getAllTeams/`)
    }

    getTeamById = (teamId) => {
        return axios.get(`${this.basePath}teams/getTeamById/${teamId}/`)
    }
}