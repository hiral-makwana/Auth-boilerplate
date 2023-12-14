import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

let definition: any;
let apiPath = path.join(__dirname, '../../dist/**/*.js' )

definition = {
    openapi: '3.0.0',
    info: {
        title: 'Authentication-Library',
        version: '1.0.0',
        description: 'API documentation for Authentication-Library',
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    servers: [
        {
            url: process.env.DEFAULT,
        },
        {
            url: process.env.SWAGGER,
        },
    ]
}
const options = {
    definition,
    apis: ['./src/**/*.ts', apiPath],
};
const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
