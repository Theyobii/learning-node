import express  from 'express';
import { randomUUID } from 'node:crypto'
import { readFile } from 'fs/promises';
import { validateMovie } from './movies.js'

const data = await readFile('./movies.json')
const movies = JSON.parse(data)

const app = express()
app.use(express.json())
app.disable = ('x-powered-by')

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' })
})

//todos los recursos que sean MOVIES se identifica con /movies
app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }
  res.json(movies)
})

app.get('/movies/:id', (req, res) => { //path to regrexp 
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'Movie not found' })

})

app.post('/movies', (req, res) => {
    
    const result = validateMovie(req.body)

    if (!result.success) {
        return res.status(400).json({
            error: JSON.parse(result.error.message)   
        })
    }

    const newMovie = {
        id: randomUUID,
        ...result.data
    }    
        //Esto no seria REST, pq estamos guardando el estado de la aplicacion en memmoria
        movies.push(newMovie)

        res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
   const { id } = req.params
   const movieIndex = movies.findIndex(movie => movie.id === id)

   if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
   }

})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
