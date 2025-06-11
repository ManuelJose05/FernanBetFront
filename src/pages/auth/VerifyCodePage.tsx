import { Image } from "primereact/image";
import { Button } from "primereact/button";
import {useContext, useState} from "react";
import {InputOtp,} from "primereact/inputotp";
import {UsersProvider} from "../../providers/UsersProvider";
import {showMessage} from "../../providers/MessageProvider";
import {useNavigate} from "react-router";
import {User} from "../../interfaces/User";
import {AxiosResponse} from "axios";
import {UserContext, UserContextType} from "../../context/UserContext";

function VerifyCodePage() {
    const userContext: UserContextType = useContext(UserContext);
    const [token, setTokens] = useState<string | number | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    let provider:UsersProvider = new UsersProvider();

    return (
        <div className="flex flex-column justify-content-center align-content-center text-center mt-2 w-full">
            <Image src="logoSinFondo.png" width="125px" />
            <div className="card flex justify-content-center">
                <div className="flex flex-column align-items-center">
                    <p className="font-bold text-xl mb-2">Verifica tu cuenta</p>
                    <p className="text-color-secondary block mb-5">
                        Introduce el código que hemos enviado a tu correo.
                    </p>
                    <InputOtp
                        integerOnly
                        value={token}
                        onChange={(e) => setTokens(e.value!)}
                        length={6}
                        style={{ gap: 5 }}
                    />
                    <div className="flex justify-content-between mt-5 align-self-stretch">
                        <Button label="Reenviar Código" link className="p-0" onClick={async () => {
                            const user = JSON.parse(sessionStorage.getItem("user")!) as User;

                            if (!user) {
                                return showMessage({
                                    severity: "error",
                                    summary: "Usuario no encontrado",
                                    message: "No se ha podido recuperar el usuario de sesión",
                                });
                            }

                            try {
                                const response:AxiosResponse = await provider.resendCode(user.email);
                                if (response.status === 200) {
                                    showMessage({
                                        severity: "success",
                                        summary: "Código enviado",
                                        message: "Se ha vuelto a enviar un código a tu correo",
                                    });
                                }
                            } catch (error) {
                                showMessage({
                                    severity: "error",
                                    summary: "Error al enviar código",
                                    message: "No se ha podido enviar el código de verificación",
                                });
                            }
                        }}
                        />
                        <Button label="Enviar código" loading={loading} onClick={async () => {
                            try {
                                const response:AxiosResponse = await provider.verifyCode(token)
                                if (response.status === 200) {
                                    const responseCreateAccount:boolean = await userContext.createAccount(userContext.currentUser!);
                                    responseCreateAccount && navigate("/")
                                }
                                setLoading(false);
                            } catch (error) {
                                showMessage({
                                    severity: "error",summary: "Code Error",message: "Código de verificación erróneo"
                                })
                        }}}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerifyCodePage;
