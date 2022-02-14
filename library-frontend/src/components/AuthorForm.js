import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const AuthorForm = (props) => {
  const getAuthors = useQuery(ALL_AUTHORS)
  const [ editAuthor, result ] = useMutation(EDIT_AUTHOR,
    {
      refetchQueries: [ { query: ALL_AUTHORS } ],
      onError: (error) => {
        console.log(JSON.stringify(error))
      }
    })

  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  useEffect(() => {
    if (result.data && !result.data.editAuthor) {
      props.notify('name not found')
    }
  })

  if (!props.show) return null

  if (getAuthors.loading) {
    return <div>loading...</div>
  }

  const authors = getAuthors.data ? getAuthors.data.allAuthors : []

  const submit = (event) => {
    event.preventDefault()
    editAuthor({
      variables: {name, setBornTo: parseInt(born)}
    })

    setBorn('')
  }

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <select onChange={({ target }) => setName(target.value)} defaultValue=''>
          <option value='' disabled hidden></option>
          {authors.map(author =>
            <option value={author.name} key={author.name}>{author.name}</option>)}
        </select>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default AuthorForm