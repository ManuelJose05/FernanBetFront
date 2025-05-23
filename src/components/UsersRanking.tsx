import {useContext, useEffect, useState} from "react";
import {UserContext} from "../context/UserContext";
import {User} from "../interfaces/User";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Tag} from "primereact/tag";
import {useNavigate} from "react-router";
import {LevelIcons} from "../interfaces/level_icons";
import {SortOrder} from "primereact/api";
import {useAuth} from "../hooks/useAuth";
import {LEVELS_SEVERITY} from "../data/UsersRankingLevels";
import "../styles/Ranking.css"
import {showMessage} from "../providers/MessageProvider";

function UsersRanking() {
    const {getUsersRanking} = useContext(UserContext);
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const logged:boolean = useAuth()
    const navigate = useNavigate();

    useEffect(() => {
        if (!logged) navigate("/login");
        fetchUserRanking();
    },[])

    const fetchUserRanking = async () => {
        try {
            setLoading(true);
            const ranking:User[] = await getUsersRanking();
            setUsers(ranking)
            setLoading(false);
        } catch (error) {
            showMessage({
                severity: "warn",
                summary: "Error",
                message: "No se ha podido obtener el ranking de usuarios."
            })
        }
    }

    const getLevelSeverity = (level: string):string => {
        return LEVELS_SEVERITY.get(level) ?? 'warning';
    };

    const levelTag = (user: User) => {
        const [levelKey, levelLabel] = user.level;
        const icon:LevelIcons = LevelIcons[levelKey as keyof typeof LevelIcons];
        const severity:string = getLevelSeverity(levelKey);

        return (
            <Tag
                value={levelLabel}
                // @ts-ignore
                severity={severity}
                icon={icon}
                className="text-sm font-bold px-2 py-1"
            />
        );
    };

    const usernameBody = (user: User) => {
        return (
            <span>
            {user.username}
            </span>
        );
    };


    return (
        <div className="flex flex-column gap-2 align-items-center justify-content-center zoomin animation-duration-400 w-full">
            <h2 className="text-center">Ranking de Usuarios</h2>
            <div className="p-1 w-screen xl:w-6 lg:w-6 md:w-full sm:w-full">
                <DataTable id="ranking" value={users} rows={users.length} dataKey={"id"} emptyMessage="No users found"
                           sortField="experience" sortOrder={SortOrder.DESC} loading={loading}
                >
                    <Column
                        align={"center"}
                        header="#"
                        body={(rowData, options) => options.rowIndex + 1}
                    />
                    <Column align={"center"} field="username" header="Usuario" body={usernameBody} />
                    <Column align={"center"} field="experience" header="XP" />
                    <Column align={"center"} field="level" header="Nivel" body={levelTag}/>
                </DataTable>
            </div>
        </div>
    );
}

export default UsersRanking;