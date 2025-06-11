import axios from "axios";

export class PlayersProvider {
    base_path = 'http://localhost:8000/api/v1/';

    updatePlayers = async (player) => {
        return axios.put(`${this.base_path}players/updatePlayer/${player.id}/`, player)
    }

    createPlayer = async (player) => {
        return axios.post(`${this.base_path}players/createPlayer/`, player)
    }
}