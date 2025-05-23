import {Team} from "./Team";

export interface Match {
    local_team:       Team;
    local_team_score: null;
    away_team:        Team;
    away_team_score:  null;
    date:             Date;
    status:           string;
    referee:          string;
    school_id:        number;
}