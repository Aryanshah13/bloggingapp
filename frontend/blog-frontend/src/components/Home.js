import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css"; // Correct the import path to use lowercase .css

const Home = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get("http://localhost:5000/blogs");
                setBlogs(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching blogs:", err);
            }
        };
        fetchBlogs();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/blog/${id}`);
            setBlogs(blogs.filter(blog => blog._id !== id));
        } catch (err) {
            console.error("Error deleting blog:", err);
        }
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container">
            <h1>Blogs</h1>
            <Link to="/create">Create Blog</Link>
            <input
                type="text"
                placeholder="Search by title"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="blog-list">
                {filteredBlogs.map((blog) => (
                    <div key={blog._id}>
                        <h2>{blog.title}</h2>
                        {blog.contentSections.map((section, index) => (
                            <p key={index}>{section.data}</p>
                        ))}
                        <button onClick={() => handleDelete(blog._id)} className="delete">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;