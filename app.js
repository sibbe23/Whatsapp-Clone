const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser")
require('dotenv').config()
const path = require("path")
const morgan = require("morgan")
const fs = require("fs")
const cron = require("node-cron")
const http = require('http')
const socketIO = require('socket.io')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const server = http.createServer(app)
const io = socketIO(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
})
const accessLogStream = fs.createWriteStream('access.log', { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))

const sequelize = require("./util/database")

const User = require("./models/user")
const Group = require("./models/group")
const Message = require('./models/message')
const GroupUser = require("./models/groupUser")
const Forgetpassword = require("./models/forgetPasswords")

const signupRoutes = require("./routes/signup")
const chatRoutes = require("./routes/chatRoutes")
const groupRoutes = require("./routes/groupRoutes")
const adminRoutes = require("./routes/adminRoutes")
const forgotPasswordRoute = require("./routes/forgotPassword")


User.hasMany(Message)
Message.belongsTo(User)
Group.belongsToMany(User, { through: GroupUser })
User.belongsToMany(Group, { through: GroupUser })
Group.hasMany(Message)
Message.belongsTo(Group)
User.hasMany(Forgetpassword)
Forgetpassword.belongsTo(User)

app.use(signupRoutes)
app.use(forgotPasswordRoute)
app.use("/chat", chatRoutes)
app.use("/groups", groupRoutes)
app.use(adminRoutes)


app.use((req, res) => {
    let url = req.url
    res.header('Content-Security-Policy', "img-src 'self'");
    if (url == "/") {
        url = "signup.html"
    }
    res.sendFile(path.join(__dirname, `public/${url}`))
})
io.on('connection', socket => {
    console.log('a user connected')
    socket.on("join-room", (room) => {
        socket.join(room)
    })
    socket.on('new-chat', message => {
        socket.to(message.room).emit('recieve', message)
    })
})
const chatController = require("./controllers/chatControllers")

cron.schedule('0 0 * * *', chatController.archiveChat)

sequelize
    .sync()
    // .sync({ force: true })
    .then(() => {
        console.log("db connected")
        server.listen(process.env.PORT || 3000, () => {
            console.log(`server started on port ${process.env.PORT}`)
        })
    })

