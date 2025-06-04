import {useAuth} from "../../hooks/useAuth";
import {ChangeEvent, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {Image} from "primereact/image";
import {FloatLabel} from "primereact/floatlabel";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {UserContext} from "../../context/UserContext";
import {Divider} from "primereact/divider";
import {Dropdown, DropdownChangeEvent} from "primereact/dropdown";
import {SchoolContext} from "../../context/SchoolContext";
import {User} from "../../interfaces/User";
import {School} from "../../interfaces/School";
import {showMessage} from "../../providers/MessageProvider";
import {UserProvider} from "../../providers/UserProvider";

export const COURSES = [
    { value: '1', label: '1º ESO' },
    { value: '2', label: '2º ESO' },
    { value: '3', label: '3º ESO' },
    { value: '4', label: '4º ESO' },
    { value: '1B', label: '1º Bachillerato' },
    { value: '2B', label: '2º Bachillerato' },
];


function Register() {
    const {loading, setLoading,setCurrentUser} = useContext(UserContext);
    const {schools, getAllSchools} = useContext(SchoolContext);
    const logged = useAuth();
    const navigate = useNavigate();
    let provider:UserProvider = new UserProvider();

    //Nuevo usuario
    const [user, setUser] = useState<User>({
        email: "",
        first_name: "",
        last_name: "",
        username: "",
        experience: 100,
        school_id: 0,
        course: "",
        level: ["RECLUTA", "Recluta"],
        is_active: true,
        password: "",
        id: 0
    })

    const [selectedSchool, setSelectedSchool] = useState<School>({
        email: "", id: 0, phone: 1, city: "", postal_code: 1, address: "", name: ""
    })

    useEffect(() => {
        if (logged) navigate("/");
        fetchSchools()
    }, [])


    //Pedimos al backend que nos devuelva todos los centros
    const fetchSchools = async () => {
        try {
            await getAllSchools()
        } catch (error) {
            showMessage({
                severity: "warn",
                summary: "Error",
                message: "No se encontraron centros educativos",
            })
        }
    }

    const footerPassword = (
        <>
            <Divider/>
            <p className="mt-2">Sugerencias</p>
            <ul className="pl-2 ml-2 mt-0 line-height-3">
                <li>1 minúscula</li>
                <li>1 mayúscula</li>
                <li>1 número</li>
                <li>Mínimo 8 caractéres</li>
            </ul>
        </>
    );


    return (
        <div className="flex flex-column justify-content-center align-content-center text-center mt-2 w-full">
            <Image src="logoSinFondo.png" width="125px"/>
            <h1>Regístrate</h1>
            <h4>Haz predicciones deportivas con nosotros</h4>

            <form
                className="card flex flex-column gap-5 justify-content-center align-items-center mt-2"
                onSubmit={async (e) => {
                    setLoading(true);
                    e.preventDefault();
                    if (user.password !== "" && user.email !== "") {
                        setCurrentUser(user)
                        try {
                            await provider.resendCode(user.email) && navigate("/verifyCode")
                            setLoading(false)
                        } catch (error) {
                            showMessage({
                                severity: "warn",
                                summary: "Error",
                                message: "No se pudo crear la cuenta. Intentelo más tarde"
                            })
                        }
                    }
                }
                }
            >
                <FloatLabel>
                    <InputText id="username" value={user.username}
                               onChange={(e: ChangeEvent<HTMLInputElement>) => setUser((prev: User) => {
                                   return {...prev, username: e.target.value}
                               })}/>
                    <label htmlFor="username">Nombre de Usuario</label>
                </FloatLabel>

                <FloatLabel>
                    <InputText id="first_name" value={user.first_name}
                               onChange={(e: ChangeEvent<HTMLInputElement>) => setUser((prev) => {
                                   return {...prev, first_name: e.target.value}
                               })}/>
                    <label htmlFor="first_name">Nombre</label>
                </FloatLabel>

                <FloatLabel>
                    <InputText id="last_name" value={user.last_name}
                               onChange={(e: ChangeEvent<HTMLInputElement>) => setUser((prev) => {
                                   return {...prev, last_name: e.target.value}
                               })}/>
                    <label htmlFor="last_name">Apellidos</label>
                </FloatLabel>

                <FloatLabel>
                    <Dropdown
                        filterBy="name"
                        options={schools}
                        optionLabel="name"
                        id="school"
                        placeholder="Selecciona tu centro"
                        value={selectedSchool}
                        onChange={(e: DropdownChangeEvent) => {
                            setSelectedSchool(e.target.value)
                            setUser((prev) => {
                                return {...prev, school_id: e.target.value.id}
                            })
                        }}/>
                    <label htmlFor="school">Centro educativo</label>
                </FloatLabel>

                <FloatLabel>
                    <label htmlFor={"curso"}>Curso</label>
                    <Dropdown
                        value={user.course}
                        onChange={(e) => setUser((prev:User) => {
                            return {...prev, course: e.value}
                        })}
                        options={COURSES}
                        optionLabel="label"
                        placeholder="Selecciona tu curso"
                    />
                </FloatLabel>

                <FloatLabel>
                    <InputText
                        id="email"
                        name="email"
                        type="email"
                        value={user.email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setUser((prev) => {
                            return {...prev, email: e.target.value}
                        })}
                    />
                    <label htmlFor="email">Email</label>
                </FloatLabel>

                <FloatLabel>
                    <label htmlFor="password">Contraseña</label>
                    <Password
                        footer={footerPassword}
                        value={user.password}
                        inputId="password"
                        placeholder="Contraseña"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setUser((prev) => {
                            return {...prev, password: e.target.value}
                        })}
                        weakLabel="Too simple" mediumLabel="Average complexity" strongLabel="Complex password"
                    />
                </FloatLabel>
                <Button loading={loading} label="Crear cuenta" icon="pi pi-sign-in" iconPos="left"/>
            </form>
            <p>¿Ya tienes cuenta?
                <span style={{cursor: 'pointer'}} onClick={() => navigate("/login")}>Iniciar sesión</span></p>
            <p>¿No quieres unirte? <span style={{cursor: 'pointer'}} onClick={() => navigate("/")}>Inicio</span></p>
        </div>
    );
}

export default Register;