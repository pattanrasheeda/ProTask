import React, { useState } from 'react';

const AddTaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !deadline) return alert("Please fill all fields");
    onAdd({ title, description, deadline });
    setTitle('');
    setDescription('');
    setDeadline('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow">
      <h5>Add New Task</h5>
      <div className="mb-2">
        <input type="text" placeholder="Title" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="mb-2">
        <textarea placeholder="Description" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="mb-2">
        <input type="date" className="form-control" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      </div>
      <button className="btn btn-primary w-100" type="submit">Add Task</button>
    </form>
  );
};

export default AddTaskForm;