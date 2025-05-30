require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

// Define the Song Schema and Model
const songSchema = new mongoose.Schema({
title: {
type: String,
required: true
},
singer: {
type: String,
required: true
},
link: {
type: String,
required: true
}
});

const Song = mongoose.model('Song', songSchema);

app.get('/api/songs', async (req, res) => {
try {
const songs = await Song.find();
res.status(200).json(songs);
} catch (err) {
res.status(500).json({ message: err.message });
}
});


app.get('/api/songs/:id', async (req, res) => {
try {
const song = await Song.findById(req.params.id);
if (!song) {
return res.status(404).json({ message: 'Song not found' });
}
res.status(200).json(song);
} catch (err) {
res.status(500).json({ message: err.message });
}
});


app.post('/api/songs', async (req, res) => {
const song = new Song({
title: req.body.title,
singer: req.body.singer,
link: req.body.link
});

try {
const newSong = await song.save();
res.status(201).json(newSong); 
} catch (err) {
res.status(400).json({ message: err.message }); 
}
});

app.put('/api/songs/:id', async (req, res) => {
try {
const { title, singer, link } = req.body;
const updatedSong = await Song.findByIdAndUpdate(
req.params.id,
{ title, singer, link },
{ new: true, runValidators: true});

if (!updatedSong) {
return res.status(404).json({ message: 'Song not found' });
}
res.status(200).json(updatedSong);
} catch (err) {
res.status(400).json({ message: err.message });
}
});


app.delete('/api/songs/:id', async (req, res) => {
try {
const deletedSong = await Song.findByIdAndDelete(req.params.id);
if (!deletedSong) {
return res.status(404).json({ message: 'Song not found' });
}
res.status(200).json({ message: 'Song deleted successfully' });
} catch (err) {
res.status(500).json({ message: err.message });
}
});



app.listen(PORT, () => {
console.log('Server is running on port ${PORT}');
});
