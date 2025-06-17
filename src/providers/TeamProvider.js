import axios from "axios";

export class TeamProvider {
    base_path = 'https://fernanbetbackend.onrender.com/api/v1/'

    getAllEquipos = async () => {
        return await axios.get(`${this.base_path}teams/getAllTeams/`)
    }

    getTeamById = async (teamId) => {
        return await axios.get(`${this.base_path}teams/getTeamById/${teamId}/`)
    }

    updateTeamById = async (team) => {
        return await axios.put(`${this.base_path}teams/updateTeam/${team.id}/`, team)
    }

    createTeam = async (team) => {
        return await axios.post(`${this.base_path}teams/createTeam/`,team)
    }
}
