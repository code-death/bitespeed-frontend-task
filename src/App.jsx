import './App.css'
import Navbar from "./components/UI/Navbar.jsx";
import Home from "./pages/Home/Home.jsx";
import { DragDropContext } from 'react-beautiful-dnd';
import {Toaster} from "react-hot-toast";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ErrorPage from "./components/UI/ErrorPage.jsx";

function App() {
  return (
    <>
        <Toaster position={'top-center'} />
        <BrowserRouter>
            <Routes>
                <Route path={'*'} element={<ErrorPage />} />
                <Route path={'/'} element={<Home />} />
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
