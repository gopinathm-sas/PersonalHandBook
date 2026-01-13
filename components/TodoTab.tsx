import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2,
  Target
} from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const TodoTab: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('persona_todos');
    if (saved) setTodos(JSON.parse(saved));
    else setTodos([{ id: '1', text: 'Morning mindfulness session', completed: false }]);
  }, []);

  useEffect(() => {
    localStorage.setItem('persona_todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    const todo: Todo = { id: Date.now().toString(), text: newText, completed: false };
    setTodos([todo, ...todos]);
    setNewText('');
    setIsAdding(false);
  };

  return (
    <div className="p-6 animate-in slide-in-from-left duration-500 min-h-full bg-[#F0F7F4]">
      <header className="flex justify-between items-center mb-8 pt-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Goals</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Focus & Progress</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`p-3 rounded-full shadow-lg transition-all ${isAdding ? 'bg-slate-900 text-white rotate-45' : 'bg-[#38BDF8] text-white'}`}
        >
          <Plus size={24} />
        </button>
      </header>

      {isAdding && (
        <form onSubmit={handleAddTodo} className="mb-8 bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl animate-in zoom-in-95">
          <input 
            autoFocus
            type="text" 
            placeholder="What's next?" 
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-sky-100"
            value={newText}
            onChange={e => setNewText(e.target.value)}
          />
          <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl tracking-widest uppercase text-xs mt-4">Add Goal</button>
        </form>
      )}

      <div className="space-y-4 pb-32">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Daily Objectives</h3>
        {todos.map(todo => (
          <div 
            key={todo.id} 
            className={`glass-card p-5 rounded-[30px] transition-all flex items-center gap-4 ${
              todo.completed ? 'opacity-50' : ''
            }`}
          >
            <button 
              onClick={() => setTodos(todos.map(t => t.id === todo.id ? {...t, completed: !t.completed} : t))}
              className={`shrink-0 transition-colors ${todo.completed ? 'text-sky-500' : 'text-slate-200'}`}
            >
              {todo.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
            </button>
            <span className={`flex-1 font-bold text-sm ${todo.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
              {todo.text}
            </span>
            <button 
              onClick={() => setTodos(todos.filter(t => t.id !== todo.id))}
              className="p-2 text-slate-200 hover:text-red-400 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {todos.length === 0 && (
          <div className="text-center py-20">
             <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-50">
                <Target className="text-slate-200" size={32} />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">All caught up</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoTab;