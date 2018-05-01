const   express     = require('express'),
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose'),
        passport    = require('passport'),
        LocalStrategy = require('passport-local'),
        methodOverride = require('method-override'),

        Therapy     = require('./models/therapy'),
        User        = require('./models/user'),        
        Comment     = require('./models/comment'),
        seedDB      = require('./seeds'),
        app         = express();

var therapyRoutes = require("./routes/therapies"),
    profileRoutes = require("./routes/profile"),
    groupRoutes   = require("./routes/groups"),
    indexRoutes   = require("./routes/index");


// seedDB();
mongoose.connect('mongodb://Jake:stella@ds229549.mlab.com:29549/bluelight');
// mongoose.connect('mongodb://localhost/bluelight');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));


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

app.get("/users", function(req, res){
    User.find({}, function(err, allUsers){
        if(err){
            console.log(err);
        } else {
            res.render("users", {users: allUsers});
        }
    });
});

// app.listen(3000, function(){
//     console.log("Server is running...");
// });

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running!")
});