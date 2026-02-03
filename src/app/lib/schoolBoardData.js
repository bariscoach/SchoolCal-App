export const ONTARIO_HOLIDAYS_2025_2026 = [
    { title: 'Labour Day', date: '2025-09-01', description: 'Statutory Holiday', isHoliday: true },
    { title: 'Thanksgiving', date: '2025-10-13', description: 'Statutory Holiday', isHoliday: true },
    { title: 'Winter Break', date: '2025-12-22', description: 'Schools Closed', isHoliday: true },
    { title: 'Winter Break', date: '2025-12-23', description: 'Schools Closed', isHoliday: true },
    { title: 'Winter Break', date: '2025-12-24', description: 'Schools Closed', isHoliday: true },
    { title: 'Christmas Day', date: '2025-12-25', description: 'Statutory Holiday', isHoliday: true },
    { title: 'Boxing Day', date: '2025-12-26', description: 'Statutory Holiday', isHoliday: true },
    { title: 'Winter Break', date: '2025-12-29', description: 'Schools Closed', isHoliday: true },
    { title: 'Winter Break', date: '2025-12-30', description: 'Schools Closed', isHoliday: true },
    { title: 'Winter Break', date: '2025-12-31', description: 'Schools Closed', isHoliday: true },
    { title: 'New Years Day', date: '2026-01-01', description: 'Statutory Holiday', isHoliday: true },
    { title: 'Winter Break', date: '2026-01-02', description: 'Schools Closed', isHoliday: true },
    { title: 'Family Day', date: '2026-02-16', description: 'Statutory Holiday', isHoliday: true },
    { title: 'March Break', date: '2026-03-16', description: 'Schools Closed', isHoliday: true },
    { title: 'March Break', date: '2026-03-17', description: 'Schools Closed', isHoliday: true },
    { title: 'March Break', date: '2026-03-18', description: 'Schools Closed', isHoliday: true },
    { title: 'March Break', date: '2026-03-19', description: 'Schools Closed', isHoliday: true },
    { title: 'March Break', date: '2026-03-20', description: 'Schools Closed', isHoliday: true },
    { title: 'Good Friday', date: '2026-04-03', description: 'Statutory Holiday', isHoliday: true },
    { title: 'Easter Monday', date: '2026-04-06', description: 'Holiday', isHoliday: true },
    { title: 'Victoria Day', date: '2026-05-18', description: 'Statutory Holiday', isHoliday: true },
];

export const BOARD_SPECIFIC_DATA = {
    // Toronto
    'Toronto District School Board': {
        firstDay: '2025-09-02',
        lastDay: '2026-06-26',
        paDays: ['2025-09-26', '2025-10-10', '2025-11-14', '2026-01-16', '2026-02-13', '2026-06-05', '2026-06-26']
    },
    'Toronto Catholic District School Board': {
        firstDay: '2025-09-02',
        lastDay: '2026-06-26',
        paDays: ['2025-09-26', '2025-10-10', '2025-11-14', '2026-01-16', '2026-02-13', '2026-06-05', '2026-06-26']
    },

    // York
    'York Region District School Board': {
        firstDay: '2025-09-02',
        lastDay: '2026-06-25', // Elementary
        paDays: ['2025-09-26', '2025-10-24', '2025-11-21', '2026-01-16', '2026-01-30', '2026-06-05', '2026-06-26']
    },
    'York Catholic District School Board': {
        firstDay: '2025-09-02',
        lastDay: '2026-06-26',
        paDays: ['2025-09-26', '2025-10-24', '2025-11-21', '2026-01-16', '2026-01-30', '2026-06-05', '2026-06-26']
    },

    // Peel
    'Peel District School Board': {
        firstDay: '2025-09-02',
        lastDay: '2026-06-26',
        paDays: ['2025-09-19', '2025-10-10', '2025-11-28', '2026-01-19', '2026-02-13', '2026-05-15', '2026-06-08']
    },
    'Dufferin-Peel Catholic District School Board': {
        firstDay: '2025-09-02',
        lastDay: '2026-06-26',
        paDays: ['2025-09-19', '2025-10-10', '2025-11-28', '2026-01-19', '2026-02-13', '2026-05-15', '2026-06-08']
    },

    // Durham
    'Durham District School Board': {
        firstDay: '2025-09-02',
        lastDay: '2026-06-24',
        paDays: ['2025-10-20', '2025-11-14', '2026-01-23', '2026-02-13', '2026-04-17', '2026-06-05', '2026-06-26']
    },
    'Durham Catholic District School Board': {
        firstDay: '2025-09-02',
        lastDay: '2026-06-24',
        paDays: ['2025-10-20', '2025-11-14', '2026-01-23', '2026-02-13', '2026-04-17', '2026-06-05', '2026-06-26']
    },

    // Halton
    'Halton District School Board': {
        firstDay: '2025-09-03',
        lastDay: '2026-06-26',
        paDays: ['2025-09-02', '2025-10-10', '2025-11-28', '2026-01-26', '2026-02-13', '2026-04-24', '2026-06-05']
    },
    'Halton Catholic District School Board': {
        firstDay: '2025-09-03',
        lastDay: '2026-06-26',
        paDays: ['2025-09-02', '2025-10-10', '2025-11-28', '2026-01-26', '2026-02-13', '2026-04-24', '2026-06-05']
    },

    // Ottawa
    'Ottawa-Carleton District School Board': {
        firstDay: '2025-09-02',
        lastDay: '2026-06-26',
        paDays: ['2025-09-29', '2025-11-07', '2026-02-13', '2026-04-27', '2026-06-25', '2026-06-26']
    },
    'Ottawa Catholic School Board': {
        firstDay: '2025-09-02',
        lastDay: '2026-06-26',
        paDays: ['2025-10-10', '2025-11-07', '2025-12-05', '2026-01-30', '2026-02-13', '2026-04-27', '2026-06-05', '2026-06-26']
    },

    // Others
    'Waterloo Region District School Board': {
        firstDay: '2025-09-03',
        lastDay: '2026-06-25',
        paDays: ['2025-09-02', '2025-10-10', '2025-11-17', '2026-01-16', '2026-04-24', '2026-05-29', '2026-06-26']
    },
    'Thames Valley District School Board': {
        firstDay: '2025-09-03',
        lastDay: '2026-06-25',
        paDays: ['2025-09-02', '2025-10-10', '2025-11-14', '2026-01-30', '2026-04-24', '2026-05-29', '2026-06-26']
    },
    'Simcoe County District School Board': {
        firstDay: '2025-09-02',
        lastDay: '2026-06-25',
        paDays: ['2025-09-26', '2025-10-24', '2025-11-14', '2026-01-30', '2026-06-05', '2026-06-26']
    },
    'District School Board of Niagara': {
        firstDay: '2025-09-02', // Assumed based on PA days
        lastDay: '2026-06-26',
        paDays: ['2025-09-19', '2025-10-10', '2025-11-28', '2026-01-16', '2026-01-29', '2026-02-13', '2026-06-05', '2026-06-25', '2026-06-26']
    }
};

