import {useContext, useEffect, useState} from "react";
import {MatchContext, MatchContextType} from "../context/MatchsContext";
import {Match} from "../interfaces/Match";
import MatchCard from "./MatchCard";
import ApuestaSideBar from "./ApuestaSideBar";

const MatchsListPage = () => {
    const matchsContext:MatchContextType = useContext<MatchContextType>(MatchContext)
    const [visibleSideBar, setVisibleSideBar] = useState<boolean>(false)
    const [selectedMatch, setSelectedMatch] = useState<Match>()

    useEffect(() => {
        fetchMatchs()
    }, []);

    const fetchMatchs = async ():Promise<void> => {
        await matchsContext.getMatchsList()
    }

    const list = matchsContext.matchs.map((x:Match) => {
        return <MatchCard match={x} setVisibleSideBar={setVisibleSideBar} setSelectedMatch={setSelectedMatch}/>
    })


    return <div className="zoomin animation-duration-400">
        <h1 className="text-center">Listado de Partidos</h1>
        <div className="flex flex-column align-items-center justify-content-center lg:flex-row md:flex-row sm:flex-column gap-3">
            {
                list.length > 0 ? list : "Los partidos no se encuentran disponibles."
            }
        </div>
        <ApuestaSideBar
            visible={visibleSideBar}
            setVisibleSideBar={setVisibleSideBar}
            match={selectedMatch}
        />
    </div>
};

export default MatchsListPage;