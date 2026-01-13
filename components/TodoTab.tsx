import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Repeat,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  X 
} from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

const TodoTab: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('persona_todos');
    if (saved) setTodos(JSON.parse(saved));
    else setTodos([{ id: '1', text: 'Optimize morning routine', completed: false, priority: 'High' }]);
  }, []);

  useEffect(() => {
    localStorage.setItem('persona_todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    const todo: Todo = { id: Date.now().toString(), text: newText, completed: false, priority: 'Medium' };
    setTodos([todo, ...todos]);
    setNewText('');
    setIsAdding(false);
  };

  return (
    <div className="p-6 animate-in slide-in-from-left duration-500 min-h-full bg-black">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Goals</h1>
          <p className="text-white/40 font-bold uppercase text-[10px] tracking-widest mt-1">Focus & Execute</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`p-3 rounded-full shadow-lg transition-all ${isAdding ? 'bg-white text-black rotate-45' : 'bg-[#38BDF8] text-black'}`}
        >
          <Plus size={24} />
        </button>
      </header>

      {isAdding && (
        <form onSubmit={handleAddTodo} className="mb-8 bg-[#1A1A1A] p-6 rounded-[32px] border border-white/10 shadow-xl animate-in zoom-in-95">
          <input 
            autoFocus
            type="text" 
            placeholder="Next objective..." 
            className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none"
            value={newText}
            onChange={e => setNewText(e.target.value)}
          />
          <button type="submit" className="w-full bg-[#38BDF8] text-black font-black py-4 rounded-2xl tracking-widest uppercase text-xs mt-4">Add Task</button>
        </form>
      )}

      <div className="space-y-4 pb-20">
        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest px-2">Active Objectives</h3>
        {todos.map(todo => (
          <div 
            key={todo.id} 
            className={`group bg-[#1A1A1A]/60 ios-blur p-5 rounded-[32px] border transition-all ${
              todo.completed ? 'opacity-40 border-transparent' : 'border-white/5 hover:border-white/20'
            } flex items-center gap-4`}
          >
            <button 
              onClick={() => setTodos(todos.map(t => t.id === todo.id ? {...t, completed: !t.completed} : t))}
              className={`shrink-0 ${todo.completed ? 'text-[#38BDF8]' : 'text-white/20'}`}
            >
              {todo.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
            </button>
            <span className={`flex-1 font-bold text-sm ${todo.completed ? 'line-through' : 'text-white'}`}>
              {todo.text}
            </span>
            <button 
              onClick={() => setTodos(todos.filter(t => t.id !== todo.id))}
              className="p-2 text-white/10 hover:text-red-500 opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoTab;