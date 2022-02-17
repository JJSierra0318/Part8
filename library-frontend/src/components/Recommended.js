import { useLazyQuery, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { ALL_BOOKS_FILTERED, GET_USER } from '../queries'

const Recommended = (props) => {
  const userResult = useQuery(GET_USER)
  const [bookResult, {loading, data}] = useLazyQuery(ALL_BOOKS_FILTERED)
  const [books, setBooks] = useState([])
  const [flag, setFlag] = useState(false)

  userResult.refetch()

  useEffect(() => {
    if (userResult.data){
      if (data && data.allBooks) setBooks(data.allBooks)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flag, data])

  if (loading || userResult.loading) return <div>loading...</div>

  if(!props.show) return null

  const user = userResult.data.me

  if (data && data.length > 0 && !flag) {
    setFlag(true)
  } else if (!data) {
    bookResult({ variables: {genre: userResult.data.me.favoriteGenre} })
  }

  return (
    <div>
      <h2>recommendations</h2>
      <br/>
      books  in your favorite genre: <strong>{user.favoriteGenre}</strong>
      <br/>
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
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    
  )
}

export default Recommended