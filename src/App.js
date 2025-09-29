import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Settings from "./pages/Settings";
import Qc from "./pages/Qc";
import BatchProgress from "./components/BatchProgress";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="qc" element={<Qc />} />
          <Route path="progress" element={<BatchProgress />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
