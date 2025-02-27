const swaggerDocument ={
    openapi: "3.0.0",
    info: {
      title: "Active Crop ",
      version: "1.0.0",
      description: "API for Active crop."
    },
    paths:{
        "/test":{
            get:{
                summery:"Test",
                description:"Test",
                tags:["Test"],
            }
        }
    }
}


export default swaggerDocument