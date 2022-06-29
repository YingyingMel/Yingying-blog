import React from 'react'
import '@/pages/todolist/index.scss'
import AddTask from '@/pages/todolist/components/addTask'
import Header from '@/pages/todolist/components/header'
import Tasks from '@/pages/todolist/components/tasks'
import { useEffect, useState } from "react"
import { http } from '@/utils'


const ToDoList = () => {
  const [showAddTask, setShowAddTask] = useState(true)
  const [tasks, setTasks] = useState([])

  //useEffect监听渲染数据
  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  //从服务器获取所有数据
  const fetchTasks = async () => {
    const res = await http.get('/todolist')
    const data = res.data.tasks
    return data
  }


  //从服务器获取单个数据
  const fetchTask = async (id) => {
    const res = await http.get(`/todolist/${id}`)
    //console.log(res)
    const data = await res.data.tasks
    //console.log(data)
    return data
  }

  //从服务器删除
  const deleteTask = async (id) => {
    await http.delete(`/todolist/${id}`)
    setTasks(tasks.filter(item => item.id !== id))
  }

  //服务器reminder切换
  const toggleReminder = async (id) => {
    const res = await fetchTask(id) //拿到单个task数据
    const taskToggle = res[0]
    //console.log(taskToggle)
    const updTask = { ...taskToggle, reminder: !taskToggle.reminder } //把单个task的reminder切换
    //console.log(updTask)

    //把修改好的数据写回服务器
    await http.put(`/todolist/${id}`, { ...updTask, id: id })
    const renewTasks = await fetchTasks()
    //console.log(renewTasks)
    setTasks(renewTasks)
  }


  //添加数据到服务器，id数据库会自动添加
  const onAddTask = async (task) => {
    const res = await http.post('/todolist', { ...task })
    console.log(res)
    //把新增的数据返回
    const data = await res.data.tasks[0]
    setTasks([data, ...tasks])
  }

  return (
    <div className='todolistscss'>
      <div className="container-todolist">
        <Header
          onAdd={() => { setShowAddTask(!showAddTask) }}
          showAdd={showAddTask} />
        {
          <>
            {showAddTask && <AddTask onAddTask={onAddTask} />}
            {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />
              : 'No Task'}
          </>
        }
      </div>
    </div>


  )
}

export default ToDoList