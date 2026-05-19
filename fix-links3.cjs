const fs = require('fs');

let c1 = fs.readFileSync('src/components/dashboard/DashboardLayout.tsx', 'utf8');
c1 = c1.replace(/to=['"]\/app\/dashboard\/live['"]/g, 'to="/live"');
c1 = c1.replace(/to=['"]\/app\/dashboard\/settings['"]/g, 'to="/settings"');
fs.writeFileSync('src/components/dashboard/DashboardLayout.tsx', c1);

let c2 = fs.readFileSync('src/components/site/PublicLayout.tsx', 'utf8');
c2 = c2.replace(/to=['"]\/about['"]/g, 'to="/public/about"');
c2 = c2.replace(/to=['"]\/programs['"]/g, 'to="/public/programs"');
c2 = c2.replace(/to=['"]\/trainers['"]/g, 'to="/public/trainers"');
fs.writeFileSync('src/components/site/PublicLayout.tsx', c2);

console.log('Fixed manually');
