import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [filter, setFilter] = useState(null)

  const result =  useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data ? result.data.allBooks : []
  const filteredBooks = filter ? books.filter(book => book.genres.includes(filter)) : books
  

  let genres = []

  const getGenres = (book) => {
    book.genres.map(genre => {
      return genres.includes(genre) 
        ? null
        : genres = genres.concat(genre)
    })
  }

  result.data.allBooks.map(book => getGenres(book))

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {filteredBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <br/>
      filter by: {genres.map(genre => {
        return <button key={genre} onClick={() => {setFilter(genre)}}>{genre}</button>
      })}
      <button onClick={() => {setFilter(null)}}>all genres</button>
    </div>
  )
}

export default Books