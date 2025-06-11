import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Sidebar} from "primereact/sidebar";
import {Button} from "primereact/button";
import {Match} from "../interfaces/Match";
import {MatchsProvider} from "../providers/MatchsProvider";
import {showMessage} from "../providers/MessageProvider";
import {AxiosResponse} from "axios";
import {Dropdown} from "primereact/dropdown";
import {InputNumber} from "primereact/inputnumber";
import {FloatLabel} from "primereact/floatlabel";
import {Player} from "../interfaces/Player";

interface AdminMatchStatsProps {
    visible: boolean
    setVisibleSideBar: Dispatch<SetStateAction<boolean>>
    match: Match | undefined;
}

const MATCH_STATUS = {
    PROGRAMADO: "PROGRAMADO",
    CURSO: "CURSO",
    FINALIZADO: "FINALIZADO",
    POSPUESTO: "POSPUESTO",
    CANCELADO: "CANCELADO"
} as const;


const AdminMatchStats = (props: AdminMatchStatsProps) => {
    const {visible, setVisibleSideBar, match} = props;
    const [fullscreen, setFullscreen] = useState<boolean>(false)
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
    const [selectedStat, setSelectedStat] = useState<string>("")
    const [statValue, setStatValue] = useState<number>(0)
    let provider: MatchsProvider = new MatchsProvider();

    useEffect(() => {
    }, []);

    const updateMatchStats = async () => {
        if (!selectedStat || !selectedPlayer) return;

        let goles;
        const localScore = match?.local_team_score ?? 0;
        const awayScore = match?.away_team_score ?? 0;

        const isLocalPlayer = match?.local_team.jugadores.find(
            (x: Player) => x.id === selectedPlayer.id
        ) !== undefined;

        if (selectedStat === "GOL") {
            goles = isLocalPlayer
                ? { goles_local: localScore + 1, goles_away: awayScore }
                : { goles_local: localScore, goles_away: awayScore + 1 };
        } else {
            goles = { goles_local: localScore, goles_away: awayScore };
        }

        const body = {
            ...goles,
            stats: [
                {
                    player_id: selectedPlayer.id,
                    stat_type: selectedStat,
                    value: statValue
                }
            ]
        };
        try {
            const response:AxiosResponse = await provider.updateMatchStats(match?.id,body)
            if (response.status === 200) {
                showMessage({
                    severity: "info", summary: "Partido", message: "Partido actualizado correctamente"
                })
            }
        } catch (error:any) {
            showMessage({
                severity: "error", summary: "Partido", message: "Partido no actualizado correctamente"
            })
        }
        setVisibleSideBar(false)
    }

    const updateMatchStatus = async (status: string) => {
        if (!match) return;
        try {
            const response: AxiosResponse = status !== MATCH_STATUS.FINALIZADO ?
                await provider.updateMatchStatus(match?.id, status)
                :
                await provider.finishMatch({
                    id: match.id,
                    goles_local: match.local_team_score,
                    goles_away: match.away_team_score,
                })
            if (response.status === 200) {
                showMessage({
                    severity: "info", message: "Successfully updated match status", summary: "Match"
                })
            }
        } catch (error: any) {
            showMessage({
                severity: "error", summary: "Match status", message: "No se ha podido actualizar el estado del partido"
            })
        }
        setVisibleSideBar(false)
    }

    const playerStats = (
        <section>
            <div className="mt-2 flex flex-column gap-1 align-items-center justify-content-center">
                <p>Jugadores Locales </p>
                <Dropdown placeholder="Selecciona un jugador" value={selectedPlayer} optionLabel={"nombre"} options={match?.local_team.jugadores}
                onChange={event => setSelectedPlayer(event.target.value)}
                />
            </div>
            <div className="mt-2 flex flex-column gap-1 align-items-center justify-content-center">
                <p>Jugadores Visitantes </p>
                <Dropdown placeholder="Selecciona un jugador" value={selectedPlayer} optionLabel={"nombre"} options={match?.away_team.jugadores}
                          onChange={event => setSelectedPlayer(event.target.value)}/>
            </div>
            <div className="mt-2 flex flex-column gap-1 align-items-center justify-content-center">
                <p>Stats</p>
                <Dropdown placeholder="Selecciona un stat" value={selectedStat} options={["GOL","ASISTENCIA","AMARILLA","ROJA"]}
                onChange={event => setSelectedStat(event.target.value)}
                />
                <FloatLabel className="mt-4">
                    <InputNumber value={statValue} id={"value"} name="value" onChange={(e) => setStatValue(e.value!)} />
                    <label htmlFor={"value"} >Valor</label>
                </FloatLabel>
                <Button label={"Añadir stats"} onClick={async () => await updateMatchStats()} />
            </div>
        </section>
    )

    const content = (
        <div className="flex flex-column gap-2 align-items-center">
            <Button label={"Programar Partido"} onClick={async () => await updateMatchStatus(MATCH_STATUS.PROGRAMADO)}/>
            <Button label={"Iniciar Partido"} onClick={async () => await updateMatchStatus(MATCH_STATUS.CURSO)}/>
            <Button label={"Posponer partido"}
                    onClick={async () => await updateMatchStatus(MATCH_STATUS.POSPUESTO)}/>
            <Button label={"Cancelar partido"}
                    onClick={async () => await updateMatchStatus(MATCH_STATUS.CANCELADO)}/>
            <Button label={"Finalizar partido"}
                    onClick={async () => await updateMatchStatus(MATCH_STATUS.FINALIZADO)}/>
        </div>
    )

    return (
        <Sidebar
            header={"Stats del Partido"}
            fullScreen={fullscreen}
            visible={visible}
            onHide={() => setVisibleSideBar(false)}
        >
            {content}
            {playerStats}
        </Sidebar>
    );
};

export default AdminMatchStats;