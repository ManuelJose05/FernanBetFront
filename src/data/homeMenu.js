import UsersRanking from "../components/UsersRanking";
import TeamsRanking from "../components/TeamsRanking";
import MatchsListPage from "../components/MatchsListPage";
import HomeTabPage from "../components/HomeTabPage";
import ListadoApuestas from "../components/ListadoApuestas";
import AdminPage from "../pages/AdminPage";


export const homeMenuOptions = (user) => {
   const options = [
        {
            label: "Inicio",
            icon: "pi pi-home mr-2",
            content: <HomeTabPage/>,
        },
        {
            label: "Ranking Usuarios",
            icon: "pi pi-user mr-2",
            content: <UsersRanking/>,
        },
        {
            label: "Clasificación",
            icon: "pi pi-chart-bar mr-2",
            content: <TeamsRanking/>,
        },
        {
            label: "Partidos",
            icon: "pi pi-calendar mr-2",
            content: <MatchsListPage/>,
        },
    ];

    !user.is_superuser && options.push({
        label: "Mis Predicciones",
        icon: "pi pi-money-bill mr-2",
        content: <ListadoApuestas/>,
    })
    user.is_superuser && options.push({
        label: "Panel Administrador",
        icon: "pi pi-cog mr-2",
        content: <AdminPage/>,
    })
    return options
}
