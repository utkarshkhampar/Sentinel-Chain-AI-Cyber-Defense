import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AppRoutes } from "@/routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "#111a2e",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#e6ebf5",
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
