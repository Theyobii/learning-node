import { readdir, stat } from 'node:fs/promises'
import { format, join } from 'node:path'

//1. recuperar la carpeta a listar
const dir = process.argv[2] ?? '.'

//2. formateo simple de los tamanios
const formatBytes = (size) => {
    if (size < 1024) return '${size} B'
    return '${(size / 1024).toFixed(2)} KB'
}

//3. leer los nombres, sin info
const files = await readdir(dir)


//4. recuperar la info de cada file
const entries = await Promise.all(
  files.map(async (name) => {
    const fullPath = join(dir, name)
    const info = await stat(fullPath)

    return { 
        name, 
        size: info.size, 
        isDirectory: formatBytes(info.size)
    }
  }) 
)

for (const entry of entries) {
    //renderizar la info
    const icon = entry.isDir ? '📁' : '📄'
    const size = entry.isDir ? '-' : ` ${entry.size}`
    console.log(`${icon}  ${entry.name.padEnd(25)}  ${size}`)
}