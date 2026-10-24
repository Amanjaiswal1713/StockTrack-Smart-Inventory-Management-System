import ReactDOM from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <DataProvider>
      <App />
    </DataProvider>
  </AuthProvider>,
);
