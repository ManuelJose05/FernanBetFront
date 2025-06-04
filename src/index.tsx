import ReactDOM from 'react-dom/client';
import "primereact/resources/themes/lara-dark-green/theme.css";
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import App from './App';
import {BrowserRouter} from "react-router";
import {UserProvider} from "./context/UserContext";
import {SchoolProvider} from "./context/SchoolContext";
import {TeamContextProvider} from "./context/TeamContext";
import {MatchProvider} from "./context/MatchsContext";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
        <UserProvider>
           <SchoolProvider>
               <TeamContextProvider>
                   <MatchProvider>
                       <App />
                   </MatchProvider>
               </TeamContextProvider>
           </SchoolProvider>
        </UserProvider>
    </BrowserRouter>
);
