import {Player} from "./Player";

export interface Team {
    id:         number;
    nombre:     string;
    entrenador: string;
    school:     number;
    gf:         number;
    gc:         number;
    pj:         number;
    victorias:  number;
    derrotas:   number;
    empates:    number;
    puntos:     number;
    dg:         number;
    jugadores:  Player[];
}