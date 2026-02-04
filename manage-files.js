import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, basename, extname } from 'node:path'

const content = await readFile('archivo.txt', 'utf-8')
console.log(content)

const outputDir = join('output', 'files', 'documents',)
await mkdir(outputDir, { recursive: true })

const uppercaseContent = content.toUpperCase()
const outputFilePath = join(outputDir, 'archivo-uppercase.txt')

console.log('La extension es: ', extname(outputFilePath))
console.log('El nombre del archivo es: ', basename(outputFilePath))

await writeFile(outputFilePath, uppercaseContent)
console.log('Archivo creado con contenido en mayúsculas')