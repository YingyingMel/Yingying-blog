import { useEffect, useState } from 'react'
import "./movieland.scss"
import SearchIcon from "./search.svg"
import MovieCard from './MovieCard'

//Here is your key: e3caa36b

const API_URL = "https://www.omdbapi.com/?i=tt3896198&apikey=e3caa36b"

function MovieLand () {
  const [movies, setMovies] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const searchMovies = async (title) => {
    const res = await fetch(`${API_URL}&s=${title}`)
    const data = await res.json()
    //console.log(data.Search)
    setMovies(data.Search)
  }

  useEffect(() => {
    searchMovies('snow')
  }, [])

  return (
    <div className='movielandscss'>
      <h1 style={{ fontWeight: '700' }}>MovieLand</h1>
      <div className='search'>
        <input
          placeholder='Search for movies'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyUp={(e) => { if (e.key === 'Enter') { searchMovies(searchTerm) } }} />
        <img
          src={SearchIcon}
          alt='search'
          onClick={() => searchMovies(searchTerm)} />

      </div>
      {
        movies.length > 0
          ? (
            <div className='container'>
              {movies.map(movie => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}

            </div>
          ) : (
            <div className='empty'>
              <h2>No movie found</h2>
            </div>
          )
      }

    </div>
  )
}

export default MovieLand
