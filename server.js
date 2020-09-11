const express = require("express");
const path = require("path");
const moment = require("moment");
const fs = require("fs");

//set up Express App

const app = express();
let PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('db'));



//Routes

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
    notes = JSON.parse(fs.readFileSync(path.join(__dirname, "/db/db.json"), { encoding:'utf8'}));
console.log(notes);
});

app.get("/api/notes", function(req, res) {
    //Data
    notes = JSON.parse(fs.readFileSync(path.join(__dirname, "/db/db.json"), { encoding:'utf8'}));
    console.log(notes);


    return res.json(notes);
});

app.get("/api/notes/:note", function(req, res) {
    console.log(req.params.note);
    const thisNoteID = req.params.note;
    notes = JSON.parse(fs.readFileSync(path.join(__dirname, "/db/db.json"), { encoding:'utf8'}));
console.log(notes);

    console.log(thisNoteID);

    for (let item of notes) {
        if (thisNoteID === item.id) {
            return res.json(item);
        }
    }

    return res.json(false);
})

//POST

app.post("/api/notes", function(req, res) {
    let newNote = req.body;
    notes = JSON.parse(fs.readFileSync(path.join(__dirname, "/db/db.json"), { encoding:'utf8'}));
console.log(notes);

    newNote.routeName = newNote.title.replace(/ /g, "").toLowerCase();
    newNote.id = moment().format();

    console.log(newNote);

    notes.push(newNote);

    fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notes, null, 4), function(err){
        if (err) console.log(err);

        console.log("added note to file");
    })


    res.json(newNote);

})

//DELETE

app.delete("/api/notes/:note", function(req, res) {
    console.log(req.params.note);
    notes = JSON.parse(fs.readFileSync(path.join(__dirname, "/db/db.json"), { encoding:'utf8'}));
console.log(notes);

    tempArray = notes.filter(note => !(note.id === req.params.note));

    notes = tempArray;

    fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notes, null, 4), function(err){
        if (err) console.log(err);

        console.log("removed note from file");
    })

    console.log(notes);
    res.send("DELETE Request Called")
})


//Listening

app.listen(PORT, function(err) {
    if (err) console.log(err);
    console.log("App listening on PORT " + PORT);
  });