import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../../config/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";

export const signInUser = createAsyncThunk('signInUser', async ({ email, password }) => {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password)
        return {
            id: user.uid,
            name: user.displayName,
            email: user.email
        }
    } catch (error) {
        console.log(error);
    }
})

export const signInWithGoogle = createAsyncThunk('signInWithGoogle', async () => {
    try {
        const { user } = await signInWithPopup(auth, provider)
        return {
            id: user.uid,
            name: user.displayName,
            email: user.email
        }
    } catch (error) {
        console.log(error);
    }
})

export const signUpUser = createAsyncThunk('signUpUser', async ({ email, password }) => {
    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        return {
            id: user.uid,
            name: user.displayName,
            email: user.email
        }
    } catch (error) {
        console.log(error);
    }
})

export const addTodo = createAsyncThunk('todos/addTodo', async ({ uid, data }) => {
    try {
        const docRef = await addDoc(collection(db, `${uid}`), {
            ...data,
            status: "pending",
        })
        return {
            id: docRef.id,
            ...data
        }
    } catch (error) {
        console.log(error);
    }

})

export const fetchTodo = createAsyncThunk('todos/fetchTodo', async (uid) => {
    try {
        const { docs } = await getDocs(collection(db, `${uid}`))
        const allTodo = docs.map((todo) => {
            return {
                id: todo.id,
                ...todo.data()
            }
        })
        return allTodo
    } catch (error) {
        console.log(error);
    }
})

const todoSlice = createSlice({
    name: "todos",
    initialState: {
        list: [],
        currentUser: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.currentUser = action.payload
        },
        logout: (state) => {
            state.currentUser = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(signInUser.fulfilled, (state, action) => {
            state.currentUser = action.payload
        })
        builder.addCase(signInWithGoogle.fulfilled, (state, action) => {
            state.currentUser = action.payload
        })
        builder.addCase(signUpUser.fulfilled, (state, action) => {
            state.currentUser = action.payload
        })
        builder.addCase(addTodo.fulfilled, (state, action) => {
            state.list.push(action.payload)
        })
        builder.addCase(fetchTodo.fulfilled, (state, action) => {
            state.list = action.payload
        })
    }
})

export const { setUser, logout } = todoSlice.actions
export default todoSlice.reducer