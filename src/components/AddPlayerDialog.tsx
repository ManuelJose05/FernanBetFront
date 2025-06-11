import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {FloatLabel} from "primereact/floatlabel";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Button} from "primereact/button";
import {Dropdown} from "primereact/dropdown";
import {InputNumber} from "primereact/inputnumber";
import {Team} from "../interfaces/Team";
import {User} from "../interfaces/User";
import {showMessage} from "../providers/MessageProvider";
import {PlayersProvider} from "../providers/PlayersProvider";
import {AxiosResponse} from "axios";

interface AddPlayerDialogProps {
    visible:boolean,
    setVisible:(visible:boolean) => void,
    equipos: Team[],
    setReload: Dispatch<SetStateAction<boolean>>,
}

const AddPlayerDialog = (props:AddPlayerDialogProps) => {
    let playerProvider:PlayersProvider = new PlayersProvider();

    const {visible, setVisible,equipos} = props
    const [nombre, setNombre] = useState<string>("")
    const [dorsal, setDorsal] = useState<number>(0)
    const [edad, setEdad] = useState<number>(0)
    const [pos, setPos] = useState<string>("")
    const [equipo, setEquipo] = useState<Team>()

    const posicion = ["POR","DEF","MED","DEL"]

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        let user:User = JSON.parse(sessionStorage.getItem("user")!);
        const body = {
            nombre: nombre,
            dorsal: dorsal,
            edad: edad,
            posicion: pos,
            equipo: equipo?.id,
            rojas: 0,
            goles: 0,
            amarillas: 0,
            asistencias: 0,
            minutos_jugados: 0,
            partidos_jugados: 0,
            school: user.school_id
        }
        try {
            const response:AxiosResponse = await playerProvider.createPlayer(body)
            if (response.status === 201)  {
                showMessage({
                    severity: "success", summary: "Jugador",message:"Successfully added"
                })
                props.setReload(prevState => !prevState);
                setVisible(false);
            }
        } catch (error:any) {
            showMessage({
                severity: "error", summary: "Error",message: "No se ha podido añadir al jugador"
            })
        }
    }

    const content = (
            <form
                onSubmit={handleSubmit}
                className="flex flex-column gap-5 justify-content-center align-items-center mt-5">
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
                    <InputNumber
                        inputMode={"numeric"}
                        min={0}
                        id="dorsal"
                        name="dorsal"
                        value={dorsal}
                        onChange={(e) => setDorsal(e.value!)}
                    />
                    <label htmlFor="dorsal">Dorsal</label>
                </FloatLabel>
                <FloatLabel>
                    <InputNumber
                        inputMode={"numeric"}
                        min={0}
                        id="edad"
                        name="edad"
                        value={edad}
                        onChange={event => setEdad(event.value!)}
                    />
                    <label htmlFor="edad">Edad</label>
                </FloatLabel>
                <FloatLabel>
                    <Dropdown
                        placeholder="Selecciona una posición"
                        className="w-full"
                        options={posicion}
                        id="posicion"
                        name={"posicion"}
                        value={pos}
                        onChange={(e) => {
                            setPos(e.target.value)
                        }}
                    />
                    <label htmlFor="posicion">Posición</label>
                </FloatLabel>
                <FloatLabel>
                    <Dropdown
                        placeholder="Selecciona un equipo"
                        className="w-full"
                        options={equipos}
                        optionLabel={"nombre"}
                        id="equipo"
                        name={"equipo"}
                        value={equipo}
                        onChange={(e) => {
                            setEquipo(e.target.value)
                        }}
                    />
                    <label htmlFor="equipo">Equipo</label>
                </FloatLabel>

                <Button  label="Crear Jugador" icon="pi pi-user" iconPos="left"/>
            </form>
    )
    return (
        <Dialog
            blockScroll={true}
            header={"Nuevo Jugador"}
            closable={true}
            style={{background: 'black'}}
            onHide={() => setVisible(false)}
            visible={visible}
        >
            {content}
        </Dialog>
    );
};

export default AddPlayerDialog;
