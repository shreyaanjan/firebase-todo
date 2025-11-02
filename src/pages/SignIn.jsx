import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { signInUser, signInWithGoogle } from "../features/todos/todoSlice"
import { toast } from "react-toastify"

const SignIn = () => {
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
            dispatch(signInUser({ email: input.email, password: input.password }))
            toast.success("Signed In Successfully!");
            navigate('/')
        } catch (error) {
            toast.error("Sign-in Failed ! Please Try Again.");
            console.log(error);
        }
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#e0f2fe] via-[#f0f9ff] to-[#ede9fe] flex items-center justify-center px-5 font-[Poppins]">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8">
                <h2 className="text-center text-3xl font-semibold text-[#20233f] mb-8 tracking-wide">
                    Sign In
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
                    <button type="submit" className="w-full submit-btn py-2 px-7 tracking-wider">
                        Sign In
                    </button>
                    <button type="button" onClick={() => {
                        dispatch(signInWithGoogle())
                        navigate('/')
                    }} className="w-full flex items-center justify-center gap-3 submit-btn font-medium text-sm px-5 py-3 tracking-wider shadow-md">
                        <svg width={20} height={20} viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_13183_10121)">
                                <path d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z" fill="#3F83F8" />
                                <path d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006Z" fill="#34A853" />
                                <path d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169Z" fill="#FBBC04" />
                                <path d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805Z" fill="#EA4335" />
                            </g>
                            <defs>
                                <clipPath id="clip0_13183_10121">
                                    <rect width="20" height="20" fill="white" transform="translate(0.5)" />
                                </clipPath>
                            </defs>
                        </svg>
                        Log in with Google
                    </button>
                    <p className="text-center text-base font-medium text-[#334155] mt-4">
                        Don’t have an account yet?{" "}
                        <Link to="/sign-up" className="text-[#4f46e5] hover:underline font-semibold">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default SignIn