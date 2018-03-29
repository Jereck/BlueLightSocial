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
    indexRoutes   = require("./routes/index");


seedDB();
mongoose.connect('mongodb://localhost/bluelight');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(express.static(__dirname + 'views'));
app.set('view engine', 'ejs');

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
app.use(therapyRoutes);

/////////////
// PROFILE //
/////////////
app.get("/profile", function(req, res){
    console.log(req.user);
    res.render("profile", {currentUser: req.user});
});


app.listen(3000, function(){
    console.log("Server is running...");
});