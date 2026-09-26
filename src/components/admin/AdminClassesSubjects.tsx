import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  CheckCircle,
  FolderTree,
  BookOpen,
  Sparkles,
  Layers,
} from 'lucide-react';
import { DataService } from '../../lib/storage';
import { ClassLevel, Subject } from '../../types';

export const AdminClassesSubjects: React.FC = () => {
  const [classes, setClasses] = useState<ClassLevel[]>(DataService.getClasses());
  const [subjects, setSubjects] = useState<Subject[]>(DataService.getSubjects());

  const [newClassName, setNewClassName] = useState('');
  const [newClassLevel, setNewClassLevel] = useState(11);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectClass, setNewSubjectClass] = useState('class-10');

  const handleToggleClass = (classId: string) => {
    const updated = classes.map((c) =>
      c.id === classId ? { ...c, isActive: !c.isActive } : c
    );
    setClasses(updated);
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const newClass: ClassLevel = {
      id: `class-${newClassLevel}`,
      name: newClassName.trim(),
      numericLevel: Number(newClassLevel),
      isActive: true,
    };
    const updated = [...classes, newClass].sort((a, b) => a.numericLevel - b.numericLevel);
    setClasses(updated);
    setNewClassName('');
    setNewClassLevel(newClassLevel + 1);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim() || !newSubjectCode.trim()) return;

    const newSub: Subject = {
      id: `sub-${newSubjectCode.toLowerCase()}-${Date.now()}`,
      classId: newSubjectClass,
      code: newSubjectCode.trim(),
      name: newSubjectName.trim(),
      icon: 'BookOpen',
      description: 'Newly provisioned curriculum subject.',
    };
    setSubjects([...subjects, newSub]);
    setNewSubjectName('');
    setNewSubjectCode('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3 border border-indigo-100">
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span>Multi-Grade Architecture</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Classes & Subjects Configuration
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
            The platform is built on an extensible data model supporting <strong>Class 6 through Class 10</strong> and multiple vocational subjects.
          </p>
        </div>
      </div>

      {/* Grid: Classes & Subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classes Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-indigo-600" />
              <span>Configured Classes (6–10)</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">{classes.length} Tiers</span>
          </div>

          <div className="space-y-2">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors"
              >
                <div>
                  <span className="font-bold text-slate-900 text-sm">{cls.name}</span>
                  <span className="text-slate-400 text-[11px] ml-2 font-mono">
                    Grade {cls.numericLevel}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      cls.isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cls.isActive ? 'Active Syllabus' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => handleToggleClass(cls.id)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer font-medium ml-1"
                  >
                    Toggle
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Add Class */}
          <form onSubmit={handleAddClass} className="pt-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="e.g. Class 11"
              className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
            >
              Add Class
            </button>
          </form>
        </div>

        {/* Subjects Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Configured Subjects</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">{subjects.length} Subjects</span>
          </div>

          <div className="space-y-2">
            {subjects.map((sub) => {
              const assignedClass = classes.find((c) => c.id === sub.classId);
              return (
                <div
                  key={sub.id}
                  className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-slate-900 text-sm">{sub.name}</span>
                    <span className="text-indigo-600 font-mono text-xs ml-2 font-bold">
                      Code {sub.code}
                    </span>
                    <p className="text-slate-500 text-[11px] truncate mt-0.5">
                      {sub.description}
                    </p>
                  </div>
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-mono shrink-0">
                    {assignedClass?.name || 'Class 10'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Add Subject */}
          <form onSubmit={handleAddSubject} className="pt-3 border-t border-slate-100 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Subject Name (e.g. Robotics)"
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
              <input
                type="text"
                value={newSubjectCode}
                onChange={(e) => setNewSubjectCode(e.target.value)}
                placeholder="CBSE Code (e.g. 418)"
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-1.5 rounded-lg cursor-pointer"
            >
              Add New Subject
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
