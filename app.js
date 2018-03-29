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

/////////////////
// HOME PAGE ////
/////////////////
app.get("/", function(req, res){
    res.render("index");
});

////////////////////
// THERAPIES PAGE //
////////////////////
app.get("/therapies", function(req, res){
    // Gather Therapies for DB
    Therapy.find({}, function(err, allTherapies){
        if(err){
            console.log(err);
        } else {
            res.render("therapies", {therapies: allTherapies, currentUser: req.user});
        }
    });
});

app.post("/therapies", function(req, res){
    var name = req.body.name
    var image = req.body.image
    var description = req.body.description
    var city = req.body.city
    var state = req.body.state
    var zip = req.body.zip

    var newTherapy = {
        name: name, 
        image: image, 
        description: description,
        city: city,
        state: state,
        zip: zip
    }

    // Create new Therapy and save to DB
    Therapy.create(newTherapy, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/therapies");
        }
    });
});

app.get("/therapies/new", function(req, res){
    res.render("new-therapy.ejs", {currentUser: req.user});
});

app.get("/therapies/:id", function(req, res){
    Therapy.findById(req.params.id).populate("comments").exec(function(err, foundTherapy){
        if(err){
            console.log(err);
        } else {
            res.render("show-therapy", {therapy: foundTherapy});
        }
    });
});

app.post("/therapies/:id/comments", isLoggedIn, function(req, res){
    Therapy.findById(req.params.id, function(err, therapy){
        if(err){
            console.log(err);
            res.redirect("/therapies");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    therapy.comments.push(comment);
                    therapy.save();
                    res.redirect("back");
                }
            });
        }
    });
});

/////////////////
// AUTH ROUTES //
/////////////////
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/therapies");
        });
    });
});

app.post('/login',
    passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/register' }));

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

/////////////
// PROFILE //
/////////////
app.get("/profile", function(req, res){
    res.render("profile");
});

app.post("/profile", function(req, res){
    res.redirect("/profile");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}

app.listen(3000, function(){
    console.log("Server is running...");
});