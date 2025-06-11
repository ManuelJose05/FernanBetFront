import {useContext, useEffect, useState} from "react";
import {ApuestasProvider} from "../providers/ApuestasProvider";
import {Apuesta, Condition} from "../interfaces/Apuesta";
import {showMessage} from "../providers/MessageProvider";
import {MatchsProvider} from "../providers/MatchsProvider";
import {Match} from "../interfaces/Match";
import ApuestaCard from "./ApuestaCard";
import {useAuth} from "../hooks/useAuth";
import {NavigateFunction, useNavigate} from "react-router";
import {AxiosError} from "axios";
import apuestaCard from "./ApuestaCard";
import {log} from "node:util";
import {UserContext, UserContextType} from "../context/UserContext";

const ListadoApuestas = () => {
    let provider:ApuestasProvider = new ApuestasProvider();
    let matchProvider: MatchsProvider = new MatchsProvider();

    const [apuestas, setApuestas] = useState<Apuesta[]>([])
    const [matches, setMatches] = useState<Match[]>([])
    const userContext:UserContextType = useContext(UserContext)
    const logged:boolean = useAuth();
    const navigate:NavigateFunction = useNavigate();

    useEffect(() => {
        if (!logged) {
            navigate("/login");
            return;
        }
        fetchApuestas()
        fetchUser()
    },[]);

    const fetchUser = async () => {
        await userContext.reloadUser();
    }

    const fetchApuestas = async () => {
        const id:number = JSON.parse(sessionStorage.getItem("user")!).id
        try {
            const response = await provider.getApuestasById(id)
            if (response.status === 200) {
                setApuestas(response.data.results)
                response.data.results.map((x:Apuesta) => {
                    x.conditions.map((condition:Condition) => {
                        fetchMatch(condition.match)
                    })
                })
            }
        } catch (error) {
            const error2 = error as AxiosError;
            showMessage({
                severity: "warn",
                summary: "Apuestas",
                // @ts-ignore
                message: error2.response.data.message,
            })
        }
    }

    const fetchMatch = async (id:number) => {
        try {
            const response = await matchProvider.getMatchById(id)
            if (response.status === 200) {
                setMatches(prev => ({
                    ...prev,
                    [id]: response.data
                }));
            }
        } catch (error) {
            showMessage({
                severity: "warn",
                summary: "Partido",
                message: "No se han podido obtener el partido",
            })
        }
    }

    const apuestasCards = apuestas.map((apuesta:Apuesta) => {
        if (!matches) return null;
        let partido:Match | undefined;
       Object.values(matches).forEach(match => {
           if (match.id === apuesta.conditions[0].match) partido = match;
       })
        if (!partido) return null;
        return <ApuestaCard key={apuesta.id} match={partido} apuesta={apuesta} />;
    })

    return (
        <div className="w-full flex flex-column align-items-center justify-content-center gap-3 xl:flex-row lg:flex-row">
            {
                apuestasCards
            }
        </div>
    );
};

export default ListadoApuestas;