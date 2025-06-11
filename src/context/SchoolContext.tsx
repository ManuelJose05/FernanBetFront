import {createContext, useState, ReactNode, FC} from "react";
import axios from "axios";
import {School} from "../interfaces/School";

// Define la estructura del contexto
export interface SchoolContextType {
   schools: School[];
   setSchools: (s: School[]) => void;
   getAllSchools: () => Promise<void>;
}

// Crea el contexto con un valor inicial temporal (se sobrescribirá en el provider)
export const SchoolContext = createContext<SchoolContextType>({
    schools : [],
    setSchools : () => {},
    getAllSchools: async () => {},
});

// Define las props del proveedor
interface SchoolProviderProps {
    children: ReactNode;
}

// Crea el provider
export const SchoolProvider: FC<SchoolProviderProps> = ({ children }:SchoolProviderProps) => {
    const url:string ='https://fernanbetbackend.onrender.com/api/v1/'
    const [schools, setSchools] = useState<School[]>([])

    const getAllSchools = async ():Promise<void> => {
        try {
            const response = await axios.get(`${url}schools/`)
            setSchools(response.data)
        } catch (error) {
            setSchools([])
        }
    }



    return (
        <SchoolContext.Provider value={{schools,setSchools,getAllSchools }}>
            {children}
        </SchoolContext.Provider>
    );
};
