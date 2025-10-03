import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Settings from "./pages/Settings";
import Qc from "./pages/Qc";
import BatchProgress from "./components/BatchProgress";
import { Provider, useDispatch } from "react-redux";
import store from "./store/store";
import BatchLatextCreationForm from "./components/BatchLatextCreationForm";

function App() {
  return (
    <BrowserRouter>
      {" "}
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="qc" element={<Qc />} />
            <Route path="progress" element={<BatchProgress />} />
            <Route path="latexinput" element={<BatchLatextCreationForm />} />
          </Route>
        </Routes>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
