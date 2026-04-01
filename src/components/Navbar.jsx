import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Navbar() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav
      className="fixed top-0 right-0 left-0 z-1000 flex items-center justify-between px-5 py-3"
      style={{
        background: 'rgba(10, 14, 23, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 212, 255, 0.08)',
      }}
    >
      <button
        onClick={() => navigate('/')}
        className="group flex cursor-pointer items-center gap-2.5"
      >
        <div
          className="flex h-9 w-9 items-center justify-center rounded-md text-lg font-black"
          style={{
            background: 'linear-gradient(135deg, #00d4ff, #ff2d95)',
            color: '#0a0e17',
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.25)',
          }}
        >
          M
        </div>
        <div className="flex flex-col">
          <span className="text-lg leading-none font-black tracking-tight">
            <span style={{ color: '#00d4ff' }}>Mind</span>
            <span style={{ color: '#ff2d95' }}>Dump</span>
          </span>
          <span className="mt-0.5 text-[10px] leading-none tracking-widest text-gray-400 uppercase">
            let it out
          </span>
        </div>
      </button>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <div
              className="flex items-center gap-2 rounded-md px-3 py-1.5"
              style={{
                background: 'rgba(0, 212, 255, 0.05)',
                border: '1px solid rgba(0, 212, 255, 0.1)',
              }}
            >
              <img
                src={user.user_metadata?.avatar_url}
                alt={user.user_metadata?.full_name}
                className="h-6 w-6 rounded-full"
              />
              <span className="hidden text-sm text-gray-300 sm:inline">
                {user.user_metadata?.full_name}
              </span>
            </div>
            <button
              onClick={signOut}
              className="cursor-pointer rounded-md px-3 py-1.5 text-sm transition-all duration-200 hover:bg-[#ff453a10] hover:text-[#ff453a]"
              style={{
                border: '1px solid rgba(0, 212, 255, 0.06)',
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="flex cursor-pointer items-center gap-2 rounded-md px-5 py-2 text-sm font-semibold transition-all duration-200 hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #bf5af2)',
              color: '#0a0e17',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)',
            }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#0a0e17"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#0a0e17"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#0a0e17"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#0a0e17"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}
