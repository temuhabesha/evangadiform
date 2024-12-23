const express = require('express')
const app = express();

const port = 5500;

//dbconnection

const db_connection = require('./db/db.config')

// user routes middel ware
const userRoute = require('./routes/userRout')

//json middel ware

app.use(express.json())

app.use('/api/users',userRoute)

async function start (){
    try {
    const result = await db_connection.execute("select 'test'")
    app.listen(port)
    console.log('database connection established') 
    console.log(`listening on ${port}`)
} catch (error) {
    console.log(error.message);
    
}
}
start()
