import UsersRanking from "../components/UsersRanking";
import TeamsRanking from "../components/TeamsRanking";
import MatchsListPage from "../components/MatchsListPage";
import HomeTabPage from "../components/HomeTabPage";

export const homeMenuOptions = [
  {
    label: "Inicio",
    icon: "pi pi-home mr-2",
    content: <HomeTabPage/>,
  },
  {
    label: "Mis Predicciones",
    icon: "pi pi-money-bill mr-2",
    content: <div>Contenido de Predicciones</div>,
  },
  {
    label: "Partidos",
    icon: "pi pi-calendar mr-2",
    content: <MatchsListPage />,
  },
  {
    label: "Clasificación",
    icon: "pi pi-chart-bar mr-2",
    content: <TeamsRanking/>,
  },
  {
    label: "Ranking Usuarios",
    icon: "pi pi-user mr-2",
    content: <UsersRanking />,
  },
];
