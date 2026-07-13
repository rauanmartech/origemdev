import React, { useState, useEffect, createContext, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import OSSidebar from './OSSidebar';

interface OSContextType {
  userId: string;
  userEmail: string;
}

const OSContext = createContext<OSContextType>({ userId: '', userEmail: '' });
export const useOSContext = () => useContext(OSContext);

const OSLayout: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      const isAdmin =
        user.email === 'rauanrocha.martech@gmail.com' || profile?.role === 'admin';

      if (!isAdmin) { navigate('/admin'); return; }

      setUserId(user.id);
      setUserEmail(user.email ?? '');
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center" style={{ background: '#0D0D0D' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'hsl(25 95% 53%)' }}>
            <span className="text-white font-bold text-lg">OS</span>
          </div>
          <Loader2 className="animate-spin text-orange-500" size={24} />
        </div>
      </div>
    );
  }

  return (
    <OSContext.Provider value={{ userId, userEmail }}>
      <div className="flex h-screen overflow-hidden" style={{ background: '#111111' }}>
        {/* Backdrop mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <OSSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userEmail={userEmail}
          onToggle={() => setSidebarOpen(o => !o)}
        />

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile top bar */}
          <div
            className="lg:hidden flex items-center gap-3 px-4 py-3 border-b z-20 flex-shrink-0"
            style={{ background: '#161616', borderColor: '#2a2a2a' }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: '#222' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'hsl(25 95% 53%)' }}>
                OS
              </div>
              <span className="text-white font-semibold text-sm">ORIGIN OS</span>
            </div>
          </div>

          {/* Page content */}
          <div className="flex-1 overflow-y-auto" style={{ background: '#111111' }}>
            <React.Suspense
              fallback={
                <div className="h-full w-full flex items-center justify-center">
                  <Loader2 className="animate-spin text-orange-500" size={24} />
                </div>
              }
            >
              <Outlet context={{ userId, userEmail }} />
            </React.Suspense>
          </div>
        </main>
      </div>
    </OSContext.Provider>
  );
};

export default OSLayout;
