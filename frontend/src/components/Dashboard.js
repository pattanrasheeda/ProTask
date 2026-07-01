import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    category: ''
  });

  const [sortBy, setSortBy] = useState('date');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.deadline) {
      alert('Please enter both title and deadline!');
      return;
    }

    const newTask = {
      id: Date.now(),
      ...formData,
      completed: false
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setFormData({ title: '', description: '', deadline: '', category: '' });
  };

  const handleDelete = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const toggleComplete = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'done') {
      return a.completed - b.completed;
    } else {
      return new Date(a.deadline) - new Date(b.deadline);
    }
  });

  // Pomodoro logic
  const [seconds, setSeconds] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);

  // 🔔 Play alert sound using Web Audio API
  const playAlarm = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
    oscillator.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 1); // Play for 1 second
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => {
          if (prev === 1) {
            setIsRunning(false);
            playAlarm(); // ⏰ Play alarm when time's up
          }
          return prev > 0 ? prev - 1 : 0;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setSeconds(1500);
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="fw-bold" style={{ color: '#004d40' }}>
          📅 Welcome to ProTask Dashboard
        </h2>
        <p className="lead text-muted">Plan, focus, and stay productive every day!</p>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4 g-4">
        <div className="col-md-6">
          <div className="card p-4 border-start border-4 border-success shadow-sm">
            <h5>🎯 Total Tasks</h5>
            <p className="fs-5">{tasks.length} task(s)</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-4 border-start border-4 border-warning shadow-sm">
            <h5>✅ Completed</h5>
            <p className="fs-5">{tasks.filter(t => t.completed).length} done</p>
          </div>
        </div>
      </div>

      {/* Sorting */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label fw-bold">Sort by:</label>
          <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Date</option>
            <option value="done">Done Status</option>
          </select>
        </div>
      </div>

      {/* Add Task Form */}
      <div className="card border-0 shadow-sm p-4 mb-5">
        <h4 className="mb-3 text-dark">📝 Add a New Task</h4>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Deadline</label>
              <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Category/Tag</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} className="form-control" />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Description (optional)</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows={2} />
            </div>
          </div>
          <div className="mt-4 text-end">
            <button type="submit" className="btn btn-success px-4">➕ Add Task</button>
          </div>
        </form>
      </div>

      {/* Task List */}
      <div className="mb-5">
        <h5 className="fw-bold mb-3">🗂 Your Tasks</h5>
        {sortedTasks.length === 0 ? (
          <p className="text-muted">No tasks added yet.</p>
        ) : (
          sortedTasks.map(task => (
            <div
              key={task.id}
              className={`card mb-3 p-3 shadow-sm border-start border-4 ${task.completed ? 'border-success bg-light' : 'border-primary'}`}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-1 fw-semibold" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                    {task.title} <span className="badge bg-info ms-2">{task.category}</span>
                  </h6>
                  {task.description && (
                    <p className="mb-1 text-muted" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                      {task.description}
                    </p>
                  )}
                  <small className="text-muted">📅 Deadline: {task.deadline}</small>
                </div>
                <div className="d-flex flex-column align-items-end">
                  <button
                    className={`btn btn-sm mb-2 ${task.completed ? 'btn-warning' : 'btn-success'}`}
                    onClick={() => toggleComplete(task.id)}
                  >
                    {task.completed ? 'Undo' : 'Done'}
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(task.id)}
                  >
                    🗑 Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pomodoro Timer */}
      <div className="card p-4 shadow-sm border-0 text-center">
        <h4 className="mb-3 text-danger">🍅 Pomodoro Timer</h4>
        <h2 className="display-4">{formatTime(seconds)}</h2>
        <div className="mt-3">
          <button className="btn btn-outline-success me-2" onClick={handleStart} disabled={isRunning}>▶️ Start</button>
          <button className="btn btn-outline-warning me-2" onClick={handlePause} disabled={!isRunning}>⏸ Pause</button>
          <button className="btn btn-outline-danger" onClick={handleReset}>🔄 Reset</button>
        </div>
        <p className="text-muted mt-2">
          Stay focused for 25 minutes, then take a short break.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
