const   express     = require('express'),
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose'),
        passport    = require('passport'),
        LocalStrategy = require('passport-local'),

        Therapy     = require('./models/therapy'),
        Comment     = require('./models/comment'),
        User        = require('./models/user'),
        seedDB      = require('./seeds'),
        app         = express();

var therapyRoutes = require("./routes/therapies"),
    profileRoutes = require("./routes/profile"),
    groupRoutes   = require("./routes/groups"),
    indexRoutes   = require("./routes/index");


seedDB();
mongoose.connect('mongodb://localhost/bluelight');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Stell is the best and cutest dog",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use(profileRoutes);
app.use(therapyRoutes);
app.use(groupRoutes);

app.listen(3000, function(){
    console.log("Server is running...");
});