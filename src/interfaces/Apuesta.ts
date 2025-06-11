export interface Apuesta {
    id:         number;
    user:       number;
    amount:     number;
    ganancia_potencial: number;
    created_at: Date;
    conditions: Condition[];
    is_winner: boolean;
}

export interface Condition {
    id:               number;
    type:             string;
    match:            number;
    predicted_result: null | string;
    player:           number | null;
    stat_type:        string;
    predicted_value:  number | null;
    is_winner: boolean;
}
