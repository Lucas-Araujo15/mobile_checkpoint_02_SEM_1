import { ReactNode, createContext, useContext, useState, useEffect } from "react"
import { API, StatusCode } from "../config/constants"

interface Task {
    id: string
    name: string
}

interface GlobalStateContext {
    tasks: Task[]
    addTask: (name: string) => void
    updateTask: (id: string, newName: string) => void
    deleteTask: (id: string) => void
}

const GlobalStateContext = createContext<GlobalStateContext>({
    tasks: [],
    addTask: () => { },
    updateTask: () => { },
    deleteTask: () => { }
})

export const useGlobalState = () => useContext(GlobalStateContext)

interface GlobalStateProviderProps {
    children: ReactNode
}

export function GlobalStateProvider({ children }: GlobalStateProviderProps) {
    const [tasks, setTasks] = useState<Task[]>([])

    async function loadTasks() {
        try {
            const response = await fetch(`${API.BASE_URL}/tasks`) 

            if (!response.ok) {
                throw new Error('Não foi possível carregar as tarefas');
            }
            
            const { tasks } = await response.json();

            setTasks(tasks)
        } catch (error) {
            console.error('Erro ao carregar as tarefas:', error);
        }
    }

    async function addTask(name: string) {
        try {
            const response = await fetch(`${API.BASE_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name })
            })

            if (response.status !== StatusCode.CREATED) {
                throw new Error("Não foi possível adicionar a tarefa");
            }

            const data = await response.json() as Task

            setTasks([...tasks, data])
        } catch (error) {
            console.error('Erro ao adicionar a tarefa:', error);
        }
    }

    async function updateTask(id: string, newName: string) {
        try {
            const response = await fetch(`${API.BASE_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newName })
            })

            if (response.status !== StatusCode.NO_CONTENT) {
                throw new Error("Não foi possível editar a tarefa");
            }

            console.log('Tarefa editada com sucesso');

            const newTasks = tasks.map(task => task.id === id ? { ...task, name: newName } : task)

            setTasks(newTasks)

        } catch (error) {
            console.error('Erro ao editar a tarefa:', error);
        }
    }

    async function deleteTask(id: string) {
        try {
            const response = await fetch(`${API.BASE_URL}/tasks/${id}`, {
                method: 'DELETE'
            })

            if (response.status !== StatusCode.NO_CONTENT) {
                throw new Error("Não foi possível excluir a tarefa");
            }

            console.log('Tarefa excluída com sucesso');

            const newTasks = tasks.filter(task => task.id !== id)

            setTasks(newTasks)
        } catch (error) {
            console.error('Erro ao excluir a tarefa:', error);
        }
    }

    useEffect(() => {
        loadTasks();
      }, []);

    return (
        <GlobalStateContext.Provider value={{ tasks, addTask, deleteTask, updateTask }}>
            {children}
        </GlobalStateContext.Provider>
    )
} 