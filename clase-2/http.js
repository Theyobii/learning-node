import { createServer } from "node:http"; 
import { readFile } from "node:fs/promises";

const port = 3000;

const processRequest = (async (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    if (req.url === '/' ) {
        res.statusCode = 200;
        res.end('<h1>Welcome to the User API</h1>');
    } else if (req.url === '/imagen-pro.png') {
        
        try {
            const imageData = await readFile('imagen-papu.png');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'image/png');
            res.end(imageData);
        } catch (error) {
            res.statusCode = 500;
            res.end('<h1>500 Internal Server Error</h1>');
        }
       
    } else if (req.url === '/contact') {
        res.statusCode = 200;
        res.end('<h1>Contact us at contact@example.com</h1>');
    } else {
        res.statusCode = 404;
        res.end('<h1>404 Not Found</h1>');
    }
});

const server = createServer(processRequest);

server.listen(port, () => {
    console.log(`HTTP Server is running on http://localhost:${port}`);
})