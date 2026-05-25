# 2026-TP-Docker-Banham-Davila

Proyecto Docker con dos backends simples (Go + NestJS) conectados a bases de datos MySQL, cada uno en su propia red Docker.

## Estructura

```
.
├── app-docker/          # Backend NestJS (TypeORM + MySQL)
│   ├── Dockerfile
│   ├── .env
│   └── src/
├── app-docker-gin/      # Backend Go (Gin + MySQL)
│   ├── Dockerfile
│   ├── .env
│   └── main.go
└── .gitignore
```

## Requisitos

- Docker Desktop instalado y corriendo

## Configuración

### 1. Variables de entorno

Cada app tiene su propio `.env` con la configuración de conexión a MySQL.

**`app-docker-gin/.env`:**

```
DB_USER=root
DB_PASSWORD=root
DB_HOST=mysql-gin
DB_NAME=testdb
```

**`app-docker/.env`:**

```
PORT=3000
DB_USERNAME=root
PASSWORD=root
DB=testdb
DB_HOST=mysql-nest
```

> `DB_HOST` apunta al nombre del contenedor MySQL dentro de su respectiva red Docker.

## Instalación y ejecución

### 1. Crear las redes Docker

```powershell
docker network create gin-net
docker network create nest-net
```

### 2. Levantar las bases de datos MySQL

```powershell
# MySQL para la app Go
docker run -d --name mysql-gin --network gin-net -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=testdb mysql:8

# MySQL para la app NestJS
docker run -d --name mysql-nest --network nest-net -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=testdb mysql:8
```

### 3. Construir las imágenes

```powershell
# App Go
docker build -t app-docker-gin ./app-docker-gin

# App NestJS
docker build -t app-docker ./app-docker
```

### 4. Ejecutar los contenedores

```powershell
# App Go
docker run -d --name app-gin --network gin-net -p 8080:8080 -v "${PWD}/app-docker-gin:/srv" --env-file ./app-docker-gin/.env app-docker-gin

# App NestJS
docker run -d --name app-nest --network nest-net -p 3000:3000 -v "${PWD}/app-docker:/srv" --env-file ./app-docker/.env app-docker
```

## Pruebas

### App Go (puerto 8080)

```powershell
# Health check
Invoke-RestMethod http://localhost:8080/health

# Estado de la base de datos
Invoke-RestMethod http://localhost:8080/db-status

# Crear un item
Invoke-RestMethod -Method POST http://localhost:8080/post/items -Headers @{"Content-Type"="application/json"} -Body '{"nombre":"test"}'

# Listar items
Invoke-RestMethod http://localhost:8080/get/items
```

### App NestJS (puerto 3000)

```powershell
# Health check
Invoke-RestMethod http://localhost:3000/health

# Estado de la base de datos
Invoke-RestMethod http://localhost:3000/db-status

# Crear un item
Invoke-RestMethod -Method POST http://localhost:3000/create-item -Headers @{"Content-Type"="application/json"} -Body '{"nombre":"test"}'

# Listar items
Invoke-RestMethod http://localhost:3000/items
```

## Comandos útiles

```powershell
# Ver contenedores activos
docker ps

# Ver logs de un contenedor
docker logs app-gin
docker logs app-nest

# Detener y eliminar contenedores
docker stop app-gin mysql-gin app-nest mysql-nest
docker rm app-gin mysql-gin app-nest mysql-nest
```
