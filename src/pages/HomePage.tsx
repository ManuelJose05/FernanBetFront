import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { homeMenuOptions } from "../data/homeMenu";
import {useNavigate} from "react-router";
import {Tag} from "primereact/tag";
import {useContext, useEffect} from "react";
import {UserContext} from "../context/UserContext";
import {LevelIcons} from "../interfaces/level_icons";

function HomePage() {
    const navigate = useNavigate();
    const {currentUser} = useContext(UserContext);

    useEffect(() => {
        console.log(currentUser);
    }, [currentUser]);

    const tabPanels = homeMenuOptions.map((option,index) => {
        return <TabPanel
            key={index}
            leftIcon={option.icon}
            header={option.label}
            children={option.content}
            headerStyle={{marginRight: '5px'}}
        />;
    })

    //Devolvemos un icon u otro dependiendo del nivel de usuario
    const getLevelIcon = (level: string): string => {
        switch (level) {
            case "RECLUTA":
                return LevelIcons.RECLUTA;
            case "ANALISTA":
                return LevelIcons.ANALISTA;
            case "ESTRATEGA":
                return LevelIcons.ESTRATEGA;
            case "EXPERTO":
                return LevelIcons.EXPERTO;
            case "LEYENDA":
                return LevelIcons.LEYENDA;
            default:
                return 'pi pi-question'; // Ícono por defecto si no se reconoce el nivel
        }
    };


    return (
        <div className="min-h-screen flex flex-column">
            {/* Header y contenido */}
            <div className="flex-grow-1 flex flex-column w-full">
                <section className="flex flex-column align-items-center justify-content-center w-full">
                    <Image src="logoSinFondo.png" width="100px"/>
                    {(sessionStorage.getItem("login") === 'false' || sessionStorage.getItem("login") == null) && (
                        <div className="flex flex-row gap-3 justify-content-start mb-2">
                            <Button label="Iniciar sesión" className="h-2rem" onClick={() => navigate("/login")}/>
                            <Button label="Registrarse" className="h-2rem" onClick={() => navigate("/new-account")}/>
                        </div>
                    )}
                    {
                        sessionStorage.getItem("login") === 'true' && (
                            <div className="flex flex-row gap-4 sm:gap-3 justify-content-start mb-2">
                                <Tag icon="pi pi-trophy" value={currentUser.experience + " XP"} style={{fontSize: '20px'}}/>
                                <Tag icon={getLevelIcon(currentUser.level[0])} value={currentUser.level[1]} style={{fontSize: '20px'}}/>
                            </div>
                        )
                    }
                </section>

                <TabView className="mt-3">
                    {tabPanels}
                </TabView>
            </div>

            {/* Footer pegado abajo */}
            <footer className="text-sm mb-1 pt-2 border-top-1 w-full flex flex-column gap-3 justify-content-center align-items-center xl:flex-row lg:flex-row">
                <span>© 2025 FernanBET3</span>
                <span>Terms | Privacy Policy | Sitemap</span>
                <span>Anti-Corruption Policy</span>
            </footer>
        </div>
    );
}

export default HomePage;
