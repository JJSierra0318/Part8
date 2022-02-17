import { useQuery } from '@apollo/client'
import { ALL_BOOKS, GET_USER } from '../queries'

const Recommended = (props) => {
  const userResult = useQuery(GET_USER)
  const bookResult = useQuery(ALL_BOOKS)

  if(bookResult.loading || userResult.loading) return <div>loading...</div>

  if(!props.show) return null

  const user = userResult.data.me
  const books = bookResult.data.allBooks

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
          {books.filter(book => book.genres.includes(user.favoriteGenre)).map(a =>
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