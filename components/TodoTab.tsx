import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  ListTodo, 
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
  createdAt: string;
}

interface RegularTask {
  id: string;
  text: string;
  isActive: boolean;
}

const TodoTab: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [regularTasks, setRegularTasks] = useState<RegularTask[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [showRoutinePrompt, setShowRoutinePrompt] = useState(true);
  const [newText, setNewText] = useState('');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [addingRegular, setAddingRegular] = useState(false);

  useEffect(() => {
    const savedTodos = localStorage.getItem('persona_todos');
    const savedRegular = localStorage.getItem('persona_regular_tasks');
    
    if (savedTodos) setTodos(JSON.parse(savedTodos));
    else setTodos([
      { id: '1', text: 'Review weekly budget', completed: false, priority: 'High', createdAt: new Date().toISOString() },
    ]);

    if (savedRegular) setRegularTasks(JSON.parse(savedRegular));
    else setRegularTasks([
      { id: 'r1', text: 'Drink 2L Water', isActive: true },
      { id: 'r2', text: 'Morning Meditation', isActive: false },
    ]);
  }, []);

  useEffect(() => {
    localStorage.setItem('persona_todos', JSON.stringify(todos));
    localStorage.setItem('persona_regular_tasks', JSON.stringify(regularTasks));
  }, [todos, regularTasks]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percent };
  }, [todos]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    
    if (addingRegular) {
      const task: RegularTask = {
        id: `reg-${Date.now()}`,
        text: newText,
        isActive: true
      };
      setRegularTasks(prev => [task, ...prev]);
    } else {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newText,
        completed: false,
        priority: newPriority,
        createdAt: new Date().toISOString()
      };
      setTodos(prev => [todo, ...prev]);
    }

    setNewText('');
    setIsAdding(false);
    setAddingRegular(false);
  };

  const toggleRegular = (id: string) => {
    setRegularTasks(prev => prev.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ));
  };

  const deleteRegular = (id: string) => {
    setRegularTasks(prev => prev.filter(t => t.id !== id));
  };

  const priorityColors = {
    High: 'bg-red-50 text-red-600',
    Medium: 'bg-blue-50 text-blue-600',
    Low: 'bg-gray-50 text-gray-600'
  };

  return (
    <div className="p-6 animate-in slide-in-from-left duration-500 min-h-full">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">To Do's</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Focus & Execute</p>
        </div>
        <button 
          onClick={() => {
            setAddingRegular(false);
            setIsAdding(!isAdding);
          }}
          className={`p-3 rounded-full shadow-lg transition-all ${isAdding ? 'bg-gray-900 text-white rotate-45' : 'bg-[#D9F99D] text-gray-900'}`}
        >
          <Plus size={24} />
        </button>
      </header>

      {/* Routine Prompt */}
      {showRoutinePrompt && regularTasks.length < 5 && (
        <div className="mb-6 bg-[#1A1A1A] text-white p-5 rounded-[32px] shadow-2xl animate-in zoom-in duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <button onClick={() => setShowRoutinePrompt(false)} className="text-white/40 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-[#D9F99D] p-3 rounded-2xl shrink-0">
              <Sparkles size={20} className="text-black" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-[#D9F99D] tracking-widest mb-1">Routine Setup</p>
              <p className="text-sm font-bold text-gray-200 mb-3">Any tasks you do regularly? Let's add them as reminders.</p>
              <button 
                onClick={() => {
                  setAddingRegular(true);
                  setIsAdding(true);
                  setShowRoutinePrompt(false);
                }}
                className="bg-white text-black text-[10px] font-black py-2.5 px-6 rounded-xl uppercase tracking-wider active:scale-95 transition-all"
              >
                Add Regular Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Regular Tasks Section */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4 px-2">
          <Repeat size={14} className="text-gray-400" />
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Regular Routine</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {regularTasks.map(task => (
            <div 
              key={task.id} 
              className={`flex-none w-48 p-4 rounded-3xl border transition-all duration-300 ${
                task.isActive ? 'bg-white border-[#D9F99D] shadow-sm' : 'bg-gray-50 border-transparent opacity-60'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <button 
                  onClick={() => toggleRegular(task.id)}
                  className={`transition-colors ${task.isActive ? 'text-lime-500' : 'text-gray-300'}`}
                >
                  {task.isActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
                <button onClick={() => deleteRegular(task.id)} className="text-gray-300 hover:text-red-400">
                  <X size={14} />
                </button>
              </div>
              <p className={`text-xs font-black uppercase tracking-tight ${task.isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                {task.text}
              </p>
            </div>
          ))}
          <button 
            onClick={() => {
              setAddingRegular(true);
              setIsAdding(true);
            }}
            className="flex-none w-14 h-24 rounded-3xl border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </section>

      {/* Progress Card */}
      <section className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-lime-50 rounded-xl">
              <ListTodo size={18} className="text-lime-600" />
            </div>
            <h3 className="font-bold text-gray-900">Today's Pulse</h3>
          </div>
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{stats.percent}% Done</span>
        </div>
        <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-[#D9F99D] transition-all duration-1000 ease-out" 
            style={{ width: `${stats.percent}%` }}
          />
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter italic">
          {stats.completed} of {stats.total} goals achieved
        </p>
      </section>

      {isAdding && (
        <form onSubmit={handleAddTodo} className="mb-8 bg-white p-6 rounded-[32px] border border-gray-100 shadow-xl animate-in zoom-in-95 duration-300">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${addingRegular ? 'bg-[#D9F99D] text-black' : 'bg-gray-100 text-gray-400'}`}>
                {addingRegular ? 'Recurring Task' : 'Daily Goal'}
              </span>
            </div>
            <input 
              autoFocus
              type="text" 
              placeholder={addingRegular ? "e.g. Morning Yoga" : "What needs to be done?"} 
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold outline-none"
              value={newText}
              onChange={e => setNewText(e.target.value)}
            />
            {!addingRegular && (
              <div className="flex gap-2">
                {(['Low', 'Medium', 'High'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNewPriority(p)}
                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl border transition-all ${
                      newPriority === p ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-400 border-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
            <button type="submit" className="w-full bg-[#D9F99D] text-gray-900 font-black py-4 rounded-2xl tracking-widest uppercase text-xs">
              {addingRegular ? 'Save Routine Task' : 'Add Goal'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setIsAdding(false);
                setAddingRegular(false);
              }}
              className="w-full text-gray-400 font-bold text-[10px] uppercase py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Daily Tasks</h3>
        {todos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <ListTodo className="text-gray-200" size={32} />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Clear for landing</p>
          </div>
        ) : (
          todos.map(todo => (
            <div 
              key={todo.id} 
              className={`group bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-4 transition-all ${
                todo.completed ? 'opacity-60 grayscale' : 'hover:border-[#D9F99D]'
              }`}
            >
              <button 
                onClick={() => setTodos(prev => prev.map(t => t.id === todo.id ? {...t, completed: !t.completed} : t))}
                className={`shrink-0 transition-transform active:scale-90 ${todo.completed ? 'text-lime-500' : 'text-gray-200'}`}
              >
                {todo.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
              </button>
              
              <div className="flex-1 min-w-0">
                <span className={`block font-bold text-sm transition-all ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                  {todo.text}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${priorityColors[todo.priority]}`}>
                    {todo.priority}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setTodos(prev => prev.filter(t => t.id !== todo.id))}
                className="p-2 text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoTab;