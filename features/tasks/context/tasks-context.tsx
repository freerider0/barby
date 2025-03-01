import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Task } from '../data/schema'

// Define the possible types of dialogs we can open
// This can be either 'create', 'update', 'delete', or 'import'
type TasksDialogType = 'create' | 'update' | 'delete' | 'import'

// Define the shape of our context
// This interface describes what data and functions will be available in the context
interface TasksContextType {
  open: TasksDialogType | null      // Tracks which dialog is currently open (if any)
  setOpen: (str: TasksDialogType | null) => void  // Function to open/close dialogs
  currentRow: Task | null           // Stores the currently selected task
  setCurrentRow: React.Dispatch<React.SetStateAction<Task | null>>  // Function to update the selected task
}

// Create a new React Context with null as initial value
const TasksContext = React.createContext<TasksContextType | null>(null)

// Define props interface for the TasksProvider component
interface Props {
  children: React.ReactNode  // This allows the provider to wrap other components
}

// Create the TasksProvider component that will wrap our app
export default function TasksProvider({ children }: Props) {
  // Initialize state using custom hook for dialog management
  const [open, setOpen] = useDialogState<TasksDialogType>(null)
  // Initialize state for tracking the currently selected task
  const [currentRow, setCurrentRow] = useState<Task | null>(null)

  return (
    // Provide the context values to all child components
    <TasksContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </TasksContext>
  )
}

// Create a custom hook to easily access the tasks context
// The eslint comment is needed because this is a hook that's being exported
// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => {
  // Get the context value
  const tasksContext = React.useContext(TasksContext)

  // Throw an error if this hook is used outside of TasksContext
  if (!tasksContext) {
    throw new Error('useTasks has to be used within <TasksContext>')
  }

  return tasksContext
}
