import {InputText} from "primereact/inputtext";
import {FloatLabel} from "primereact/floatlabel";
import {Button} from "primereact/button";
import {Image} from "primereact/image";
import {ChangeEvent, useContext, useEffect, useState} from "react";
import {UserContext} from "../../context/UserContext";
import {useNavigate} from "react-router";
import {useAuth} from "../../hooks/useAuth";

function Login() {
    const {login,loading,setLoading} = useContext(UserContext);
    const [password, setPassword] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const navigate = useNavigate();
    const logged = useAuth();

    //Comprobamos si el usuario esta logeado. En caso de estar logeado, lo redirigimos al home
    useEffect(() => {
        if (logged) navigate("/")
    }, []);


    return (
        <div className="flex flex-column justify-content-center align-content-center text-center mt-2 w-full">
            <Image src="logoSinFondo.png" width="125px"/>
            <h1>Inicia sesión</h1>
            <h4>Haz predicciones deportivas con nosotros</h4>

            <form
                className="card flex flex-column gap-5 justify-content-center align-items-center mt-2"
                onSubmit={async (e) => {
                    e.preventDefault();
                    if (password !== "" && email !== "") {
                        try {
                            const response:boolean = await login(email, password);
                            if (response) navigate("/")
                        } catch (error) {

                        }
                    }
                }
            }
            >
                <FloatLabel>
                    <InputText
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    />
                    <label htmlFor="email">Email</label>
                </FloatLabel>

                <FloatLabel>
                    <label htmlFor="password">Contraseña</label>
                    <InputText
                        type={"password"}
                        value={password}
                        id="password"
                        placeholder="Contraseña"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    />
                </FloatLabel>
                <Button loading={loading} label="Iniciar sesión" icon="pi pi-sign-in" iconPos="left"/>
            </form>
            <p>¿Olvidaste tu contraseña?</p>
            <p>¿No tienes cuenta? <span style={{cursor: 'pointer'}} onClick={() => navigate("/new-account")}>Regístrate</span></p>
            <p>¿No quieres iniciar sesión? <span style={{cursor: 'pointer'}} onClick={() => navigate("/")}>Inicio</span></p>
        </div>
    );
}

export default Login;