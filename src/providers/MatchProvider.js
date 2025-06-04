import axios from "axios";

export class MatchProvider {
    base_path = 'http://localhost:8000/api/v1/';

    getMatchById = async (id) => {
        return await axios.get(`${this.base_path}matchs/${id}/getMatchById/`)
    }
}