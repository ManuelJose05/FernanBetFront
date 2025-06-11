import {createContext, useState, ReactNode, FC} from "react";
import {User} from "../interfaces/User";
import axios, {Axios, AxiosResponse} from "axios";
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
    reloadUser: () => Promise<void>;
}

// Crea el contexto con un valor inicial temporal (se sobrescribirá en el provider)
export const UserContext = createContext<UserContextType>({
    currentUser: {
        email: "", username: "", first_name: "",
        last_name:  "", is_active:  false,
        level: [], experience: 0, school_id:  1,
        course: "1",password: "",id: 0, is_superuser: false,
    },
    setCurrentUser: user => {},
    login: (email:string,password:string): Promise<boolean> => Promise.resolve(true),
    loading: false,
    setLoading: (value: boolean):void => {},
    createAccount: async (user: User): Promise<boolean> => false,
    getUsersRanking: async () => Promise.resolve([]),
    reloadUser: () => Promise.resolve()
});

// Define las props del proveedor
interface UserProviderProps {
    children: ReactNode;
}

// Crea el provider
export const UserProvider: FC<UserProviderProps> = ({ children }) => {
    const url:string ='https://fernanbetbackend.onrender.com/api/v1/'

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
            const response:AxiosResponse = await axios.post(`${url}users/login/`,{
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
            const response:AxiosResponse = await axios.post(`${url}users/createUser/`,user)
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
            const response:AxiosResponse = await axios.get(`${url}users/getUsersBySchool/${currentUser.school_id}/`)
            return response.data.users;
        } catch (error) {
            return []
        }
    }

    const reloadUser = async ():Promise<void> => {
        try {
            const response:AxiosResponse = await axios.get(`${url}users/getUserByEmail/?email=${currentUser.email}`)
            if (!response.data.user) return;
            setCurrentUser(response.data.user)
            sessionStorage.setItem("user",JSON.stringify(response.data.user))
        } catch (error:any) {
            showMessage({
                severity: "error", summary: "Usuario", message: "No se ha podido obtener la información de usuario"
            })
        }
    }

    return (
        <UserContext.Provider value={{currentUser,setCurrentUser,login,loading,setLoading,createAccount,getUsersRanking,reloadUser }}>
            {children}
        </UserContext.Provider>
    );
};
