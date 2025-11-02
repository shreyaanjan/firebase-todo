import { useDispatch } from "react-redux"
import { logout } from "../features/todos/todoSlice"
import { Link, useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../config/firebase"

const Header = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await signOut(auth)
            dispatch(logout())
            navigate("/sign-in")
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <header className="bg-[#20233f] border-b px-4 lg:px-6 py-3">
            <div className="container mx-auto">
                <nav className="font-[poppins]">
                    <div className="flex justify-between items-center mx-auto">
                        <Link to="/" className="text-white text-2xl font-bold tracking-wide">
                            Taskify
                        </Link>
                        <div className="flex items-center justify-between">
                            <ul className="flex flex-row space-x-6 font-medium">
                                <li>
                                    <button onClick={handleLogout} className="main-btn py-2 px-7 text-white text-base">
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Header