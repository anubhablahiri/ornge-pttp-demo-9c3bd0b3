import { useNavigate } from 'react-router-dom';

export default function V1Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)] flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-white mb-2">
          Family Portal<span className="text-[hsl(22,90%,54%)]">.</span>
        </h1>
        <p className="text-sm text-[hsl(215,20%,65%)] mb-10">Version 1</p>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/v1/family')}
            className="w-full py-4 bg-[hsl(220,20%,14%)] border border-[hsl(220,14%,20%)] hover:border-[hsl(22,90%,54%)] rounded-xl text-white font-semibold text-lg transition-colors"
          >
            Family Portal
          </button>
          <button
            onClick={() => navigate('/v1/admin')}
            className="w-full py-4 bg-[hsl(220,20%,14%)] border border-[hsl(220,14%,20%)] hover:border-[hsl(212,80%,60%)] rounded-xl text-white font-semibold text-lg transition-colors"
          >
            Admin Portal
          </button>
        </div>

          <button
            onClick={() => navigate('/')}
            className="mt-8 text-sm text-[hsl(215,20%,55%)] hover:text-white transition-colors"
          >
            ← Back to Version Selection
          </button>
      </div>
    </div>
  );
}
