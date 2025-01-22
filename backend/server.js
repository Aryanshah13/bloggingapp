const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
app.use(bodyParser.json());
app.use(cors());

const connectionString = process.env.MONGODB_CONNECTION_STRING;

mongoose.connect(connectionString)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const blogSchema = new mongoose.Schema({
    title: String,
    contentSections: [
        {
            type: { type: String },
            data: String,
        },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Blog = mongoose.model('Blog', blogSchema);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Blog API');
});

// Get all blogs
app.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single blog
app.get('/blog/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new blog
app.post('/blog', async (req, res) => {
    try {
        const newBlog = new Blog(req.body);
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update section
app.put('/blog/:id/section/:sectionId', async (req, res) => {
    try {
        const { id, sectionId } = req.params;
        const { type, data } = req.body;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).send({ message: 'Blog not found' });
        }
        const section = blog.contentSections.id(sectionId);
        if (!section) {
            return res.status(404).send({ message: 'Section not found' });
        }
        section.type = type;
        section.data = data;
        await blog.save();
        res.status(200).send(blog);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete blog
app.delete('/blog/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Attempting to delete blog with ID: ${id}`); // Add logging
        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) {
            console.log(`Blog with ID: ${id} not found`); // Add logging
            return res.status(404).send({ message: 'Blog not found' });
        }
        console.log(`Blog with ID: ${id} deleted successfully`); // Add logging
        res.status(200).send({ message: 'Blog deleted successfully' });
    } catch (err) {
        console.error(`Error deleting blog with ID: ${id}`, err); // Add logging
        res.status(500).send(err);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});