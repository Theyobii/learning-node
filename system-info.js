import os from 'node:os'
import ms from 'ms'

console.log('Información del sistema operativo:')

console.log('Tipo de SO:', os.type())
console.log('Plataforma:', os.platform())
console.log('Arquitectura:', os.arch())
console.log('Memoria total (bytes):', os.totalmem())
console.log('Memoria libre (bytes):', os.freemem())
console.log('Directorio home del usuario:', os.homedir())
console.log('Tiempo de actividad del sistema (segundos):', ms(os.uptime() * 1000))

console.log('--------------------------------------------')
console.log('Número de CPUs:', os.cpus())
console.log('--------------------------------------------')