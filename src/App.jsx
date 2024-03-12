import './App.css'
import Navbar from "./components/UI/Navbar.jsx";
import Home from "./pages/Home/Home.jsx";
import { DragDropContext } from 'react-beautiful-dnd';
import {Toaster} from "react-hot-toast";

function App() {
  return (
    <>
        <Toaster position={'top-center'} />
        <Home />
    </>
  )
}

export default App
