import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { addTodo, deleteTodo, fetchTodo, updateTodo } from "../features/todos/todoSlice"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../config/firebase"

const Todos = () => {
    const [input, setInput] = useState({
        task: '', priority: '',
    })
    const [isEdit, setIsEdit] = useState(false)
    const [updateId, setUpdateId] = useState(null)

    const navigate = useNavigate()
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
        if (!isEdit) {
            dispatch(addTodo({ uid: user.id, data: input }))
        } else {
            dispatch(updateTodo({ uid: user.id, updateId, data: input }))
            setIsEdit(false)
            setUpdateId(null)
        }
        dispatch(fetchTodo(user.id))
        setInput({ task: '', priority: '' })
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
        <div className="container mx-auto">
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto my-10">
                <div className="mb-5">
                    <label htmlFor="task" className="block mb-2 text-sm font-medium text-gray-900">Enter Task</label>
                    <input type="text" id="task" onChange={handleChange} value={input.task} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="name@flowbite.com" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="priority" className="block mb-2 text-sm font-medium text-gray-900">Priority </label>
                    <select id="priority" onChange={handleChange} value={input.priority} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option value="">Select a Priority</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{isEdit ? "Update Task" : "Add Task"}</button>
            </form>
            <div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Task Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Priority
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                todos.map((task) => {
                                    return <tr key={task.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {task.task}
                                        </th>
                                        <td className="px-6 py-4">
                                            {task.priority}
                                        </td>
                                        <td className={`px-6 py-4 font-semibold ${task.status === "completed" ? "text-green-600" : "text-red-600"}`}>
                                            {task.status || "pending"}
                                        </td>
                                        <td className="px-6 py-4 flex gap-3 items-start">
                                            <button
                                                onClick={() => handleStatusChange(task)}
                                                className="font-medium text-blue-600 hover:underline disabled:text-gray-500"
                                                disabled={task.status === "completed"}>
                                                Mark as Done
                                            </button>
                                            {task.status !== "completed" && (
                                                <button onClick={() => setUpdateId(task.id)}
                                                    className="font-medium text-green-600 dark:text-green-500 hover:underline">
                                                    Edit
                                                </button>
                                            )}
                                            <button onClick={() => {
                                                dispatch(deleteTodo({ uid: user.id, deleteId: task.id }))
                                                dispatch(fetchTodo(user.id))
                                            }} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>

                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Todos