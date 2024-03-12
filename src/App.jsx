import './App.css'
import Navbar from "./components/UI/Navbar.jsx";
import Home from "./pages/Home/Home.jsx";
import { DragDropContext } from 'react-beautiful-dnd';
import {Toaster} from "react-hot-toast";
import Tabs from "./components/UI/Tabs/Tabs.jsx";

function App() {
  return (
    <>
        <Toaster position={'top-center'} />
        <Home />
        <Tabs position={'bottom'} />
    </>
  )
}

export default App
