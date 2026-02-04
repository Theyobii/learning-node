import { readFile } from 'node:fs/promises';
import { createServer} from 'node:http';

const port = 4000;


const handleRequest = async (req, res) => {

    const { method, url } = req;

    switch (method) {
        case 'GET':
            switch (url) {
                case '/pokemon/ditto':
                    try {
                        const dittoData = await readFile('./pokemon/ditto.json', 'utf-8');
                        res.setHeader('Content-Type', 'application/json; charset=UTF-8');
                        return  res.end(JSON.stringify(dittoData));
                    } catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json; charset=UTF-8' });
                        return res.end(JSON.stringify({ error: 'Server error', message: err.message }));
                    }
                
                default:
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
                    return res.end('<h1>404 Not Found</h1>');
            }

        case 'POST':
            switch (url) {
                case '/pokemon':
                    let body = ''

                    //escuchar el evento data
                    req.on('data', chunk => {
                        body += chunk.toString();
                    });

                    //escuchar el evento end
                    req.on('end', () => {
                        //llamar una base de datos para guardar la info
                        console.log('Body recibido:', body);
                        res.statusCode = 201;
                        res.setHeader('Content-Type', 'application/json; charset=UTF-8');
                        res.end(JSON.stringify({ message: 'Pokémon received', data: JSON.parse(body) }));
                    });
                    break;

                default:
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
                    return res.end('<h1>404 Not Found</h1>');
            }
            break;
    }
}

const server = createServer(handleRequest);

server.listen(port, () => {
    console.log(`Servidor HTTP escuchando en http://localhost:${port}`);
})