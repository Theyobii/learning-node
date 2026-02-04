import express from 'express';
import { readFile } from 'fs/promises';

const app = express();
const PORT = 1234;
const ditto = JSON.parse(await readFile('./pokemon/ditto.json'));

app.use(express.json()) //middleware que parsea el body de las request que tienen el header content-type: application/json (todo el codigo de abajo btw)

// app.use((req, res, next) => {
//     if (req.headers['content-type'] === 'application/json') {
        
//         //solo llegab request que son POST y que tinene el header content-type: application/json
//          let body = ''

//         //escuchar el evento data
//         req.on('data', chunk => {
//         body += chunk.toString();
//         });

//         req.on('end', () => {
//         const data = JSON.parse(body)
        
//         //mutar la request y meter la informacion en el req.body
//         req.body = data
//         next()
//         });
//     } else {
//             next()
//         }
        
//     })

app.get('/pokemon/ditto', (req, res) => {
    res.json(ditto)
})

app.post('/pokemon', (req, res) => {
    //con req.body pasamos la informacion a una db
    res.status(201).json(req.body)
})

app.use((req, res) => {
    res.status(404).send('<h1>404 Not Found</h1>')
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})