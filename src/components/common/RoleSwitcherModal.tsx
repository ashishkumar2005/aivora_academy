import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  GraduationCap,
  KeyRound,
  Check,
  UserPlus,
  ArrowRight,
} from 'lucide-react';
import { useAuth, ADMIN_DEFAULT_PIN } from '../../lib/authContext';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  onOpenRegister,
}) => {
  const { role, currentStudent, allStudents, switchStudent, loginAsAdmin, exitAdmin } = useAuth();
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState(false);

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAsAdmin(adminPin);
    if (success) {
      setPinError(false);
      setAdminPin('');
      onClose();
    } else {
      setPinError(true);
    }
  };

  const handleSelectStudent = (id: string) => {
    if (role === 'ADMIN') {
      exitAdmin();
    }
    switchStudent(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Switch Profile & Portal</h3>
            <p className="text-xs text-slate-500">
              Current Mode: <strong className="text-indigo-600">{role === 'ADMIN' ? 'Admin Portal' : 'Student Portal'}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Admin Access Section */}
          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 space-y-3">
            <div className="flex items-center gap-2.5 text-indigo-950 font-semibold text-sm">
              <ShieldAlert className="w-4 h-4 text-indigo-600" />
              <span>Admin Management Portal</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full control over the 7 curriculum units, video streaming uploads, CBSE sample papers, revision PDFs, quizzes, and student rosters.
            </p>

            {role === 'ADMIN' ? (
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-indigo-200">
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Currently Authenticated as Admin
                </span>
                <button
                  onClick={() => {
                    exitAdmin();
                    onClose();
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  Exit to Student Mode
                </button>
              </div>
            ) : (
              <form onSubmit={handleAdminLogin} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={adminPin}
                      onChange={(e) => {
                        setAdminPin(e.target.value);
                        setPinError(false);
                      }}
                      placeholder={`Enter Admin Passcode (Hint: ${ADMIN_DEFAULT_PIN})`}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-xs"
                  >
                    Enter Admin
                  </button>
                </div>
                {pinError && (
                  <p className="text-[11px] text-rose-600 font-medium">
                    Incorrect PIN. Default demo passcode is <code>{ADMIN_DEFAULT_PIN}</code>.
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Student Profiles Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-slate-500" />
                Select Student Profile
              </span>
              <button
                onClick={() => {
                  onClose();
                  onOpenRegister();
                }}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register New</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {allStudents.map((std) => {
                const isSelected = role === 'STUDENT' && currentStudent?.id === std.id;
                return (
                  <button
                    key={std.id}
                    onClick={() => handleSelectStudent(std.id)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0 overflow-hidden">
                      {std.avatarUrl ? (
                        <img src={std.avatarUrl} alt={std.fullName} className="w-full h-full object-cover" />
                      ) : (
                        std.fullName[0]
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {std.fullName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        Roll {std.rollNumber} · Class {std.classNumber}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>AI Learning Hub · Class 10 Portal</span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
