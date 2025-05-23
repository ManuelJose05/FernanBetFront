import {Match} from "../interfaces/Match";
import {Card} from "primereact/card";
import {Divider} from "primereact/divider";
import {formateFecha} from "../utils/formateFecha";
import "../styles/MatchCard.css"
import {Chip} from "primereact/chip";

interface MatchCardProps {
    match: Match,
    setVisibleSideBar: (visible: boolean) => void,
    setSelectedMatch: (match: Match) => void,
}

const MatchCard = (props:MatchCardProps) => {
    const getMatchStatusChip = (status:string) => {
        switch (status) {
            case "PROGRAMADO":
                return 'pi pi-clock'
            case 'CURSO':
                return 'pi pi-play'
            case 'FINALIZADO':
                return 'pi pi-check-circle'
            case 'POSPUESTO':
                return 'pi pi-clock'
            case 'CANCELADO':
                return 'pi pi-times-circle'
        }
    }

    const title= <div className="flex justify-content-center">
        <Chip label={props.match.status} icon={getMatchStatusChip(props.match.status)} />
    </div>

    return (
        <Card id="card" title={title} onClick={() => {
            props.setSelectedMatch(props.match)
            props.setVisibleSideBar(true)
        }}>
            <div className="flex flex-row gap-5 align-items-center justify-content-center">
                <div className="flex flex-column gap-2 align-items-center justify-content-center">
                    <span>{props.match.local_team.nombre}</span>
                    <span className="font-bold" style={{ fontSize: '1.5rem' }}>
                        {props.match.local_team_score !== null ? props.match.local_team_score : ''}
                    </span>
                </div>

                <div className="flex flex-column gap-2 align-items-center justify-content-center">
                    <span>{props.match.away_team.nombre}</span>
                    <span className="font-bold" style={{fontSize: '1.5rem' }}>
                        {props.match.away_team_score !== null ? props.match.away_team_score : ''}
                    </span>
                </div>
            </div>

            <Divider />

            <div className="text-center">
                <p><b>Fecha: </b>{formateFecha(props.match.date)}</p>
                {props.match.referee && <p><b>Árbitro: </b>{props.match.referee}</p>}
                {props.match.school_id && <p><b>Estadio: </b>Fernando III</p>}
            </div>
        </Card>
    );
};

export default MatchCard;