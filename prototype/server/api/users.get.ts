import { defineEventHandler } from 'h3'

const ROLES = ['Dispatcher', 'Checker', 'Admin'] as const
const STATUSES = ['Active', 'Inactive'] as const

function ts(daysAgo: number, hoursAgo = 0) {
    const d = new Date('2026-02-19T20:20:00+07:00')
    d.setDate(d.getDate() - daysAgo)
    d.setHours(d.getHours() - hoursAgo)
    return d.toISOString()
}

const users = [
    { id: 'USR-001', name: 'Andi Wirawan', email: 'andi.wirawan@ptba.co.id', role: 'Admin', status: 'Active', last_seen: ts(0, 0) },
    { id: 'USR-002', name: 'Siti Rahayu', email: 'siti.rahayu@ptba.co.id', role: 'Dispatcher', status: 'Active', last_seen: ts(0, 1) },
    { id: 'USR-003', name: 'Budi Santoso', email: 'budi.santoso@ptba.co.id', role: 'Dispatcher', status: 'Active', last_seen: ts(0, 2) },
    { id: 'USR-004', name: 'Dewi Kurniawati', email: 'dewi.kurniawati@ptba.co.id', role: 'Checker', status: 'Active', last_seen: ts(0, 3) },
    { id: 'USR-005', name: 'Eko Prasetyo', email: 'eko.prasetyo@ptba.co.id', role: 'Checker', status: 'Active', last_seen: ts(0, 4) },
    { id: 'USR-006', name: 'Fitri Handayani', email: 'fitri.handayani@ptba.co.id', role: 'Checker', status: 'Active', last_seen: ts(1, 0) },
    { id: 'USR-007', name: 'Gunawan Susilo', email: 'gunawan.susilo@ptba.co.id', role: 'Dispatcher', status: 'Active', last_seen: ts(1, 2) },
    { id: 'USR-008', name: 'Hesti Wulandari', email: 'hesti.wulandari@ptba.co.id', role: 'Dispatcher', status: 'Active', last_seen: ts(1, 5) },
    { id: 'USR-009', name: 'Irwan Maulana', email: 'irwan.maulana@ptba.co.id', role: 'Checker', status: 'Inactive', last_seen: ts(3, 0) },
    { id: 'USR-010', name: 'Joko Widodo', email: 'joko.widodo@ptba.co.id', role: 'Dispatcher', status: 'Active', last_seen: ts(0, 6) },
    { id: 'USR-011', name: 'Kartika Sari', email: 'kartika.sari@ptba.co.id', role: 'Checker', status: 'Active', last_seen: ts(2, 0) },
    { id: 'USR-012', name: 'Lukman Hakim', email: 'lukman.hakim@ptba.co.id', role: 'Dispatcher', status: 'Inactive', last_seen: ts(7, 0) },
    { id: 'USR-013', name: 'Maya Indriati', email: 'maya.indriati@ptba.co.id', role: 'Checker', status: 'Active', last_seen: ts(0, 8) },
    { id: 'USR-014', name: 'Nurul Hidayah', email: 'nurul.hidayah@ptba.co.id', role: 'Admin', status: 'Active', last_seen: ts(1, 1) },
    { id: 'USR-015', name: 'Okta Permana', email: 'okta.permana@ptba.co.id', role: 'Dispatcher', status: 'Active', last_seen: ts(0, 9) },
    { id: 'USR-016', name: 'Putri Ayu', email: 'putri.ayu@ptba.co.id', role: 'Checker', status: 'Inactive', last_seen: ts(14, 0) },
    { id: 'USR-017', name: 'Rizki Fauzan', email: 'rizki.fauzan@ptba.co.id', role: 'Dispatcher', status: 'Active', last_seen: ts(0, 10) },
    { id: 'USR-018', name: 'Sri Wahyuni', email: 'sri.wahyuni@ptba.co.id', role: 'Checker', status: 'Active', last_seen: ts(2, 3) },
    { id: 'USR-019', name: 'Teguh Prasetya', email: 'teguh.prasetya@ptba.co.id', role: 'Dispatcher', status: 'Active', last_seen: ts(0, 11) },
    { id: 'USR-020', name: 'Umar Faruq', email: 'umar.faruq@ptba.co.id', role: 'Checker', status: 'Inactive', last_seen: ts(30, 0) },
    { id: 'USR-021', name: 'Vina Marlina', email: 'vina.marlina@ptba.co.id', role: 'Dispatcher', status: 'Active', last_seen: ts(3, 2) },
    { id: 'USR-022', name: 'Wahyu Setiawan', email: 'wahyu.setiawan@ptba.co.id', role: 'Admin', status: 'Active', last_seen: ts(0, 0) },
    { id: 'USR-023', name: 'Xenia Putri', email: 'xenia.putri@ptba.co.id', role: 'Checker', status: 'Active', last_seen: ts(4, 0) },
    { id: 'USR-024', name: 'Yusuf Ananta', email: 'yusuf.ananta@ptba.co.id', role: 'Dispatcher', status: 'Inactive', last_seen: ts(21, 0) },
    { id: 'USR-025', name: 'Zahra Nurfitri', email: 'zahra.nurfitri@ptba.co.id', role: 'Checker', status: 'Active', last_seen: ts(1, 3) },
]

export default defineEventHandler(() => {
    const total = users.length
    const active = users.filter(u => u.status === 'Active').length
    const inactive = users.filter(u => u.status === 'Inactive').length
    const byRole = {
        Admin: users.filter(u => u.role === 'Admin').length,
        Dispatcher: users.filter(u => u.role === 'Dispatcher').length,
        Checker: users.filter(u => u.role === 'Checker').length,
    }
    return { summary: { total, active, inactive, byRole }, users }
})
