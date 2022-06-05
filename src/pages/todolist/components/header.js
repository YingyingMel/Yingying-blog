import Button from './button'

const Header = ({ onAdd, showAdd }) => {
  return (
    <header className='header'>
      <h1 style={{ fontSize: '40px', margin: 0 }}>Task Tracker</h1>
      <Button
        onClick={onAdd}
        color={showAdd ? 'red' : '#1890ff'}
        text={showAdd ? 'Close' : 'Add'} />
    </header>
  )
}


export default Header