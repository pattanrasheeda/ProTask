import React from 'react';

const TaskList = ({ tasks }) => {
  return (
    <div className="mt-4">
      <h5>Your Tasks</h5>
      {tasks.length === 0 && <p className="text-muted">No tasks added yet.</p>}
      {tasks.map((task, index) => (
        <div key={index} className="card mb-2 shadow-sm">
          <div className="card-body">
            <h6>{task.title}</h6>
            <p>{task.description}</p>
            <p className="text-muted small">Deadline: {task.deadline}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;