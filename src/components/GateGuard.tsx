import { Navigate } from 'react-router-dom';

export default function GateGuard({ children }: { children: React.ReactNode }) {
  if (sessionStorage.getItem('gate_authenticated') !== 'true') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
