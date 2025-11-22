Kélvin Elí Ramírez Ponciano
000131643

Proyecto Final Base de Datos

IMPORTANTE
Para que el proyecto funcione correctamente se necesitan realizar dos cosas:
PRIMERO: Ejecutar el Script de SQL
SEGUNDO: Cambiar el archivo .env de la carpeta BACK 
         Lo más importante es que en DB_USER se coloque el usuario con el que se quiere acceder a la base de datos, y en DB_PASSWORD se debe colocar la contraseña de dicho usuario.
         De ser necesario, se deben cambiar los puertos dependiendo de los puertos que se usen para los servicios de SQL en cada ordenador. 

De preferencia se debe crear una carpeta para clonar allí este repositorio. 
Para ejecutar el Backend:
1. cd BACK
2. npm install
3. npm run start

Para ejecutar el Frontend:
1. cd Front
2. cd bd2-app
3. npm install
4. npm run dev

Existen 3 Roles: 
Administrador (Asigna los Tickets a los técnicos)
Empleado (Genera los Tickets)
Técnico (Soluciona los problemas relacionados a los Tickets y los marca como completados)

