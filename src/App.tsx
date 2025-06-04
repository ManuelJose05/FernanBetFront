import {lazy, Suspense, useEffect} from "react";
import {Route, Routes} from "react-router";
import HomePage from "./pages/HomePage";
import {Toast} from "primereact/toast";
import {showMessage, toastRef} from "./providers/MessageProvider";

const LoginPage = lazy(() => import("./pages/auth/Login"))
const RegisterPage = lazy(() => import("./pages/auth/Register"))
const VerifyCode = lazy(() => import("./pages/auth/VerifyCodePage"))


function App() {

    useEffect(() => {
        const handleOffline = () => {
            setTimeout(() => {
                showMessage({
                    severity: "error",
                    summary: "Network Error",
                    message: "Se ha perdido la conexión a internet.",
                });
            },2000)
        };

        window.addEventListener("offline", handleOffline);

        // Borramos el listener
        return () => window.removeEventListener("offline", handleOffline);
    }, []);
  return <>
      <Suspense fallback={<div>Loading...</div>}>
          <Toast ref={toastRef} position="top-right" className="z-5" />
          <Routes>
              <Route path="/" element={<HomePage/>}/>
              <Route path="/login" element={<LoginPage />}  />
              <Route path="/new-account" element={<RegisterPage />}  />
              <Route path="/verifyCode" element={<VerifyCode />} />
          </Routes>
      </Suspense>
  </>
}

export default App;
