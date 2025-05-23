import {createContext, FC, ReactNode, useState} from "react";
import {Team} from "../interfaces/Team";
import axios, {AxiosResponse} from "axios";
import {TeamProvider} from "../providers/TeamProvider";


export interface TeamContextType {
    equipos: Team[],
    setEquipos: (s: Team[]) => void,
    getAllEquipos: () => Promise<void>,
}

export const TeamContext = createContext<TeamContextType>({
    equipos: [],
    setEquipos: (s: Team[]) => {},
    getAllEquipos: () => Promise.resolve(),
});

export interface TeamContextProps {
    children: ReactNode;
}

export const TeamContextProvider: FC<TeamContextProps> = (props: TeamContextProps)=> {
    let provider = new TeamProvider()
    const [equipos, setEquipos] = useState<Team[]>([])

    const getAllEquipos = async ():Promise<void> => {
        try {
            const response:AxiosResponse = await provider.getAllEquipos()
            setEquipos(response.data.teams)
        } catch (error) {
            setEquipos([])
        }
    }
    return (
        <TeamContext.Provider value={{equipos,setEquipos,getAllEquipos}} >
            {props.children}
        </TeamContext.Provider>
    )
}