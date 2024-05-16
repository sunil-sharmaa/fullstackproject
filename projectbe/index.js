const express = require("express")
const app = express()
const port = 5600;
const cors = require("cors")

require('./dbconncet')
app.use(cors())
app.use(express.json())

app.use('/api/user',require('./routes/auth'))
app.use('/api/notesdata',require('./routes/Usernotes'))
app.use('/api/userdata',require('./routes/userinformation'))

app.listen(port,()=>{
    console.log('http://localhost:'+port)
})