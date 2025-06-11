import {User} from "../interfaces/User";
import {Sidebar} from "primereact/sidebar";
import {Avatar} from "primereact/avatar";
import {Button} from "primereact/button";
import {useState} from "react";
import {SplitButton} from "primereact/splitbutton";
import {MenuItem, MenuItemCommandEvent} from "primereact/menuitem";

interface UserProfileProps {
    user: User;
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

const UserProfile = (props: UserProfileProps) => {
    const {user, setVisible, visible} = props;
    const [fullScreen, setFullScreen] = useState<boolean>(false)

    const iconMap: Record<string, string> = {
        id: "pi pi-hashtag",
        email: "pi pi-envelope",
        username: "pi pi-user",
        first_name: "pi pi-user-edit",
        last_name: "pi pi-user-edit",
        is_active: "pi pi-check-circle",
        level: "pi pi-star",
        experience: "pi pi-chart-line",
        school_id: "pi pi-building",
        course: "pi pi-book",
    };

    const splitOptions:MenuItem[] = [
        {
            label: 'Cerrar sesión',
            icon: 'pi pi-outline',
            command(event: MenuItemCommandEvent) {
                sessionStorage.clear();
                window.location.reload();
            }
        }
    ]

    const userInfo = () => {
        const properties = Object.keys(user);

        return properties.map((key: string) => {
            if (key === "id" || key === "is_active" || key === 'is_superuser') return;
            return <section key={key} className="flex flex-column align-items-start gap-3 border-bottom-1 pb-2">
                <div className="flex flex-row align-items-center gap-2">
                    <i className={iconMap[key] + " text-primary-500 text-xl"}/>
                    <span className="text-sm text-color-secondary uppercase font-medium tracking-wide">
                    {key.toLocaleUpperCase("es")}
                    </span>
                </div>
                    <span className="ml-1 w-full text-base white-space-nowrap overflow-hidden text-overflow-ellipsis">
                        {
                            key === "level" ? (user as any)[key][1] : (user as any)[key]
                        }
                    </span>

            </section>;
        })
    }

    const customHeader = (
        <div className="flex align-items-center gap-2">
            <SplitButton model={splitOptions} size={"small"} label={user.first_name} rounded  />
        </div>
    );

    const fullScreenButton = () => {
        return <i className={`pi pi-window-${fullScreen ? "minimize" : "maximize"} mr-2 cursor-pointer`} onClick={() => setFullScreen(!fullScreen)} />
    }

    return <Sidebar
        icons={fullScreenButton}
        fullScreen={fullScreen}
        closeIcon={"pi pi-times"}
        position={"left"}
        onHide={() => setVisible(false)}
        visible={visible}
        header={customHeader}
    >
        <div className="flex flex-column gap-3 align-content-center justify-content-start">
            {userInfo()}
            <Button label={"Guardar cambios"} />
        </div>
    </Sidebar>
};

export default UserProfile;