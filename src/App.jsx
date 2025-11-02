import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Todos from "./pages/Todos"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import ProtectedRoute from "./components/ProtectedRoute"
import { useSelector } from "react-redux"
import { ToastContainer } from "react-toastify"

const App = () => {
    const user = useSelector((store) => store.todos.currentUser)
    return (
        <BrowserRouter>
            {user && <Header />}
            <Routes>
                <Route path="/" element={<ProtectedRoute Component={Todos} />} />
                <Route path="/edit-todo/:id" element={<ProtectedRoute Component={Todos} />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/sign-in" element={<SignIn />} />
            </Routes>
            <ToastContainer />
        </BrowserRouter>
    )
}

export default App