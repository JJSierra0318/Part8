import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'

import { LOGIN } from '../queries'

const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      props.setError(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      props.setToken(token)
      localStorage.setItem('library-user-token', token)
      props.setPage('authors')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.data])

  if(!props.show) {
    return null
  }

  const onSubmit = (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          name <input
          type='text'
            value={username}
            onChange={({ target }) => {setUsername(target.value)}}
          />
        </div>
        <div>
          password <input
          type='password'
            value={password}
            onChange={({ target }) => {setPassword(target.value)}}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm
