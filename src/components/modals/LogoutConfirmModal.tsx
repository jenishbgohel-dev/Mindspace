import React from 'react';
import { LogOut, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmedLogout?: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmedLogout,
}) => {
  const { currentUser, logout } = useAuth();

  if (!isOpen) return null;

  const handleConfirmLogout = () => {
    logout();
    if (onConfirmedLogout) {
      onConfirmedLogout();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-4">
          <LogOut className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-1">
          Log Out of MindSpace?
        </h3>

        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          {currentUser
            ? `You are signed in as ${currentUser.name}. Your active goals, habits, and tasks will remain saved in this browser.`
            : 'You are currently browsing as a guest.'}
        </p>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmLogout}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};
