import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Upload from "./pages/Upload";
import Docs from "./pages/Docs";

export default function App() {
    return (
        <BrowserRouter>
            <div className="bg-gray-950 text-gray-50 h-screen flex flex-col">
                <Header />
                <Routes>
                    <Route path="/" element={<Upload />} />
                    <Route path="/docs" element={<Docs />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
