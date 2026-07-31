import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
//import SettingsPage from "./pages/SettingsPage";

function App() {
  
  return (
    <>
      <AppRoutes />
      <Toaster position="top-center" 
      toastOptions={{duration: 3000,
        style: {
          borderRadius: "12px",
          padding: "16px",
        },
      }}
      />
      
    </>
  );
}

export default App;