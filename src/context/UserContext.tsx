import {createContext, useState, ReactNode, FC} from "react";
import {User} from "../interfaces/User";
import axios from "axios";
import {showMessage} from "../providers/MessageProvider";

// Define la estructura del contexto
export interface UserContextType {
    currentUser: User;
    setCurrentUser: (user: User) => void;
    login: (email:string,password:string) => Promise<boolean>;
    loading: boolean;
    setLoading: (value: boolean) => void;
    createAccount: (user: User) => Promise<boolean>;
    getUsersRanking: () => Promise<User[]>;
}

// Crea el contexto con un valor inicial temporal (se sobrescribirá en el provider)
export const UserContext = createContext<UserContextType>({
    currentUser: {
        email: "", username: "", first_name: "",
        last_name:  "", is_active:  false,
        level: [], experience: 0, school_id:  1,
        course: "1",password: "",id: 0
    },
    setCurrentUser: user => {},
    login: (email:string,password:string): Promise<boolean> => Promise.resolve(true),
    loading: false,
    setLoading: (value: boolean):void => {},
    createAccount: async (user: User): Promise<boolean> => false,
    getUsersRanking: async () => Promise.resolve([]),
});

// Define las props del proveedor
interface UserProviderProps {
    children: ReactNode;
}

// Crea el provider
export const UserProvider: FC<UserProviderProps> = ({ children }) => {
    const url:string = "http://localhost:8000/api/v1/"
    const [currentUser, setCurrentUser] = useState<User>(() => {
        return sessionStorage.getItem("user") == null ?
            {
                email: "", username: "", first_name: "",
                last_name:  "", is_active:  false,
                level: "", experience: 0, school_id:  1,
                course: "1", password: "", id: 0
            }
            :
            JSON.parse(sessionStorage.getItem("user")!)
    })
    const [loading, setLoading] = useState<boolean>(false)

    const login = async (email:string,password:string) => {
        try {
            setLoading(true)
            const response = await axios.post(`${url}users/login/`,{
                "email": email,
                "password": password
            })
            console.log(response.data.user)
            setCurrentUser(response.data.user)
            sessionStorage.setItem("user",JSON.stringify(response.data.user))
            sessionStorage.setItem("login", "true")
            return true;
        } catch (error) {
            setLoading(false)
            showMessage({
                severity: "warn",
                message: "No se pudo iniciar sesión",
                summary: "Error"
            })
        }
        return false;
    }

    const createAccount = async (user:User): Promise<boolean> => {
        setLoading(true)
        try {
            const response = await axios.post(`${url}users/createUser/`,user)
            sessionStorage.setItem("login", "true")
            sessionStorage.setItem("user",JSON.stringify(user))
            setCurrentUser(user)
            return response.status === 201
        } catch (error) {
            showMessage({
                severity: "warn",
                message: "No se pudo crear la cuenta.",
                summary: "Error"
            })
            setLoading(false)
            return false;
        }
    }

    const getUsersRanking = async ():Promise<User[]> => {
        try {
            const response = await axios.get(`${url}users/getUsersBySchool/${currentUser.school_id}/`)
            return response.data.users;
        } catch (error) {
            console.log(error)
            return []
        }
    }


    return (
        <UserContext.Provider value={{currentUser,setCurrentUser,login,loading,setLoading,createAccount,getUsersRanking }}>
            {children}
        </UserContext.Provider>
    );
};
