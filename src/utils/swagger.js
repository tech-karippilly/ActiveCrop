import swaggerJsdoc from 'swagger-jsdoc'

const options ={
    definition:{
        openapi: "3.0.0",
        info:{
            title:"API Documendation",
            version:'1.0.0',
            description:"API documentation using Swagger"
        },
        servers:[
            {
                url:'http://localhost:3000'
            },
        ],
    },
    apis:["./routes/*.js"],
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec