const express = require('express')
const app = express()
const exhbs = require('express-handlebars')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const varMiddleware = require('./middleware/variables')
const MongoStore = require('connect-mongodb-session')(session)
const MONGODB_URI = 'mongodb+srv://asad:b7q3JjGQzDpIfTfu@cluster0.l1arz.mongodb.net/cloth'
const userMiddleware = require('./middleware/user')
const csrf = require('csurf')
const flash = require('connect-flash')
const helmet = require('helmet')
const comression = require('compression')
const errorHandler = require('./middleware/error')


const ordersRoutes = require('./routes/order')
const homeRouter = require('./routes/home')
const cardRouter = require('./routes/card')
const clothesRouter = require('./routes/clothes')
const joinRouter = require('./routes/join')
const changeRouter = require('./routes/change')
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')



const store =new MongoStore({
    connection: 'sessions',
    uri: MONGODB_URI
})

const hbs = exhbs.create({
    defaultLayout: 'main.hbs',
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')





app.use(express.urlencoded({
    extended: true
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images',express.static(path.join(__dirname, 'images')))
app.use(session({
    secret: 'some secret word',
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(csrf())
app.use(flash())
// app.use(helmet())
app.use(comression())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/order',ordersRoutes)
app.use('/', homeRouter)
app.use('/clothes', clothesRouter)
app.use('/join', joinRouter)
app.use('/card', cardRouter)
app.use('/change', changeRouter)
app.use('/auth', authRouter)
app.use('/profile', profileRouter)

app.use(errorHandler)






const PORT = process.env.PORT || 3000
async function start() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
       
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (e) {
        console.log(e);
    }
}

start()