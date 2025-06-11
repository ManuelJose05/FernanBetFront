import axios from "axios";

export class TeamProvider {
    basePath = 'http://localhost:8000/api/v1/'

    getAllEquipos = async () => {
        return await axios.get(`${this.basePath}teams/getAllTeams/`)
    }

    getTeamById = async (teamId) => {
        return await axios.get(`${this.basePath}teams/getTeamById/${teamId}/`)
    }

    updateTeamById = async (team) => {
        return await axios.put(`${this.basePath}teams/updateTeam/${team.id}/`, team)
    }

    createTeam = async (team) => {
        return await axios.post(`${this.basePath}teams/createTeam/`,team)
    }
}