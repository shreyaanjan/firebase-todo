import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addTodo, deleteTodo, fetchTodo, updateTodo } from "../features/todos/todoSlice"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../config/firebase"
import { toast } from "react-toastify"

const Todos = () => {
    const [input, setInput] = useState({
        task: '', priority: '',
    })
    const [isEdit, setIsEdit] = useState(false)
    const [updateId, setUpdateId] = useState(null)
    const [filter, setFilter] = useState("all")

    const dispatch = useDispatch()
    const user = useSelector((store) => store.todos.currentUser)
    const todos = useSelector((store) => store.todos.list)

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchTodo(user.id))
        }
    }, [user])

    useEffect(() => {
        if (updateId) {
            const getTodo = async () => {
                const todo = await getDoc(doc(db, `${user.id}`, updateId))
                setInput(todo.data())
                setIsEdit(true)
            }
            getTodo()
        }
    }, [updateId])

    const handleChange = (e) => {
        setInput({ ...input, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (input.task.trim() === "" || input.priority.trim() === "") {
            toast.error("Enter all Fields Correctly!");
            return;
        }
        try {
            if (!isEdit) {
                dispatch(addTodo({ uid: user.id, data: input }))
                toast.success("Task Added successfully!");
            } else {
                dispatch(updateTodo({ uid: user.id, updateId, data: input }))
                toast.success("Task Updated successfully!");
                setIsEdit(false)
                setUpdateId(null)
            }
            dispatch(fetchTodo(user.id))
            setInput({ task: '', priority: '' })
        } catch (error) {
            toast.error("Something went wrong!");
            console.error(error);
        }
    }

    const handleStatusChange = (task) => {
        if (task.status === "completed") return

        dispatch(updateTodo({
            uid: user.id,
            updateId: task.id,
            data: { ...task, status: "completed" }
        }))

        dispatch(fetchTodo(user.id))
    }

    const filteredTodos = todos.filter(todo =>
        filter === "all" ? true : filter === "active" ? todo.status !== "completed" : todo.status === "completed"
    )

    return (
        <div className="height bg-gradient-to-br from-[#e0f2fe] via-[#f0f9ff] to-[#ede9fe] py-10 px-4 sm:px-6 md:px-8 text-[#1e293b] font-[poppins]">
            <div className="max-w-2xl h-auto sm:h-[80vh] overflow-hidden mx-auto bg-white/80 backdrop-blur-xl p-5 sm:p-8 rounded-3xl shadow-2xl border border-white/60">
                <h2 className="text-center text-2xl sm:text-3xl font-semibold text-[#20233f] mb-6 sm:mb-10 tracking-wide">
                    TaskBoard
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-end gap-5 mb-8 sm:mb-10">
                    <div className="flex-1 w-full">
                        <label htmlFor="task" className="block mb-2 text-base sm:text-lg font-semibold text-[#334155]">
                            Enter Task
                        </label>
                        <input type="text" id="task" onChange={handleChange} value={input.task}
                            className="w-full h-11 bg-white/70 border-2 border-[#c7d2fe] text-[#1e293b] text-sm rounded-xl focus:border-[#6366f1] p-3 outline-none shadow-inner transition-all" />
                    </div>
                    <div className="w-full sm:w-40">
                        <label htmlFor="priority" className="block mb-2 text-base sm:text-lg font-semibold text-[#334155]">
                            Priority
                        </label>
                        <select id="priority" onChange={handleChange} value={input.priority}
                            className="w-full h-11 bg-white/70 border-2 border-[#c7d2fe] text-[#1e293b] text-sm rounded-xl focus:border-[#6366f1] p-3 outline-none shadow-inner transition-all">
                            <option value="">Select</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <button type="submit" className="submit-btn py-2 px-7 tracking-wider w-full sm:w-auto">
                        {isEdit ? "Update Task" : "Add Task"}
                    </button>
                </form>
                <div className="rounded-2xl border border-[#c7d2fe]/60 bg-[#f0f7ff]/80 backdrop-blur-xl shadow-[0_4px_20px_rgba(147,197,253,0.25)] h-[250px] overflow-y-auto transition-all duration-300 scrollbar">
                    <div className="w-full p-4 sm:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-3 sm:gap-0">
                            <h2 className="text-gray-700 font-semibold text-base sm:text-lg text-center sm:text-left">
                                TASKS
                            </h2>
                            <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-5">
                                <button onClick={() => setFilter("all")} className={`flex items-center gap-2 transition-all ${filter === "all" ? "text-amber-600 font-semibold" : "text-gray-500"}`}>
                                    <span className={`w-3 h-3 rounded-full ${filter === "all" ? "bg-amber-500" : "bg-gray-300"}`}></span>
                                    <span className="text-sm font-medium">All</span>
                                </button>
                                <button onClick={() => setFilter("active")} className={`flex items-center gap-2 transition-all ${filter === "active" ? "text-green-600 font-semibold" : "text-gray-500"}`}>
                                    <span className={`w-3 h-3 rounded-full ${filter === "active" ? "bg-green-500" : "bg-gray-300"}`}></span>
                                    <span className="text-sm font-medium">Active</span>
                                </button>
                                <button onClick={() => setFilter("completed")} className={`flex items-center gap-2 transition-all ${filter === "completed" ? "text-blue-600 font-semibold" : "text-gray-500"}`}>
                                    <span className={`w-3 h-3 rounded-full ${filter === "completed" ? "bg-blue-500" : "bg-gray-300"}`} ></span>
                                    <span className="text-sm font-medium">Completed</span>
                                </button>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {filteredTodos.map((todo, idx) => (
                                <div key={todo.id} className={`border rounded-xl p-3 sm:p-4 flex flex-col justify-between ${todo.priority === "high" ? "bg-red-50 border-red-200"
                                    : todo.priority === "medium"
                                        ? "bg-blue-50 border-blue-200"
                                        : "bg-green-50 border-green-200"}`} >
                                    <div>
                                        {todo.status !== "completed" && (
                                            <button onClick={() => handleStatusChange(todo)}
                                                className={`text-base mb-1 ${todo.priority === "high"
                                                    ? "text-red-600"
                                                    : todo.priority === "medium"
                                                        ? "text-blue-600"
                                                        : "text-green-600"}`}
                                                disabled={todo.status === "completed"} >
                                                <i className="bi bi-check-circle"></i>
                                            </button>
                                        )}
                                        <div>
                                            <span className="text-gray-800 font-medium break-words">
                                                {todo.task}
                                            </span>
                                            <span
                                                className={`text-xs font-semibold px-2 py-0.5 rounded ml-2 capitalize ${todo.priority === "high"
                                                    ? "bg-red-200 text-red-800"
                                                    : todo.priority === "medium"
                                                        ? "bg-blue-200 text-blue-800"
                                                        : "bg-green-200 text-green-800"}`} >
                                                {todo.priority}
                                            </span>
                                            <p className="text-gray-500 text-sm mt-1">{todo.status}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 justify-end">
                                        {todo.status !== "completed" && (
                                            <button onClick={() => setUpdateId(todo.id)} className={`text-base ${todo.priority === "high"
                                                ? "text-red-700"
                                                : todo.priority === "medium"
                                                    ? "text-blue-700"
                                                    : "text-green-700"}`}>
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                        )}
                                        <button onClick={() => {
                                            dispatch(deleteTodo({ uid: user.id, deleteId: todo.id }));
                                            toast.success("Task Deleted Successfully!");
                                            dispatch(fetchTodo(user.id));
                                        }} className={`text-base ${todo.priority === "high"
                                            ? "text-red-700"
                                            : todo.priority === "medium"
                                                ? "text-blue-700"
                                                : "text-green-700"}`} >
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Todos