import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cocos Challenge API',
      version: '1.0.0',
      description: 'API para manejo de órdenes y portfolio de inversiones',
    },
    servers: [
      {
        url: '/v1/api',
        description: 'API v1',
      }
    ],
    components: {
      schemas: {
        Instrument: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID del instrumento',
            },
            ticker: {
              type: 'string',
              description: 'Símbolo/ticker del instrumento',
            },
            name: {
              type: 'string',
              description: 'Nombre del instrumento',
            },
            type: {
              type: 'string',
              enum: ['ACCIONES', 'MONEDA'],
              description: 'Tipo de instrumento',
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID de la orden',
            },
            userId: {
              type: 'integer',
              description: 'ID del usuario',
            },
            instrumentId: {
              type: 'integer',
              description: 'ID del instrumento',
            },
            type: {
              type: 'string',
              enum: ['MARKET', 'LIMIT'],
              description: 'Tipo de orden',
            },
            side: {
              type: 'string',
              enum: ['BUY', 'SELL', 'CASH_IN', 'CASH_OUT'],
              description: 'Lado de la orden',
            },
            status: {
              type: 'string',
              enum: ['NEW', 'FILLED', 'REJECTED', 'CANCELLED'],
              description: 'Estado de la orden',
            },
            quantity: {
              type: 'number',
              description: 'Cantidad de la orden',
            },
            price: {
              type: 'number',
              description: 'Precio de la orden',
            },
          },
        },
        Portfolio: {
          type: 'object',
          properties: {
            availableCash: {
              type: 'number',
              description: 'Efectivo disponible en la cuenta',
            },
            positions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  instrumentId: {
                    type: 'integer',
                    description: 'ID del instrumento',
                  },
                  instrumentName: {
                    type: 'string',
                    description: 'Nombre del instrumento',
                  },
                  quantity: {
                    type: 'number',
                    description: 'Cantidad de instrumentos',
                  },
                  currentPrice: {
                    type: 'string',
                    description: 'Precio actual',
                  },
                  totalValue: {
                    type: 'number',
                    description: 'Valor total de la posición',
                  },
                  pnlPercent: {
                    type: 'number',
                    description: 'Porcentaje de ganancia/pérdida',
                  },
                },
              },
            },
            totalValue: {
              type: 'number',
              description: 'Valor total del portfolio',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de error',
            },
            statusCode: {
              type: 'integer',
              description: 'Código de estado HTTP',
            },
            internalCode: {
              type: 'string',
              description: 'Código interno de error',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Rutas donde están los comentarios de Swagger
};

export const swaggerSpec = swaggerJSDoc(options); 