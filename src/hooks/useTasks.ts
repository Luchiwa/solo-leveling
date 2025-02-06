import { listenToTasks } from '@src/services/taskService'
import { useEffect, useState } from 'react'

export const useTasks = () => {
  const [tasks, setTasks] = useState<any[]>([])

  useEffect(() => {
    const unsubscribe = listenToTasks(setTasks)
    return () => unsubscribe()
  }, [])

  return tasks
}
