import {useEffect, useState} from "react";
import {ApuestasProvider} from "../providers/ApuestasProvider";
import {Apuesta, Condition} from "../interfaces/Apuesta";
import {showMessage} from "../providers/MessageProvider";
import {MatchProvider} from "../providers/MatchProvider";
import {Match} from "../interfaces/Match";
import ApuestaCard from "./ApuestaCard";
import {useAuth} from "../hooks/useAuth";
import {useNavigate} from "react-router";
import {AxiosError} from "axios";

const ListadoApuestas = () => {
    let provider:ApuestasProvider = new ApuestasProvider();
    let matchProvider: MatchProvider = new MatchProvider();

    const [apuestas, setApuestas] = useState<Apuesta[]>([])
    const [match, setMatch] = useState<Match>()
    const logged:boolean = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!logged) {
            navigate("/login");
            return;
        }
        fetchApuestas()
    },[]);

    useEffect(() => {

    }, [apuestas,match]);

    const fetchApuestas = async () => {
        const id:number = JSON.parse(sessionStorage.getItem("user")!).id
        try {
            const response = await provider.getApuestasById(id)
            if (response.status === 200) {
                console.log(response)
                setApuestas(response.data.results)
                response.data.results.map((x:Apuesta) => {
                    x.conditions.map((condition:Condition) => {
                        if (condition.type === 'match') fetchMatch(condition.match)
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
            if (response.status === 200) setMatch(response.data)
        } catch (error) {
            showMessage({
                severity: "warn",
                summary: "Partido",
                message: "No se han podido obtener el partido",
            })
        }
    }

    const apuestasCards = apuestas.map((apuesta:Apuesta) => {
        if (!match) return;
        return <ApuestaCard match={match} apuesta={apuesta} />
    })

    return (
        <div className="w-full flex flex-column align-items-center justify-content-center gap-3">
            {
                apuestasCards
            }
        </div>
    );
};

export default ListadoApuestas;