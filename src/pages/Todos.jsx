import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { addTodo } from "../features/todos/todoSlice"

const Todos = () => {
    const [input, setInput] = useState({
        task: '', priority: '',
    })
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector((store) => store.todos.currentUser)

    const handleChange = (e) => {
        setInput({ ...input, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            dispatch(addTodo({ uid: user.id, data: input }))
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
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
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Task</button>
            </form>
        </div>
    )
}

export default Todos