import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage = () =>{
  let list = localStorage.getItem('list')
  if(list){
    return JSON.parse(localStorage.getItem('list'))
  }else {
    return []
  }
}

function App() {
  const [name, setName] = useState('')
  const [list, setList] = useState(getLocalStorage())
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)
  const [alert, setAlert] = useState({msg: '', type: '', show: false})

  const handleSubmit = (e) => {
    e.preventDefault()
    if(!name) {
      //display alert
      showAlert(true, 'please enter field', 'danger' )
    }else if(name && isEditing) {
      // handle edit
      setList(list.map(item =>{
        if(item.id === editId) {
          return {...item, title: name}
        }
        return item
      }))
      setName('')
      setEditId(null)
      setIsEditing(false)
      showAlert(true, 'value changed', 'success') 
    }else {
      showAlert(true, 'item added to the list',  'success')
      const newList = {id: new Date().getTime().toString(), title: name}
      setList([...list, newList])
      setName('')
    }
  }

  const showAlert = (show= false, msg='', type='') => {
    setAlert({show: show, msg: msg, type: type})
  }
  function clearList () {
    showAlert(true, 'succesfully cleared the list', 'success')
    setList([])
  }
  const removeItem = (id) => {
    showAlert(true, 'item removed', 'danger')
    setList(list.filter(item => item.id !== id))
  }

  const editItem = (id) => {
    const specificItem = list.find(item => item.id === id)
    setIsEditing(true)
    setEditId(id)
    setName(specificItem.title)
  }

  useEffect(()=>{
    localStorage.setItem('list', JSON.stringify(list))
  }, [list])

  return <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>shopping list</h3>
        <div className="form-control">
          <input type="text" className="grocery" value={name} onChange={(e)=> setName(e.target.value)} placeholder="e.g snacks" />
          <button type="submit" className="submit-btn">
            {isEditing ? 'edit' : 'submit'}
          </button>
        </div>

      </form>
      {
        list.length > 0 && 
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>clear items</button>
        </div>
      }
    </section>
}

export default App
