import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CommandPalette from "./CommandPalette";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const CreateBlog = () => {
    const [title, setTitle] = useState("");
    const [sections, setSections] = useState([]);
    const [showPalette, setShowPalette] = useState(false);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(null);
    const navigate = useNavigate();

    const addSection = (type) => {
        if (currentSectionIndex !== null && currentSectionIndex < sections.length) {
            const newSections = [...sections];
            newSections[currentSectionIndex].type = type;
            setSections(newSections);
            setCurrentSectionIndex(null);
        } else {
            setSections([...sections, { type, data: "" }]);
        }
        setShowPalette(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "/") {
            setShowPalette(true);
        }
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(sections);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setSections(items);
    };

    const handleDelete = (index) => {
        const newSections = sections.filter((_, i) => i !== index);
        setSections(newSections);
    };

    const handleSubmit = async () => {
        try {
            await axios.post("http://localhost:5000/blog", {
                title,
                contentSections: sections,
            });
            alert("Blog created successfully!");
            navigate("/");
        } catch (err) {
            console.error("Error creating blog:", err);
        }
    };

    return (
        <div onKeyDown={handleKeyDown} tabIndex="0">
            <h1>Create Blog</h1>
            <input
                type="text"
                placeholder="Blog Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            {showPalette && <CommandPalette onSelect={addSection} />}
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections" isDropDisabled={false} isCombineEnabled={false}>
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {sections.map((section, index) => (
                                <Draggable key={index} draggableId={String(index)} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            {section.type === "Text" && (
                                                <textarea
                                                    placeholder="Content"
                                                    value={section.data}
                                                    onChange={(e) => {
                                                        const newSections = [...sections];
                                                        newSections[index].data = e.target.value;
                                                        setSections(newSections);
                                                    }}
                                                />
                                            )}
                                            {section.type === "Heading" && (
                                                <input
                                                    type="text"
                                                    placeholder="Heading"
                                                    value={section.data}
                                                    onChange={(e) => {
                                                        const newSections = [...sections];
                                                        newSections[index].data = e.target.value;
                                                        setSections(newSections);
                                                    }}
                                                />
                                            )}
                                            {section.type === "Image" && (
                                                <input
                                                    type="text"
                                                    placeholder="Image URL"
                                                    value={section.data}
                                                    onChange={(e) => {
                                                        const newSections = [...sections];
                                                        newSections[index].data = e.target.value;
                                                        setSections(newSections);
                                                    }}
                                                />
                                            )}
                                            <button onClick={() => handleDelete(index)}>Delete</button>
                                            <button onClick={() => {
                                                setCurrentSectionIndex(index);
                                                setShowPalette(true);
                                            }}>Change Type</button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default CreateBlog;