import {Sidebar} from "primereact/sidebar";
import {Column} from "primereact/column";
import {Match} from "../interfaces/Match";
import {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {Player} from "../interfaces/Player";
import {InputNumber} from "primereact/inputnumber";
import {FloatLabel} from "primereact/floatlabel";
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import {User} from "../interfaces/User";
import {ApuestasProvider} from "../providers/ApuestasProvider";
import {showMessage} from "../providers/MessageProvider";
import {UserContext, UserContextType} from "../context/UserContext";
import {AxiosResponse} from "axios";

interface ApuestaSideBarProps {
    visible: boolean;
    setVisibleSideBar: (visible: boolean) => void;
    match?: Match;
}

const ApuestaSideBar = (props: ApuestaSideBarProps) => {
    let provider:ApuestasProvider = new ApuestasProvider();
    const [xpApostado, setXpApostado] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)
    const userContext:UserContextType = useContext<UserContextType>(UserContext);

    // Jugadores por equipo
    const [teamAPlayers, setTeamAPlayers] = useState<Player[]>([]);
    const [teamBPlayers, setTeamBPlayers] = useState<Player[]>([]);

    useEffect(() => {
        setLoading(true);

        return () => {
            setTeamAPlayers([]);
            setTeamBPlayers([]);
        }
    }, []);

    useEffect(() => {
        setLoading(false);

        //Evitar tener referencias duplicadas
        setTeamAPlayers(JSON.parse(JSON.stringify(props.match?.local_team.jugadores || [])))
        setTeamBPlayers(JSON.parse(JSON.stringify(props.match?.away_team.jugadores || [])))

        if (props.match) {
            setTeamAPlayers(props.match?.local_team.jugadores)
            setTeamBPlayers(props.match?.away_team.jugadores)
        }
    }, [props]);


    const handleStatChange = (
        setPlayers: Dispatch<SetStateAction<Player[]>>,
        id: number,
        stat: keyof Omit<Player, "id" | "name">,
        value: number | null
    ) => {
        setPlayers(prevPlayers => {
            const index:number = prevPlayers.findIndex((p:Player):boolean => p.id === id);
            if (index === -1) return prevPlayers;
            const updated:Player[] = [...prevPlayers];
            updated[index] = {...updated[index], [stat]: value};
            return updated;
        });
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
            onChange={(e) => {
                handleStatChange(setPlayers, rowData.id, stat, e.value ?? 0);
            }
            }
        />
    );

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const user: User = JSON.parse(sessionStorage.getItem("user")!) as User;

        if (user.experience < xpApostado) {
            showMessage({
                severity: "info", summary: "Cantidad", message: "No tienes suficiente XP para hacer la predicción"
            })
            return;
        }
        const bodyApuesta = {
            user: user.id,
            amount: xpApostado,
            conditions: handleContitions()
        }

        try {
            const response:AxiosResponse = await provider.createApuesta(bodyApuesta);
            if (response.status === 201) {
                props.setVisibleSideBar(false)
                showMessage({
                    severity: "success", summary: "Predicción", message: "Predicción elaborada con éxito."
                })
                if (sessionStorage.getItem("user") !== null) {
                    const user:User = JSON.parse(sessionStorage.getItem("user")!);
                    user.experience -= xpApostado;
                    userContext.setCurrentUser(user)
                    sessionStorage.setItem("user", JSON.stringify(user));
                }
            }
        } catch (error:any) {
            props.setVisibleSideBar(false)
            showMessage({
                severity: "error", summary: "Predicción", message: error.response.data.message
            })
        }
        setXpApostado(0)
    }

    const handleContitions = () => {
        let body: any[] = []
        type StatType = 'goles' | 'asistencias' | 'rojas' | 'amarillas';

        teamAPlayers.map((player: Player) => {
            if (player.goles === 0 && player.amarillas === 0 && player.rojas === 0 && player.asistencias === 0) return;

            (['goles', 'asistencias', 'rojas', 'amarillas'] as const).forEach((stat: StatType) => {
                let statApuesta: string;

                switch (stat) {
                    case 'goles':
                        statApuesta = "GOL";
                        break;
                    case 'asistencias':
                        statApuesta = "ASISTENCIA";
                        break;
                    case 'rojas':
                        statApuesta = "ROJA";
                        break;
                    case 'amarillas':
                        statApuesta = "AMARILLA";
                        break;
                    default:
                        statApuesta = "";
                }

                if (player[stat] > 0) {
                    body.push({
                        type: 'player',
                        match: props.match!.id,
                        predicted_value: player[stat],
                        stat_type: statApuesta,
                        player: player.id
                    });
                }
            });
        })

        teamBPlayers.map((player: Player) => {
            if (player.goles === 0 && player.amarillas === 0 && player.rojas === 0 && player.asistencias === 0) return;
            (['goles', 'asistencias', 'rojas', 'amarillas'] as const).forEach((stat: StatType) => {
                let statApuesta: string;

                switch (stat) {
                    case 'goles':
                        statApuesta = "GOL";
                        break;
                    case 'asistencias':
                        statApuesta = "ASISTENCIA";
                        break;
                    case 'rojas':
                        statApuesta = "ROJA";
                        break;
                    case 'amarillas':
                        statApuesta = "AMARILLA";
                        break;
                    default:
                        statApuesta = "";
                }
                if (player[stat] > 0) {
                    body.push({
                        type: 'player',
                        match: props.match!.id,
                        predicted_value: player[stat],
                        stat_type: statApuesta,
                        player: player.id
                    });
                }
            });
        })
        return body;
    }


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
                    <h3 className="mb-2">{props.match?.local_team?.nombre ?? ""}</h3>
                    <DataTable loading={loading} value={teamAPlayers} emptyMessage="No hay jugadores disponibles">
                        <Column align="center" field="nombre" header="Jugador"/>
                        <Column align="center" header="Goles"
                                body={(row) => renderInput(row, "goles", teamAPlayers, setTeamAPlayers)}/>
                        <Column align="center" header="Amarillas"
                                body={(row) => renderInput(row, "amarillas", teamAPlayers, setTeamAPlayers)}/>
                        <Column align="center" header="Rojas"
                                body={(row) => renderInput(row, "rojas", teamAPlayers, setTeamAPlayers)}/>
                        <Column align="center" header="Asistencias"
                                body={(row) => renderInput(row, "asistencias", teamAPlayers, setTeamAPlayers)}/>
                    </DataTable>
                </div>

                <div className="card w-full">
                    <h3 className="mb-2">{props.match?.away_team?.nombre ?? ""}</h3>
                    <DataTable loading={loading} value={teamBPlayers} emptyMessage="No hay jugadores disponibles">
                        <Column align="center" field="nombre" header="Jugador"/>
                        <Column align="center" header="Goles"
                                body={(row) => renderInput(row, "goles", teamBPlayers, setTeamBPlayers)}/>
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
                <Button label="Confirmar Apuesta" icon="pi pi-check" onClick={handleSubmit}/>
            </div>
        </div>
    </Sidebar>
}

export default ApuestaSideBar;