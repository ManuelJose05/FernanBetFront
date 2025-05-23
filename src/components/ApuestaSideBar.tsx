import {Sidebar} from "primereact/sidebar";
import {Column} from "primereact/column";
import {Match} from "../interfaces/Match";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Player} from "../interfaces/Player";
import {InputNumber} from "primereact/inputnumber";
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import {FloatLabel} from "primereact/floatlabel";
import {Card} from "primereact/card";
import {TeamProvider} from "../providers/TeamProvider";
import {Team} from "../interfaces/Team";
import {showMessage} from "../providers/MessageProvider";

interface ApuestaSideBarProps {
    visible: boolean;
    setVisibleSideBar: (visible: boolean) => void;
    match?: Match;
}

const ApuestaSideBar = (props: ApuestaSideBarProps) => {
    const [xpApostado, setXpApostado] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)

    // Jugadores por equipo
    const [teamAPlayers, setTeamAPlayers] = useState<Player[]>([]);
    const [teamBPlayers, setTeamBPlayers] = useState<Player[]>([]);

    //Equipos
    const [local, setLocal] = useState<Team>()
    const [visitante,setVisitante] = useState<Team>()

    let teamProvider:TeamProvider = new TeamProvider();

    useEffect(() => {
        setLoading(true);
        if (props.match) {
            setTeamAPlayers(props.match.local_team.jugadores)
            setTeamBPlayers(props.match.away_team.jugadores)
            fetchTeam(props.match.local_team.id)
            fetchTeam(props.match.away_team.id)
        }
    }, []);

    useEffect(() => {
        setLoading(false);
    }, [props]);

    const fetchTeam = async (idEquipo:number) => {
        try {
            const response = await teamProvider.getTeamById(idEquipo);
            if (response.data.team) {
                response.data.team.id === props.match?.local_team.id ? setLocal(response.data.team) : setVisitante(response.data.team);
            }
        } catch (error) {
            showMessage({
                severity: "error",
                summary: "Failed Fetching",
                message: "Failed to fetch team",
            })
        }
    }

    const handleStatChange = (players: Player[], setPlayers: Dispatch<SetStateAction<Player[]>>, id: number, stat: keyof Omit<Player, "id" | "name">, value: number | null) => {
        const updated: Player[] = players.map((p) =>
            p.id === id ? {...p, [stat]: value} : p
        );
        setPlayers(updated);
    };

    const renderInput = (
        rowData: Player,
        stat: keyof Omit<Player, "id" | "name">,
        players: Player[],
        setPlayers: Dispatch<SetStateAction<Player[]>>,
    ) => (
        <InputNumber
            value={rowData[stat] as number}
            min={0}
            onChange={(e) =>
                handleStatChange(players, setPlayers, rowData.id, stat, e.value!)
            }
        />
    );

    return <Sidebar
        fullScreen
        position="right"
        onHide={() => props.setVisibleSideBar(false)}
        visible={props.visible}>
        <div className="flex flex-column gap-3 align-items-center justify-content-center w-full">
            <h2>Apostar</h2>

            <FloatLabel>
                <InputNumber id="xp" value={xpApostado} onValueChange={(e) => setXpApostado(e.value!)} suffix=" XP"/>
                <label htmlFor="xp">Cantidad de XP a apostar</label>
            </FloatLabel>


            <div className="flex flex-column gap-5 align-items-center justify-content-center w-full">
                <div className="card w-full">
                    <h3 className="mb-2">{local?.nombre ?? ""}</h3>
                    <DataTable loading={loading} value={teamAPlayers} emptyMessage="No hay jugadores disponibles">
                        <Column align="center" field="nombre" header="Jugador"/>
                        <Column align="center" header="Goles"
                                body={(row) => renderInput(row, "goles", teamAPlayers, setTeamAPlayers)}/>
                        <Column align="center" header="Faltas"
                                body={(row) => renderInput(row, "faltas", teamAPlayers, setTeamAPlayers)}/>
                        <Column align="center" header="Amarillas"
                                body={(row) => renderInput(row, "amarillas", teamAPlayers, setTeamAPlayers)}/>
                        <Column align="center" header="Rojas"
                                body={(row) => renderInput(row, "rojas", teamAPlayers, setTeamAPlayers)}/>
                        <Column align="center" header="Asistencias"
                                body={(row) => renderInput(row, "asistencias", teamAPlayers, setTeamAPlayers)}/>
                    </DataTable>
                </div>

                <div className="card w-full">
                    <h3 className="mb-2">{visitante?.nombre ?? ""}</h3>
                    <DataTable loading={loading} value={teamBPlayers} emptyMessage="No hay jugadores disponibles">
                        <Column align="center" field="nombre" header="Jugador"/>
                        <Column align="center" header="Goles"
                                body={(row) => renderInput(row, "goles", teamBPlayers, setTeamBPlayers)}/>
                        <Column align="center" header="Faltas"
                                body={(row) => renderInput(row, "faltas", teamBPlayers, setTeamBPlayers)}/>
                        <Column align="center" header="Amarillas"
                                body={(row) => renderInput(row, "amarillas", teamBPlayers, setTeamBPlayers)}/>
                        <Column align="center" header="Rojas"
                                body={(row) => renderInput(row, "rojas", teamBPlayers, setTeamBPlayers)}/>
                        <Column align="center" header="Asistencias"
                                body={(row) => renderInput(row, "asistencias", teamBPlayers, setTeamBPlayers)}/>
                    </DataTable>
                </div>
            </div>

            <div className="mt-4">
                <Button label="Confirmar Apuesta" icon="pi pi-check"/>
            </div>
        </div>
    </Sidebar>
}

export default ApuestaSideBar;