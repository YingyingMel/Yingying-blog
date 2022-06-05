import { useState } from "react"

const AddTask = ({ onAddTask }) => {
  const [text, setText] = useState()
  const [day, setDay] = useState()
  const [reminder, setReminder] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    if (!text) {
      alert('please input task')
      return
    }
    onAddTask({ text, day, reminder })
    setText('')
    setDay('')
    setReminder(false)
  }

  return (
    <form className="add-form" onSubmit={(e) => onSubmit(e)}>
      <div className="form-control">
        <label>Task</label>
        <input
          type="text"
          placeholder="Add task"
          value={text}
          onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="form-control">
        <label>Date&Time</label>
        <input
          type="text"
          placeholder="Add date&time"
          value={day}
          onChange={(e) => setDay(e.target.value)} />
      </div>
      <div className="form-control form-control-check">
        <label>Set Reminder</label>
        <input
          type="checkbox"
          checked={reminder}
          onChange={(e) => setReminder(e.currentTarget.checked)} />
      </div>
      <input className="btn btn-block" type="submit" value='Save task' />
    </form>
  )
}

export default AddTask