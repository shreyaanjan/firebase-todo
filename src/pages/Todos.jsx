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
                toast.info("Task Updated successfully!");
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#e0f2fe] via-[#f0f9ff] to-[#ede9fe] py-10 px-5 text-[#1e293b] font-[poppins]">
            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/60">
                <h2 className="text-center text-3xl font-semibold text-[#20233f] mb-10 tracking-wide">
                    TaskBoard
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-end gap-5 mb-10">
                    <div className="flex-1">
                        <label htmlFor="task" className="block mb-2 text-lg font-semibold text-[#334155]">
                            Enter Task
                        </label>
                        <input type="text" id="task" onChange={handleChange} value={input.task}
                            className="w-full h-11 bg-white/70 border-2 border-[#c7d2fe] text-[#1e293b] text-sm rounded-xl focus:border-[#6366f1] p-3 outline-none shadow-inner transition-all" />
                    </div>
                    <div className="w-full sm:w-40">
                        <label htmlFor="priority" className="block mb-2 text-lg font-semibold text-[#334155]">
                            Priority
                        </label>
                        <select id="priority" onChange={handleChange} value={input.priority}
                            className="w-full h-11 bg-white/70 border-2 border-[#c7d2fe] text-[#1e293b] text-sm rounded-xl focus:border-[#6366f1] p-3 outline-none shadow-inner transition-all">
                            <option value="">Select</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                    <button type="submit" className="submit-btn py-2 px-7 tracking-wider">
                        {isEdit ? "Update Task" : "Add Task"}
                    </button>
                </form>
                <div className="rounded-2xl border border-[#c7d2fe]/60 bg-[#f0f7ff]/80 backdrop-blur-xl shadow-[0_4px_20px_rgba(147,197,253,0.25)] transition-all duration-300 overflow-hidden">
                    <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#a5b4fc] scrollbar-track-transparent hover:scrollbar-thumb-[#818cf8]">
                        <table className="w-full text-sm text-left text-[#1e293b]">
                            <thead className="uppercase text-[#20233f] bg-[#e0e7ff]/80 border-b border-[#c7d2fe] sticky top-0 z-10">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Task</th>
                                    <th scope="col" className="px-6 py-4">Priority</th>
                                    <th scope="col" className="px-6 py-4">Status</th>
                                    <th scope="col" className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {todos.map((task) => (
                                    <tr key={task.id} className="border-t border-[#c7d2fe]/40 hover:bg-[#eef2ff]/60 transition-colors">
                                        <td className="px-6 py-4 text-base">{task.task}</td>
                                        <td className="px-6 py-4 capitalize font-semibold">
                                            <span className={`text-sm ${task.priority === "high" ? "text-[#b91c1c]" : task.priority === "medium" ? "text-[#d97706]" : "text-[#166534]"}`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${task.status === "completed" ? "bg-[#dcfce7] text-[#166534]" : "bg-[#fef9c3] text-[#a16207]"}`}>
                                                {task.status === "completed" ? "Completed" : "Pending"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex flex-wrap gap-3 justify-center">
                                            {task.status !== "completed" && (
                                                <button onClick={() => handleStatusChange(task)} className="text-green-600 text-base"
                                                    disabled={task.status === "completed"}>
                                                    <i className="bi bi-check-circle"></i>
                                                </button>
                                            )}
                                            {task.status !== "completed" && (
                                                <button onClick={() => setUpdateId(task.id)} className="text-yellow-600 text-base" >
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                            )}
                                            <button onClick={() => {
                                                dispatch(deleteTodo({ uid: user.id, deleteId: task.id }))
                                                dispatch(fetchTodo(user.id))
                                            }} className="text-red-600 text-base">
                                                <i className="bi bi-trash3"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Todos