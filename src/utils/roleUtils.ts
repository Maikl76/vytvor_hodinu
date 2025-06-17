import { RoleType } from '@/types/supabase';

export const roleOptions = [
  { value: 'attacker', label: 'Útočník' },
  { value: 'defender', label: 'Obránce' },
  { value: 'goalkeeper', label: 'Brankář' },
  { value: 'coach', label: 'Trenér' },
  { value: 'spectator', label: 'Divák' },
  { value: 'judge', label: 'Rozhodčí' },
  { value: 'first-aid', label: 'Zdravotník' },
  { value: 'other', label: 'Jiná' },
];

export const mapRoleToCzech = (role: string) => {
  const roleMap: { [key: string]: string } = {
    'attacker': 'Útočník',
    'defender': 'Obránce',
    'goalkeeper': 'Brankář',
    'coach': 'Trenér',
    'spectator': 'Divák',
    'judge': 'Rozhodčí',
    'first-aid': 'Zdravotník',
    'other': 'Jiná',
  };
  return roleMap[role] || 'Neznámá role';
};

export const mapCzechToRole = (czechRole: string) => {
  const roleMap: { [key: string]: string } = {
    'Útočník': 'attacker',
    'Obránce': 'defender',
    'Brankář': 'goalkeeper',
    'Trenér': 'coach',
    'Divák': 'spectator',
    'Rozhodčí': 'judge',
    'Zdravotník': 'first-aid',
    'Jiná': 'other',
  };
  return roleMap[czechRole] || 'other';
};

export const getRoleName = (roleId: number, roles: RoleType[]): string => {
  const role = roles.find((r) => r.id === roleId);
  return role ? role.name || 'Neznámá role' : 'Neznámá role';
};
