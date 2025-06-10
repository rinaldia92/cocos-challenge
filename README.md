# Cocos Challenge API

API REST para manejo de órdenes y portfolio de inversiones.

## Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (v14 o superior)
- npm o yarn

## Configuración del Entorno

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd cocos-challenge
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
   - Crear un archivo `.env` en la raíz del proyecto
   - Copiar el contenido de `.env.example`
   - Completar con tus valores:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=cocos_challenge
```

4. Configurar base de datos propia:
```bash
# Crear la base de datos
psql -U your_username -c "CREATE DATABASE cocos_challenge"

# Ejecutar migraciones
npm run typeorm:run-migrations
```

## Ejecutar la Aplicación

### Desarrollo

```bash
# Modo desarrollo con hot-reload
npm run dev
```

### Producción

```bash
# Compilar TypeScript
npm run build

# Iniciar servidor
npm start
```

## Endpoints de la API

La API está versionada y todos los endpoints están bajo el prefijo `/v1/api`

### Instrumentos

- `GET /v1/api/instruments` - Listar instrumentos
  - Query params:
    - `ticker`: Filtrar por ticker
    - `name`: Filtrar por nombre
    - `limit`: Cantidad de resultados (default: 10)
    - `page`: Número de página (default: 1)

### Portfolio

- `GET /v1/api/users/:userId/portfolio` - Obtener portfolio de un usuario
  - Path params:
    - `userId`: ID del usuario

### Órdenes

- `POST /v1/api/orders` - Crear nueva orden
  - Body:
    ```json
    {
      "userId": number,
      "instrumentId": number,
      "type": "MARKET" | "LIMIT",
      "side": "BUY" | "SELL" | "CASH_IN" | "CASH_OUT",
      "quantity": number,
      "price": number (opcional para MARKET)
    }
    ```

## Tests

```bash
# Ejecutar tests
npm test

# Ejecutar tests con coverage
npm run test:coverage
```

## Estructura del Proyecto

```
src/
├── config/         # Configuraciones (database, etc)
├── constants/      # Constantes y enums
├── controllers/    # Controladores de rutas
├── middleware/     # Middlewares de Express
├── models/         # Modelos de TypeORM
├── repositories/   # Repositorios de datos
├── routes/         # Definición de rutas
├── schemas/        # Schemas de validación
├── services/       # Lógica de negocio
└── utils/          # Utilidades y helpers
tests/
├── controllers/    # Tests unitarios de los controllers
├── services/       # Tests unitarios de los services
└── mocks/          # Mocks de distintas funcionalidades
```

## Tecnologías Principales

- TypeScript
- Express.js
- TypeORM
- PostgreSQL
- Jest (Testing)
- Joi (Validación)

## Scripts Disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo
- `npm run build`: Compila el código TypeScript
- `npm start`: Inicia el servidor en modo producción
- `npm test`: Ejecuta los tests
- `npm run test:coverage`: Ejecuta los tests con reporte de coverage
- `npm run lint`: Ejecuta el linter
- `npm run lint:fix`: Corrige errores de linting automáticamente
- `npm run typeorm:run-migrations`: Ejecuta las migraciones pendientes
- `npm run typeorm:revert-migration`: Revierte la última migración

## Mejoras a realizar

- Uso de docker y docker compose para instanciar el servidor y una base de datos local.
- Uso de docker y docker compose para instanciar base de datos de test para tests de integracion.
- Uso y envios de metricas a alguna herramienta como Datadog.
- Servicio de logging en herramientas como Grafana.
- Agregar contexto en la request para realizar una traza correcta entre distintas APIs (si las hubiera)
