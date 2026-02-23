import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users } from 'lucide-react';
import AdminAccountManagement from '@/components/admin/AdminAccountManagement';

const ALLOWED_USERS = [
  'arlan.nugara@ornge.ca',
  'arlan.nugara@calian.com',
  'arlan.nugara@alvarnet.ca',
];

export default function AccountManagement() {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const gateUser = sessionStorage.getItem('gate_username') || '';
    if (
      sessionStorage.getItem('gate_authenticated') !== 'true' ||
      !ALLOWED_USERS.includes(gateUser)
    ) {
      window.location.href = '/';
      return;
    }
    setAuthorized(true);
  }, []);

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <motion.div
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Account Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage administrator accounts and permissions
            </p>
          </div>
        </div>

        <AdminAccountManagement />

        <Link
          to="/versions"
          className="flex items-center gap-1.5 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Prototype Versions
        </Link>
      </motion.div>
    </div>
  );
}
