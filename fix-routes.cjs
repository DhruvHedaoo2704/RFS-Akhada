const fs = require('fs');
const path = require('path');
const routesDir = path.join(process.cwd(), 'src/routes');

function fixFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixFiles(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let expectedId = '';
      if (fullPath.includes('app.dashboard') && file === 'exercises.tsx') {
        expectedId = '/exercises';
      } else if (fullPath.includes('app.dashboard') && file === 'coach.tsx') {
        expectedId = '/coach';
      } else if (fullPath.includes('app.dashboard') && file === 'gamification.tsx') {
        expectedId = '/gamification';
      } else if (fullPath.includes('app.dashboard') && file === 'bmi.tsx') {
        expectedId = '/bmi';
      } else if (fullPath.includes('app.dashboard') && file === 'challenges.tsx') {
        expectedId = '/challenges';
      } else if (fullPath.includes('app.dashboard')) {
        const basename = path.basename(file, '.tsx');
        expectedId = '/_app/dashboard/' + basename;
      } else if (file === 'app.tsx') {
        expectedId = '/_app';
      } else if (file === 'index.tsx' && dir === routesDir) {
        expectedId = '/_app/dashboard/';
      } else if (file === 'settings.tsx') {
        expectedId = '/_app/dashboard/settings';
      } else if (file === 'live.tsx') {
        expectedId = '/_app/dashboard/live';
      } else if (file === 'login.tsx') {
        expectedId = '/login';
      } else if (file === 'signup.tsx') {
        expectedId = '/signup';
      } else if (fullPath.includes('public') && file === 'index.tsx') {
        expectedId = '/_public/';
      } else if (fullPath.includes('public') && file === 'about.tsx') {
        expectedId = '/_public/about';
      } else if (fullPath.includes('public') && file === 'programs.tsx') {
        expectedId = '/_public/programs';
      } else if (fullPath.includes('public') && file === 'trainers.tsx') {
        expectedId = '/_public/trainers';
      } else if (file === 'public.tsx') {
        expectedId = '/_public';
      }
      
      if (expectedId) {
        const regex = /createFileRoute\(['"\`].*?['"\`]\)/g;
        if (regex.test(content)) {
          content = content.replace(regex, 'createFileRoute("' + expectedId + '")');
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log('Fixed:', fullPath);
        }
      }
    }
  }
}

fixFiles(routesDir);
