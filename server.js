import { randomUUID } from 'node:crypto'
import { createServer } from 'node:http'
import { json } from 'node:stream/consumers'

process.loadEnvFile()

const port = process.env.PORT ?? 3000

function sendJson(res, statusCode, data) {
    res.statusCode = statusCode
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(data))
}

const users = [
{
    "id": 1,
    "name": "Alice"
  },
  {
    "id": 2,
    "name": "Bob"
  },
  {
    "id": "621825fe-6e90-4f47-b67d-61d95d58927b",
    "name": "midu"
  },
  {
    "id": "9ef7472c-2791-4c7b-90f7-ff3e8f46bfea",
    "name": "jonny"
  }
]

const server = createServer(async (req, res) => {
    const { method, url } = req

    const [pathname, querystring] = url.split('?')

    const searchParams = new URLSearchParams(querystring)

    if (url === '/' ) {
        return sendJson(res, 200, { message: 'Welcome to the User API' })
    }

    if (method === 'GET'){
        if (pathname === '/users'){ 
            const limit = Number(searchParams.get('limit')) || users.length
            const offset = Number(searchParams.get('offset')) || 0

            const paginatedUsers = users.slice(offset, offset + limit)

            return sendJson(res, 200, paginatedUsers) 
        }

        if (pathname === '/health'){
            return sendJson(res, 200, {status: 'ok', uptime: process.uptime()})
        }        
    }

    if (method === 'POST'){
        if (url === '/users'){
            const body = await json(req)

            if (!body || !body.name){
                return sendJson(res, 400, { error: 'Name is required'})
            }

            const newUser = {
                id: randomUUID(),
                name: body.name
            }

            users.push(newUser)

            return sendJson(res, 201, { message: 'Usuario creado'})
        }
    }

    return sendJson(res, 404, {error: 'Not Found'})
})

server.listen(port, () => {
    console.log(`HTTP Server is running on http://localhost:${port}`);
})