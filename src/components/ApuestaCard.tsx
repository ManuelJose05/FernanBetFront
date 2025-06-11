import {Match} from "../interfaces/Match";
import {Apuesta, Condition} from "../interfaces/Apuesta";
import {Card} from "primereact/card";
import {Player} from "../interfaces/Player";
import {useEffect} from "react";
import {Timeline} from "primereact/timeline";
import {formateFecha} from "../utils/formateFecha";
import {Tag} from "primereact/tag";


interface ApuestaCardProps {
    match: Match;
    apuesta: Apuesta
}

const ApuestaCard = (props: ApuestaCardProps) => {
    const title: string = props.match ? `${props.match.local_team.nombre} - ${props.match.away_team.nombre} | ${formateFecha(props.match.date)}` : ""

    useEffect(() => {

    }, [props.match, props.apuesta]);

    const findTagApuesta = () => {
        if (props.match) {
            return props.match.status
        }
        return "ND"
    }

    const isWinner = () => {
        if (props.match.status !== 'FINALIZADO') return false;
        props.apuesta.conditions.map((x:Condition) => {
            if (!x.is_winner) return false;
        })
        return true;
    }

    const header = (
        <div className="flex flex-row gap-2">
            <Tag value={findTagApuesta()}/>
            {
                props.match.status === 'FINALIZADO' && (isWinner() ? <Tag value={"Acertada"} /> : <Tag value={"Fallida"} />)
            }
        </div>
    )

    const findPlayerById = (id: number): Player | undefined => {
        if (props.match) {
            let player = props.match.local_team.jugadores.find((value) => value.id === id);
            if (player) return player;
            player = props.match.away_team.jugadores.find((value) => value.id === id);
            return player;
        }
        return undefined;
    }

    const infoApuestas = props.apuesta.conditions.map((apuesta) => {
        let status: string = ''
        switch (apuesta.stat_type) {
            case "RESULTADO":
                if (apuesta.type === "HOME") status = `${props.match.local_team.nombre} gana el encuentro`;
                if (apuesta.type === "AWAY") status = `${props.match.away_team.nombre} gana el encuentro`;
                else status = 'Empate'
                break;

            case "GOL":
                if (apuesta.player !== null) {
                    const jugador = findPlayerById(apuesta.player);
                    status = jugador ? `${jugador.nombre} encaja ${apuesta.predicted_value} goles` : 'Jugador no encontrado';
                } else {
                    status = 'Jugador no encontrado';
                }
                break;

            case "AMARILLA":
                if (apuesta.player !== null) {
                    const jugador = findPlayerById(apuesta.player);
                    status = jugador ? `${jugador.nombre} hace ${apuesta.predicted_value} amarillas` : 'Jugador no encontrado';
                } else {
                    status = 'Jugador no encontrado';
                }
                break;

            case "ROJA":
                if (apuesta.player !== null) {
                    const jugador = findPlayerById(apuesta.player);
                    status = jugador ? `${jugador.nombre} hace ${apuesta.predicted_value} rojas` : 'Jugador no encontrado';
                } else {
                    status = 'Jugador no encontrado';
                }
                break;

            case "ASISTENCIA":
                if (apuesta.player !== null) {
                    const jugador = findPlayerById(apuesta.player);
                    status = jugador ? `${jugador.nombre} da ${apuesta.predicted_value} asistencias` : 'Jugador no encontrado';
                } else {
                    status = 'Jugador no encontrado';
                }
                break;

            default:
                status = 'Tipo de apuesta desconocido';
        }

        return {status, date: new Date()};
    });

    const footer = <div className="flex flex-column gap-2 align-items-start">
        <span>Apostado {props.apuesta.amount}XP</span>
        <span>Ganancia {props.apuesta.ganancia_potencial}XP</span>
    </div>

    return (
        <Card
            id={"card"}
            title={title}
            className="w-full xl:w-5 lg:w-5"
            footer={footer}
            header={header}
        >

            <div className="w-full" style={{color: 'white'}}>
                <Timeline className={"w-full md:w-20rem"} align={"alternate"} value={infoApuestas}
                          content={(item) => item.status}/>
            </div>
        </Card>
    );
};

export default ApuestaCard;