import {createContext, useState, ReactNode, FC, SetStateAction, Dispatch} from "react";
import axios, {AxiosResponse} from "axios";
import {Match} from "../interfaces/Match";

// Define la estructura del contexto
export interface MatchContextType {
    matchs: Match[];
    setMatchs: Dispatch<SetStateAction<Match[]>>;
    getMatchsList: () => Promise<void>;
}

// Crea el contexto con un valor inicial temporal (se sobrescribirá en el provider)
export const MatchContext = createContext<MatchContextType>({
   matchs: [],
    setMatchs: ():void => {},
    getMatchsList: ():Promise<void> => Promise.resolve()
});

// Define las props del proveedor
interface MatchProviderProps {
    children: ReactNode;
}

// Crea el provider
export const MatchProvider: FC<MatchProviderProps> = ({ children }:MatchProviderProps) => {
    const url:string = "http://localhost:8000/api/v1/"
    const [matchs, setMatchs] = useState<Match[]>([])

    const getMatchsList = async ():Promise<void> => {
        try {
            const response:AxiosResponse = await axios.get(`${url}matchs/getMatchList/`)
            setMatchs(response.data.matchs)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <MatchContext.Provider value={{matchs,setMatchs,getMatchsList}}>
            {children}
        </MatchContext.Provider>
    );
};
