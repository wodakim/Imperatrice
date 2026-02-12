import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect('/login');

  // Check Role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    // Client-side bypass check for "Wodadmin" not possible in Server Component easily without client hydration
    // For now, strict RLS. If we want demo bypass, we'd do it client side.
    return redirect('/dashboard');
  }

  // Fetch Stats
  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: premiumUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_premium', true);

  // Calculate Average Spoons (Need full fetch or RPC)
  const { data: allProfiles } = await supabase.from('profiles').select('spoons');
  const avgSpoons = allProfiles
    ? (allProfiles.reduce((acc, curr) => acc + (curr.spoons || 0), 0) / allProfiles.length).toFixed(1)
    : 0;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[var(--color-primary-dark)] mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Utilisateurs" value={totalUsers || 0} icon="👥" />
        <StatCard title="Premium" value={premiumUsers || 0} icon="💎" />
        <StatCard title="Moy. Cuillères" value={avgSpoons} icon="🥄" />
      </div>

      <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-lg)] shadow-sm">
        <h2 className="text-xl font-bold mb-4">Actions Rapides</h2>
        <p className="text-[var(--color-text-muted)]">Fonctionnalités de gestion à venir.</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: string }) {
  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-lg)] shadow-sm flex items-center gap-4">
      <div className="text-4xl">{icon}</div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-[var(--color-text-muted)] uppercase">{title}</div>
      </div>
    </div>
  );
}
