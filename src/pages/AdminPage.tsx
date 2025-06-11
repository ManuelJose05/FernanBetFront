import {useEffect, useState} from "react";
import {Team} from "../interfaces/Team";
import {TeamProvider} from "../providers/TeamProvider";
import {showMessage} from "../providers/MessageProvider";
import {AxiosResponse} from "axios";
import {DataTable, DataTableRowEditCompleteEvent} from "primereact/datatable";
import {Column, ColumnEditorOptions} from "primereact/column";
import {Player} from "../interfaces/Player";
import {InputText} from "primereact/inputtext";
import {PlayersProvider} from "../providers/PlayersProvider";
import {UsersProvider} from "../providers/UsersProvider";
import {User} from "../interfaces/User";
import {SortOrder} from "primereact/api";
import AddPlayerDialog from "../components/AddPlayerDialog";
import {Button} from "primereact/button";
import "../styles/Ranking.css"
import AddTeamDialog from "../components/AddTeamDialog";

const AdminPage = () => {
    let teamsProvider: TeamProvider = new TeamProvider();
    let playersProvider:PlayersProvider = new PlayersProvider()
    let userProvider:UsersProvider = new UsersProvider();

    const [equipos, setEquipos] = useState<Team[]>([])
    const [players, setPlayers] = useState<Player[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [reload, setReload] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [visibleAddPlayer, setVisibleAddPlayer] = useState<boolean>(false)
    const [visibleAddTeam, setVisibleAddTeam] = useState<boolean>(false)

    useEffect(() => {
        setLoading(true)
        fetchTeams()
        fetchUsers()
        setLoading(false)
    }, [reload]);

    const fetchUsers = async () => {
        let user:User = JSON.parse(sessionStorage.getItem("user")!);
        try {
            const response:AxiosResponse = await userProvider.getUsersBySchool(user.school_id)
            setUsers(response.data.users)
        } catch (error:any) {
            showMessage({
                severity: "error", summary: "Error",message: "No se ha podido obtener a los usuarios"
            })
        }
    }


    const fetchTeams = async () => {
        try {
            const response: AxiosResponse = await teamsProvider.getAllEquipos();
            setEquipos(response.data.teams);
            addPlayers(response.data.teams);
        } catch (error: any) {
            showMessage({
                severity: "warn", summary: "Teams", message: "No se han podido obtener los equipos"
            })
        }
    }

    const updateTeam = async (team: Team) => {
        try {
            const response:AxiosResponse = await teamsProvider.updateTeamById(team)
            if (response.status === 200) showMessage({
                severity: "success", summary: "Equipo",message: "Successfully updated team"
            })
            return true;
        } catch (error:any) {
            showMessage({
                severity: "warn", summary: "Equipo",message: "Team update failed. Please try again."
            })
            return false;
        }
    }

    const updatePlayer = async (player:Player) => {
        try {
            const response:AxiosResponse = await playersProvider.updatePlayers(player)
            if (response.status === 200) showMessage({
                severity: "success", summary: "Jugador",message: "Successfully updated player"
            })
            return true;
        } catch (error:any) {
            showMessage({
                severity: "warn", summary: "Jugador",message: "Jugador update failed. Please try again."
            })
            return false;
        }
    }

    const updateUser = async (user:User) => {
        try {
            const response:AxiosResponse = await userProvider.updateUser(user)
            if (response.status === 200) showMessage({
                severity: "success", summary: "Usuario",message: "Successfully updated user"
            })
            return true;
        } catch (error:any) {
            showMessage({
                severity: "warn", summary: "Usuario",message: "Usuario update failed. Please try again."
            })
            return false;
        }
    }

    const addPlayers = (teams: Team[]) => {
        const allPlayers = teams.flatMap((x: Team) => x.jugadores);
        setPlayers(allPlayers);
    }

    const textEditor = (options: ColumnEditorOptions) => {
        return <InputText type="text" value={options.value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.editorCallback!(e.target.value)} />;
    };

    const onRowEditComplete = async (e: DataTableRowEditCompleteEvent) => {
        if (await updateTeam(e.newData as Team)) {
            setEquipos((prevState:Team[]):Team[] => {
                const updated = prevState.map(team =>
                    team.id === e.newData.id ? e.newData as Team : team
                );
                return updated;
            });
            setReload(prevState => !prevState);
        }
    };

    const onRowEditCompletePlayers = async (e: DataTableRowEditCompleteEvent) => {
        if (await updatePlayer(e.newData as Player)) {
            setPlayers((prevState:Player[]):Player[] => {
                const updated = prevState.map(player =>
                    player.id === e.newData.id ? e.newData as Player : player
                );
                return updated;
            });
            setReload(prevState => !prevState);
        }
    };

    const onRowEditCompleteUser = async (e: DataTableRowEditCompleteEvent) => {
        if (await updateUser(e.newData as User)) {
            setUsers((prevState:User[]):User[] => {
                const updated = prevState.map(user =>
                    user.id === e.newData.id ? e.newData as User : user
                );
                return updated;
            });
            setReload(prevState => !prevState);
        }
    };

    const allowEdit = () => {
        return true;
    };


    const equiposTable = (
        <div>
            <Button label="Añadir equipo" onClick={event => setVisibleAddTeam(true)} />
            <DataTable
                id={"ranking"}
                loading={loading}
                value={equipos}
                editMode="row" dataKey="id"
                onRowEditComplete={onRowEditComplete} sortField="id" sortOrder={SortOrder.ASC}
                emptyMessage={"No hay registros de equipos"}
            >
                <Column header={"ID"} field={"id"}></Column>
                <Column header={"Nombre"} field={"nombre"} editor={options => textEditor(options)}></Column>
                <Column header={"Entrenador"} field={"entrenador"} editor={options => textEditor(options)}></Column>
                <Column header={"Puntos"} field={"puntos"} editor={options => textEditor(options)}></Column>
                <Column header={"Victorias"} field={"victorias"} editor={options => textEditor(options)}></Column>
                <Column header={"Empates"} field={"empates"} editor={options => textEditor(options)}></Column>
                <Column header={"Derrotas"} field={"derrotas"} editor={options => textEditor(options)}></Column>
                <Column header={"GF"} field={"gf"} editor={options => textEditor(options)}></Column>
                <Column header={"GC"} field={"gc"} editor={options => textEditor(options)}></Column>
                <Column header={"PJ"} field={"pj"} editor={options => textEditor(options)}></Column>
                <Column header={"Editar"} rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
            </DataTable>
        </div>
    )

    const playerTable = (
        <div className="">
            <Button label={"Añadir Jugador"} onClick={event => setVisibleAddPlayer(true)} />
            <DataTable
                id={"ranking"}
                loading={loading} value={players} editMode="row" dataKey="id" onRowEditComplete={onRowEditCompletePlayers} sortField="id" sortOrder={SortOrder.ASC}
                emptyMessage={"No hay registros de jugadores"}
            >
                <Column header={"ID"} field={"id"}></Column>
                <Column header={"Nombre"} field={"nombre"} editor={options => textEditor(options)}></Column>
                <Column header={"Posición"} field={"posicion"} editor={options => textEditor(options)}></Column>
                <Column header={"Dorsal"} field={"dorsal"} editor={options => textEditor(options)}></Column>
                <Column header={"Goles"} field={"goles"} editor={options => textEditor(options)}></Column>
                <Column header={"Amarillas"} field={"amarillas"} editor={options => textEditor(options)}></Column>
                <Column header={"Rojas"} field={"rojas"} editor={options => textEditor(options)}></Column>
                <Column header={"Asistencias"} field={"asistencias"} editor={options => textEditor(options)}></Column>
                <Column header={"Equipo"} field={"equipo"} editor={options => textEditor(options)}></Column>
                <Column header={"Editar"} rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
            </DataTable>
        </div>
    )

    const userTable = (
        <DataTable id={"ranking"} loading={loading} value={users} editMode="row" dataKey="id" onRowEditComplete={onRowEditCompleteUser} sortField="id" sortOrder={SortOrder.ASC}
        emptyMessage={"No hay registros de usuarios"}
        >
            <Column header={"ID"} field={"id"}></Column>
            <Column header={"Username"} field={"username"} editor={options => textEditor(options)}></Column>
            <Column header={"First name"} field={"first_name"} editor={options => textEditor(options)}></Column>
            <Column header={"Last name"} field={"last_name"} editor={options => textEditor(options)}></Column>
            <Column header={"Email"} field={"email"} editor={options => textEditor(options)}></Column>
            <Column header={"Experience"} field={"experience"} editor={options => textEditor(options)}></Column>
            <Column header={"Level"} field={"level"}></Column>
            <Column header={"Curso"} field={"course"} editor={options => textEditor(options)}></Column>
            <Column header={"Admin"} field={"is_superuser"} editor={options => textEditor(options)}></Column>
            <Column header={"Editar"} rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
        </DataTable>
    )

    return (
        <div className="flex flex-column gap-3 zoomin animation-duration-500">
            <section>
                <h4>Listado de Equipos</h4>
                {equiposTable}
            </section>
            <section>
                <h4>Listado de Jugadores</h4>
                {playerTable}
            </section>
            <section>
                <h4>Listado de Usuarios</h4>
                {userTable}
            </section>
            <AddPlayerDialog visible={visibleAddPlayer} setVisible={setVisibleAddPlayer} equipos={equipos} setReload={setReload} />
            <AddTeamDialog visible={visibleAddTeam} setVisible={setVisibleAddTeam} setReload={setReload} />
        </div>
    );
};

export default AdminPage;