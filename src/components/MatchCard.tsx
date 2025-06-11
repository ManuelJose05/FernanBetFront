import {Match} from "../interfaces/Match";
import {Card} from "primereact/card";
import {Divider} from "primereact/divider";
import {formateFecha} from "../utils/formateFecha";
import "../styles/MatchCard.css"
import {Chip} from "primereact/chip";
import {Timeline} from "primereact/timeline";
import {PlayerStat} from "../interfaces/PlayerStat";
import {useContext, useEffect} from "react";
import {UserContext, UserContextType} from "../context/UserContext";

interface MatchCardProps {
    match: Match,
    setVisibleSideBar: (visible: boolean) => void,
    setSelectedMatch: (match: Match) => void,
}

const MatchCard = (props: MatchCardProps) => {
    const userContext:UserContextType = useContext<UserContextType>(UserContext);
    const getMatchStatusChip = (status: string) => {
        switch (status) {
            case "PROGRAMADO":
                return 'pi pi-clock'
            case 'CURSO':
                return 'pi pi-spin pi-spinner'
            case 'FINALIZADO':
                return 'pi pi-check-circle'
            case 'POSPUESTO':
                return 'pi pi-clock'
            case 'CANCELADO':
                return 'pi pi-times-circle'
        }
    }

    const playersStats = props.match.player_stats.map((stat: PlayerStat) => {
        let label = '';
        let icon = '';
        let color = '';

        switch (stat.stat_type) {
            case "GOL":
                label = `${stat.value} ${stat.value > 1 ? "goles":"gol"} de ${stat.player.nombre}`;
                icon = "pi pi-bullseye";
                color = "#4CAF50";
                break;
            case "AMARILLA":
                label = `${stat.value} ${stat.value > 1 ? "amarillas":"amarilla"} para ${stat.player.nombre}`;
                icon = "pi pi-clone";
                color = "#FFEB3B";
                break;
            case "ROJA":
                label = `${stat.value} ${stat.value > 1 ? "rojas":"roja"} para ${stat.player.nombre}`;
                icon = "pi pi-clone";
                color = "#F44336";
                break;
            case "ASISTENCIA":
                label = `${stat.value} ${stat.value > 1 ? "asistencias":"asistencia"} de ${stat.player.nombre}`;
                icon = "pi pi-reply";
                color = "#2196F3";
                break;
            default:
                label = `Estadística desconocida`;
                icon = "pi pi-question";
                color = "#9E9E9E";
        }

        return {
            label,
            icon,
            color
        };
    });

    const title = <div className="flex justify-content-center">
        <Chip label={props.match.status} icon={getMatchStatusChip(props.match.status)}/>
    </div>

    return (
        <Card id="card" title={title} onClick={() => {
            props.setSelectedMatch(props.match)
            if (props.match.status !== "FINALIZADO" || userContext.currentUser.is_superuser) props.setVisibleSideBar(true)
        }} className={"w-full"}
        >
            <div className="flex flex-row gap-5 align-items-center justify-content-center">
                <div className="flex flex-column gap-2 align-items-center justify-content-center">
                    <span>{props.match.local_team.nombre}</span>
                    <span className="font-bold" style={{fontSize: '1.5rem'}}>
                        {props.match.local_team_score !== null ? props.match.local_team_score : '0'}
                    </span>
                </div>

                <div className="flex flex-column gap-2 align-items-center justify-content-center">
                    <span>{props.match.away_team.nombre}</span>
                    <span className="font-bold" style={{fontSize: '1.5rem'}}>
                        {props.match.away_team_score !== null ? props.match.away_team_score : '0'}
                    </span>
                </div>
            </div>

            <Divider/>

            <div className="text-center">
                <p><b>Fecha: </b>{formateFecha(props.match.date)}</p>
                {props.match.referee && <p><b>Árbitro: </b>{props.match.referee}</p>}
                {props.match.school_id && <p><b>Estadio: </b>Fernando III</p>}
            </div>

            <div className="w-full" style={{color: 'white'}}>
                <h4 className="text-center">Estadísticas</h4>
                <Timeline
                    className="w-full md:w-20rem"
                    align="alternate"
                    value={playersStats}
                    content={(item) => <div>
                        <small>{item.label}</small>
                    </div>}
                    marker={(item) => {
                        return <i className={item.icon} style={{color: item.color}}/>
                    }}
                />
            </div>
        </Card>
    );
};

export default MatchCard;