export const ALL_BOARDS_CONFIG = [
    { name: 'Toronto District School Board', region: 'Toronto', themeColor: '#e11d48' },
    { name: 'Toronto Catholic District School Board', region: 'Toronto', themeColor: '#be123c' },
    { name: 'York Region District School Board', region: 'York Region', themeColor: '#7c3aed' },
    { name: 'York Catholic District School Board', region: 'York Region', themeColor: '#6d28d9' },
    { name: 'Peel District School Board', region: 'Peel Region', themeColor: '#eab308' },
    { name: 'Dufferin-Peel Catholic District School Board', region: 'Peel Region', themeColor: '#ca8a04' },
    { name: 'Durham District School Board', region: 'Durham Region', themeColor: '#2563eb' },
    { name: 'Durham Catholic District School Board', region: 'Durham Region', themeColor: '#1d4ed8' },
    { name: 'Halton District School Board', region: 'Halton Region', themeColor: '#059669' },
    { name: 'Halton Catholic District School Board', region: 'Halton Region', themeColor: '#047857' },
    { name: 'Ottawa-Carleton District School Board', region: 'Ottawa', themeColor: '#db2777' },
    { name: 'Ottawa Catholic School Board', region: 'Ottawa', themeColor: '#be185d' },
    { name: 'Waterloo Region District School Board', region: 'Waterloo', themeColor: '#65a30d' },
    { name: 'Thames Valley District School Board', region: 'London', themeColor: '#0891b2' },
    { name: 'Simcoe County District School Board', region: 'Simcoe County', themeColor: '#0284c7' },
    { name: 'District School Board of Niagara', region: 'Niagara', themeColor: '#4f46e5' },

    // Boards where we use generic calendar for now
    { name: 'Upper Canada District School Board', region: 'Eastern Ontario', themeColor: '#dc2626' },
    { name: 'Renfrew County District School Board', region: 'Pembroke', themeColor: '#9ca3af' },
    { name: 'London District Catholic School Board', region: 'London', themeColor: '#0e7490' },
    { name: 'Greater Essex County District School Board', region: 'Windsor', themeColor: '#ea580c' },
    { name: 'Waterloo Catholic District School Board', region: 'Waterloo', themeColor: '#4d7c0f' },
    { name: 'Hamilton-Wentworth District School Board', region: 'Hamilton', themeColor: '#d97706' },
    { name: 'Hamilton-Wentworth Catholic District School Board', region: 'Hamilton', themeColor: '#b45309' },
    { name: 'Niagara Catholic District School Board', region: 'Niagara', themeColor: '#4338ca' },
    { name: 'Simcoe Muskoka Catholic District School Board', region: 'Simcoe County', themeColor: '#0369a1' },
    { name: 'Trillium Lakelands District School Board', region: 'Muskoka', themeColor: '#16a34a' },
    { name: 'Near North District School Board', region: 'North Bay', themeColor: '#15803d' },
    { name: 'Algoma District School Board', region: 'Sault Ste. Marie', themeColor: '#b91c1c' },
    { name: 'Rainbow District School Board', region: 'Sudbury', themeColor: '#c2410c' },
    { name: 'Lakehead District School Board', region: 'Thunder Bay', themeColor: '#1d4ed8' },
    { name: 'Conseil scolaire Viamonde', region: 'Ontario (French Public)', themeColor: '#8b5cf6' },
    { name: 'Conseil scolaire catholique MonAvenir', region: 'Ontario (French Catholic)', themeColor: '#7c3aed' },
];
