import React from 'react'
import '@/pages/todolist/index.scss'
import AddTask from '@/pages/todolist/components/addTask'
import Header from '@/pages/todolist/components/header'
import Tasks from '@/pages/todolist/components/tasks'
import { useEffect, useState } from "react"


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

  //从json服务器获取所有数据
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    return data
  }


  //从json服务器获取单个数据
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    return data
  }

  //静态删除
  // const deleteTask = (id) => {
  //   setTasks(tasks.filter(item => item.id !== id))
  // }
  //从服务器删除
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })
    setTasks(tasks.filter(item => item.id !== id))
  }

  //静态数据reminder切换
  // const toggleReminder = (id) => {
  //   setTasks(
  //     tasks.map((item) => item.id === id ? { ...item, reminder: !item.reminder }
  //       : item)
  //   )
  // }

  //服务器reminder切换
  const toggleReminder = async (id) => {
    const taskToggle = await fetchTask(id) //拿到单个task数据
    const updTask = { ...taskToggle, reminder: !taskToggle.reminder } //把单个task的reminder切换

    //把修改好的数据写回服务器
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updTask),
    })
    const data = await res.json()//这里的data只包含了被修改的单个数据
    setTasks(
      tasks.map((item) => item.id === id ? { ...item, reminder: data.reminder }
        : item)
    )
  }

  //静态数据添加
  // const onAddTask = (task) => {
  //   const id = Math.floor(Math.random() * 10000) + 1
  //   //console.log(id)
  //   const newTask = { id, ...task }
  //   setTasks([newTask, ...tasks])
  // }

  //添加数据到服务器，id服务器会自动添加
  const onAddTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task),
    })
    const data = await res.json()
    setTasks([data, ...tasks])
  }

  return (
    <div className="container">
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

  )
}

export default ToDoList