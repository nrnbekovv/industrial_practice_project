import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Trash2, CheckCircle, Circle, Plus, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';

const Dashboard = ({ darkMode, setDarkMode }) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(() => localStorage.getItem('recentSearch') || '');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [taskForm, setTaskForm] = useState({ title: '', description: '', category: '' });
  const [catForm, setCatForm] = useState({ title: '', description: 'Default description' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    localStorage.setItem('recentSearch', search);
    fetchTasks();
  }, [search, statusFilter, page]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks?search=${search}&status=${statusFilter}&page=${page}&limit=5`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(data.tasks);
        setTotalPages(data.pages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCategories(data);
        if (data.length > 0) setTaskForm(prev => ({ ...prev, category: data[0]._id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!catForm.title) return;
    try {
      const res = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(catForm)
      });
      if (res.ok) {
        const newCat = await res.json();
        setCategories([...categories, newCat]);
        setTaskForm(prev => ({ ...prev, category: newCat._id }));
        setCatForm({ title: '', description: 'Default description' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title || !taskForm.category) return;
    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(taskForm)
      });
      if (res.ok) {
        setTaskForm({ title: '', description: '', category: categories[0]?._id || '' });
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Plus size={18}/> Create Category</h2>
            <form onSubmit={handleCreateCategory} className="space-y-3">
              <input
                type="text"
                placeholder="Category Title (e.g., Work)"
                value={catForm.title}
                onChange={e => setCatForm({ ...catForm, title: e.target.value })}
                className="w-full p-2 text-sm border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 outline-none"
              />
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded transition">
                Add Category
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Plus size={18}/> Create Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <input
                type="text"
                placeholder="Task Title"
                value={taskForm.title}
                onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                className="w-full p-2 text-sm border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 outline-none"
              />
              <textarea
                placeholder="Description"
                value={taskForm.description}
                onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                className="w-full p-2 text-sm border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 outline-none h-20 resize-none"
              />
              <select
                value={taskForm.category}
                onChange={e => setTaskForm({ ...taskForm, category: e.target.value })}
                className="w-full p-2 text-sm border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 outline-none"
              >
                {categories.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select>
              <button type="submit" disabled={categories.length === 0} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium py-2 rounded transition">
                Add Task
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2 text-sm border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Filter size={18} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                className="p-2 text-sm border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 outline-none"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {tasks.length > 0 ? (
              tasks.map(task => (
                <div key={task._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between transition hover:shadow-md">
                  <div className="flex items-start gap-3">
                    <button onClick={() => handleToggleStatus(task._id, task.status)} className="mt-1 text-gray-400 hover:text-blue-500 transition">
                      {task.status === 'completed' ? <CheckCircle className="text-green-500" size={20} /> : <Circle size={20} />}
                    </button>
                    <div>
                      <h3 className={`font-semibold ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>{task.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{task.description}</p>
                      <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded mt-2 font-medium">
                        {task.category?.title || 'No category'}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteTask(task._id)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">No tasks found. Create a category and add your first task!</div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 border rounded bg-white dark:bg-gray-800 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700">
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium">Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 border rounded bg-white dark:bg-gray-800 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700">
                <ChevronRight size={16} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;