import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {FloatLabel} from "primereact/floatlabel";
import {Dispatch, SetStateAction, useState} from "react";
import {Button} from "primereact/button";
import {User} from "../interfaces/User";
import {showMessage} from "../providers/MessageProvider";
import {TeamProvider} from "../providers/TeamProvider";
import {AxiosResponse} from "axios";

interface AddTeamDialogProps {
    visible:boolean;
    setVisible:(visible:boolean) => void;
    setReload: Dispatch<SetStateAction<boolean>>;
}

const AddTeamDialog = (props:AddTeamDialogProps) => {
    const {visible,setVisible,setReload} = props;
    const [nombre, setNombre] = useState<string>("")
    const [entrenador, setEntrenador] = useState<string>("")

    let provider:TeamProvider = new TeamProvider();

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        let user:User = JSON.parse(sessionStorage.getItem("user")!);
        const body = {
            nombre: nombre,
            entrenador: entrenador,
            school: user.school_id,
            gf:0, gc:0,pj:0,victorias:0,derrotas:0,empates:0,puntos:0
        }

        try {
            const response:AxiosResponse = await provider.createTeam(body)
            if (response.status === 201) {
                showMessage({
                    severity: "success", summary: "Successfully added",message: "Equipo agregado correctamente"
                })
                setReload(prevState => !prevState);
                setVisible(false);
            }
        } catch (error:any) {
            showMessage({
                severity: "error",summary: "Equipo",message:"No se ha podido creaer el equipo",
            })
        }
    }

    const content = (
        <form
            className="flex flex-column gap-5 justify-content-center align-items-center mt-2"
        onSubmit={handleSubmit}
        >
            <FloatLabel>
                <InputText
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <label htmlFor="nombre">Nombre</label>
            </FloatLabel>
            <FloatLabel>
                <InputText
                    id="entrenador"
                    name="entrenador"
                    type="text"
                    value={entrenador}
                    onChange={(e) => setEntrenador(e.target.value)}
                />
                <label htmlFor="entrenador">Entrenador</label>
            </FloatLabel>
            <Button type={"submit"} label={"Añadir equipo"} icon="pi pi-users" iconPos="left"/>
        </form>
    )

    return (
        <Dialog
            blockScroll={true}
            header={"Nuevo Equipo"}
            closable={true}
            visible={visible}
            onHide={() => setVisible(false)}
            className=""
            style={{background: 'black'}}
        >
            {content}
        </Dialog>
    );
};

export default AddTeamDialog;
