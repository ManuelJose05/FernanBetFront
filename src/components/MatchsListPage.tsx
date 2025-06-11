import {useContext, useEffect, useState} from "react";
import {MatchContext, MatchContextType} from "../context/MatchsContext";
import {Match} from "../interfaces/Match";
import MatchCard from "./MatchCard";
import ApuestaSideBar from "./ApuestaSideBar";
import {UserContext, UserContextType} from "../context/UserContext";
import AdminMatchStats from "./AdminMatchStats";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {Dropdown} from "primereact/dropdown";
import {TeamProvider} from "../providers/TeamProvider";
import {Team} from "../interfaces/Team";
import {AxiosResponse} from "axios";
import {FloatLabel} from "primereact/floatlabel";
import {InputText} from "primereact/inputtext";
import {Nullable} from "primereact/ts-helpers";
import {Calendar} from "primereact/calendar";
import {MatchsProvider} from "../providers/MatchsProvider";
import {showMessage} from "../providers/MessageProvider";

const MatchsListPage = () => {
    let teamProvider:TeamProvider = new TeamProvider()
    let matchProvider:MatchsProvider = new MatchsProvider()

    const matchsContext:MatchContextType = useContext<MatchContextType>(MatchContext)
    const userContext:UserContextType = useContext<UserContextType>(UserContext)
    const [visibleSideBar, setVisibleSideBar] = useState<boolean>(false)
    const [selectedMatch, setSelectedMatch] = useState<Match>()
    const [dialog, setDialog] = useState<boolean>(false)
    const [teams, setTeams] = useState<Team[]>([])
    const [date, setDate] = useState<Nullable<Date>>(null);
    const [referee, setReferee] = useState<string>("")
    const [localTeam, setLocalTeam] = useState<Team | null>(null)
    const [awayTeam, setAwayTeam] = useState<Team | null>(null)

    useEffect(() => {
        fetchMatchs()
        fetchUser()
    }, [visibleSideBar]);

    useEffect(() => {
        if (dialog) fetchTeams()
    }, [dialog]);

    const fetchAddMatch = async () => {
        if (date === null || referee === ""  || awayTeam === null || localTeam === null) return;
        const body = {
            "local_team": localTeam?.id,
            "local_team_score": 0,
            "away_team": awayTeam?.id,
            "away_team_score": 0,
            "date": date,
            "status": "PROGRAMADO",
            "referee": referee,
            "school": userContext.currentUser.school_id
        }

        try {
            const response:AxiosResponse = await matchProvider.createMatch(body)
            if (response.status === 201) {
                showMessage({
                    severity: "success", summary: "Partido", message: "Partido agregado correctamente"
                })
            }
        } catch (error:any) {
            showMessage({
                severity: "error",summary: "Partido", message: "No se ha podido agregar el partido",
            })
        }
    }

    const fetchTeams = async () => {
        try {
            const response:AxiosResponse = await teamProvider.getAllEquipos()
            setTeams(response.data.teams)
        } catch (error:any) {

        }
    }

    const fetchUser = async () => {
        await userContext.reloadUser()
    }

    const fetchMatchs = async ():Promise<void> => {
        await matchsContext.getMatchsList()
    }

    const list = matchsContext.matchs.map((x:Match) => {
        return <MatchCard match={x} setVisibleSideBar={setVisibleSideBar} setSelectedMatch={setSelectedMatch}/>
    })

    const dialogContent = (
        <div className="w-full flex flex-column gap-2 align-items-center justify-content-center">
            <section className="flex flex-column gap-1 align-items-center">
                <p>Equipo Local</p>
                <Dropdown value={localTeam}  options={teams} optionLabel="nombre" onChange={event => setLocalTeam(event.target.value)}/>
            </section>
            <section className="flex flex-column gap-1 align-items-center">
                <p>Equipo Visitante</p>
                <Dropdown value={awayTeam} options={teams} optionLabel="nombre" onChange={event => setAwayTeam(event.target.value)}/>
            </section>
            <FloatLabel className={"mt-4"}>
                <label>Árbitro</label>
                <InputText id="arbitro" name={"arbitro"} value={referee} onChange={(e)=>setReferee(e.target.value)} />
            </FloatLabel>
            <FloatLabel className={"mt-4"}>
                <label className="font-bold block mb-2">
                    Fecha
                </label>
                <Calendar placeholder="Selecciona la fecha" value={date} onChange={(e) => setDate(e.value)} showIcon  />
            </FloatLabel>
            <Button label={"Añadir partido"} onClick={async () => await fetchAddMatch()} />
        </div>
    )


    return <div className="zoomin animation-duration-400">
        <h1 className="text-center">Listado de Partidos</h1>
        {
            userContext.currentUser.is_superuser && <Button className="flex justify-content-center align-items-center" label={"Añadir nuevo Partido"}
            onClick={() => setDialog(true)}
            />
        }
        <div className="flex flex-column align-items-center justify-content-center lg:flex-row md:flex-column sm:flex-column gap-3">
            {
                list.length > 0 ? list : "Los partidos no se encuentran disponibles."
            }
        </div>
        {
            !userContext.currentUser.is_superuser ?
                <ApuestaSideBar
                visible={visibleSideBar}
                setVisibleSideBar={setVisibleSideBar}
                match={selectedMatch}
            />
                :
                <AdminMatchStats visible={visibleSideBar} setVisibleSideBar={setVisibleSideBar} match={selectedMatch} />
        }
        <Dialog
            style={{width: '85%'}}
            blockScroll={true}
            position={"center"}
            header={"Nuevo Partido"}
            visible={dialog}
            onHide={() => setDialog(false)} >
            {dialogContent}
        </Dialog>
    </div>
};

export default MatchsListPage;