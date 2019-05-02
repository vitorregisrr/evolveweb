const bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    mongoDBSession = require('connect-mongodb-session')(session);
    path = require('path'),
    express = require('express'),
    csurfProtection = require('csurf')({cookie: true}),
    isAuth = require('./app/middleware/is-auth'),
    multer = require('./app/middleware/multer'),
    sitemapGenerator = require('./app/util/sitemap'),
    setLocals = require('./app/middleware/set-locals'),
    fs = require('fs'),
    MONGO_URI = require('./app/util/MONGO_URI'),
    nodeCron = require('node-cron');

// Initializing app
const app = express();

// Setting middlewares
app.set('view engine', 'ejs');
app.set('views', 'app/views');

app.use(cookieParser());

const storeSession = new mongoDBSession({
    uri: MONGO_URI,
    collect: 'sessions'
});

app.use( bodyParser.urlencoded({
    extended: false
}));

app.use(expressSession({
    secret: 'A vida é muito coolzástica',
    resave: false,
    saveUninitialized: false,
    store: storeSession,
    cookie: {
        maxAge: 60 * 60 * 24 * 30 * 1000
    }
}));

app.use(multer.single('image'));

app.use(csurfProtection);

app.use(express.static(path.join(__dirname, 'app/public')));

// Middlewares end

// Routing

//Public routes 
const publicRoutes = require('./app/routes/public');
app.use(publicRoutes);

//Admin routes
const adminRoutes = require('./app/routes/admin');
const authRoutes = require('./app/routes/auth');
const errorRoutes = require('./app/controllers/error');

app.use(authRoutes);
app.use(adminRoutes);
app.use(errorRoutes.get404);
app.use(errorRoutes.get500);

// Routing end

// Sitemap task
sitemapGenerator()
nodeCron.schedule('0 0 0 * * *', function () {
   sitemapGenerator()
});

//starting server
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true
})
.then((resul) => {})
.then(resul => {
    app.listen(process.env.PORT || 3000);
})
.catch(err => console.log(err));
