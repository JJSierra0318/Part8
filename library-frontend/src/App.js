import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import AuthorForm from './components/AuthorForm'
import LoginForm from './components/LoginForm'
import { useApolloClient } from '@apollo/client'
import Recommended from './components/Recommended'

const Notify = ({ message }) => {
  if(!message) return null

  return (
    <div style={{color: 'red'}}>
      {message}
    </div>
  )
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token 
          ? <button onClick={() => setPage('add')}>add book</button> 
          :null}
        {token
          ? <button onClick={() => {setPage('recommended')}}>recommended</button>
          : null}
        {!token 
        ? <button onClick={() => setPage('login')}>login</button>
        : <button onClick={logout}>logout</button>}
      </div>
      <Notify message={errorMessage} />
      <Authors
        show={page === 'authors'}
      />
      <AuthorForm
      show={page === 'authors'}
      notify={notify}
      />
      <Books
        show={page === 'books'}
      />
      <NewBook
        show={page === 'add'}
        setError={notify} 
      />
      <LoginForm
        show={page === 'login'}
        setError={notify}
        setToken={setToken}
        setPage={setPage}
      />
      <Recommended
        show={page === 'recommended'}
      />
    </div>
  )
}

export default App