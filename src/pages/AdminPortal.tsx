import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Plane, Truck, Activity, CheckCircle2, Clock, AlertTriangle,
  TrendingUp, Users, ArrowLeft, Calendar,
} from 'lucide-react';
import orngeLogo from '@/assets/ornge-logo.png';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminStatCard from '@/components/admin/AdminStatCard';
import AdminTransportChart from '@/components/admin/AdminTransportChart';
import AdminRecentTransports from '@/components/admin/AdminRecentTransports';
import AdminPerformanceMetrics from '@/components/admin/AdminPerformanceMetrics';
import AdminFleetStatus from '@/components/admin/AdminFleetStatus';
import AdminMapView from '@/components/admin/AdminMapView';
import AdminCrewScheduling from '@/components/admin/AdminCrewScheduling';

export default function AdminPortal() {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  const anim = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.35 },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-secondary text-secondary-foreground border-b border-border">
        <div className="max-w-[95vw] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-1.5 rounded-lg hover:bg-secondary/80 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <img src={orngeLogo} alt="Ornge" className="h-8 brightness-0 invert" />
            <div>
              <h1 className="font-display font-bold text-lg leading-tight">Operations Dashboard</h1>
              <p className="text-xs opacity-70">Ornge Transport Medicine</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm opacity-80">
            <Calendar className="h-4 w-4" />
            <span>{new Date().toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </header>

      <main className="max-w-[95vw] mx-auto px-6 py-6 space-y-6">
        {/* Stat cards */}
        <motion.div {...anim(0)} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <AdminStatCard icon={Activity} label="Live Transports" value="7" accent="primary" />
          <AdminStatCard icon={Plane} label="Air Active" value="4" accent="primary" />
          <AdminStatCard icon={Truck} label="Land Active" value="3" accent="primary" />
          <AdminStatCard icon={CheckCircle2} label="Completed Today" value="23" accent="success" />
          <AdminStatCard icon={Clock} label="Avg Response" value="14 min" accent="warning" />
          <AdminStatCard icon={AlertTriangle} label="Delays" value="2" accent="destructive" />
        </motion.div>

        {/* Live activities: Map + Recent Transports */}
        <motion.div {...anim(0.1)} className="grid lg:grid-cols-2 gap-4">
          <AdminMapView />
          <AdminRecentTransports />
        </motion.div>

        {/* Transport Analytics (below live activities) */}
        <motion.div {...anim(0.15)}>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-xl text-foreground">Transport Analytics</h2>
              <TabsList className="bg-muted">
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="weekly" className="mt-0">
              <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2"><AdminTransportChart period="weekly" /></div>
                <AdminPerformanceMetrics period="weekly" />
              </div>
            </TabsContent>
            <TabsContent value="monthly" className="mt-0">
              <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2"><AdminTransportChart period="monthly" /></div>
                <AdminPerformanceMetrics period="monthly" />
              </div>
            </TabsContent>
            <TabsContent value="yearly" className="mt-0">
              <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2"><AdminTransportChart period="yearly" /></div>
                <AdminPerformanceMetrics period="yearly" />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Crew Scheduling + Fleet Status */}
        <motion.div {...anim(0.25)} className="grid lg:grid-cols-2 gap-4">
          <AdminCrewScheduling />
          <AdminFleetStatus />
        </motion.div>
      </main>
    </div>
  );
}
