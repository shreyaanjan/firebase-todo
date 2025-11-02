import { createUserWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { auth } from "../config/firebase"
import { useDispatch } from "react-redux"
import { signUpUser } from "../features/todos/todoSlice"
import { toast } from "react-toastify"

const SignUp = () => {
    const [input, setInput] = useState({
        email: '', password: '',
    })
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        setInput({ ...input, [e.target.id]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (input.email.trim() == "" || input.password.trim() == "") {
            toast.error("Enter all Fields Correctly !");
            return;
        }
        try {
            dispatch(signUpUser({ email: input.email, password: input.password }))
            toast.success("Account created successfully!");
            navigate('/')
        } catch (error) {
            toast.error("Signup Failed ! Please Try Again.");
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#e0f2fe] via-[#f0f9ff] to-[#ede9fe] flex items-center justify-center px-5 font-[Poppins]">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8">
                <h2 className="text-center text-3xl font-semibold text-[#20233f] mb-8 tracking-wide">
                    Sign Up
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block mb-2 text-lg font-semibold text-[#334155]">
                            Email Address
                        </label>
                        <input type="email" id="email" onChange={handleChange} value={input.email}
                            placeholder="abc@mail.com" className="w-full bg-white/70 border-2 border-[#c7d2fe] text-[#1e293b] text-sm rounded-xl focus:border-[#6366f1] p-3 outline-none shadow-inner transition-all" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-lg font-semibold text-[#334155]">
                            Password
                        </label>
                        <input type="password" id="password" onChange={handleChange} value={input.password} placeholder="*********" className="w-full bg-white/70 border-2 border-[#c7d2fe] text-[#1e293b] text-sm rounded-xl focus:border-[#6366f1] p-3 outline-none shadow-inner transition-all" />
                    </div>
                    <button
                        type="submit" className="w-full submit-btn py-2 px-7 tracking-wider">
                        Sign Up
                    </button>
                    <p className="text-center text-sm font-medium text-[#334155] mt-4">
                        Already have an account?{" "}
                        <Link to="/sign-in" className="text-[#4f46e5] hover:underline font-semibold">
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default SignUp