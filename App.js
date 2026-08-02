import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/plans/';

function App() {
  const [plans, setPlans] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(API_URL);
      setPlans(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addPlan = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const response = await axios.post(API_URL, { title, completed: false });
      setPlans([response.data, ...plans]);
      setTitle('');
    } catch (error) {
      console.error(error);
    }
  };

  const toggleComplete = async (plan) => {
    try {
      const response = await axios.patch(`${API_URL}${plan.id}/`, {
        completed: !plan.completed,
      });
      setPlans(plans.map((p) => (p.id === plan.id ? response.data : p)));
    } catch (error) {
      console.error(error);
    }
  };

  const deletePlan = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      setPlans(plans.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Plan Manager</h1>
      <form onSubmit={addPlan} className="input-group">
        <input
          type="text"
          placeholder="Add a plan..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {plans.map((plan) => (
          <li key={plan.id} className={plan.completed ? 'completed' : ''}>
            <span onClick={() => toggleComplete(plan)} style={{ cursor: 'pointer' }}>
              {plan.title}
            </span>
            <button onClick={() => deletePlan(plan.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
