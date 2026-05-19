const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // fix to='/dashboard/...' to to='/app/dashboard/...'
  const dashRegex = /to=['"]\/dashboard\/(.*?)['"]/g;
  if (dashRegex.test(content)) {
    content = content.replace(dashRegex, 'to="/app/dashboard/$1"');
    changed = true;
  }
  
  // fix to='/dashboard'
  const dashExactRegex = /to=['"]\/dashboard['"]/g;
  if (dashExactRegex.test(content)) {
    content = content.replace(dashExactRegex, 'to="/app/dashboard"');
    changed = true;
  }

  // fix to='/about', to='/programs', to='/trainers' to /public/...
  const pubRegex = /to=['"]\/(about|programs|trainers)['"]/g;
  if (pubRegex.test(content)) {
    content = content.replace(pubRegex, 'to="/public/$1"');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed links in', filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
      replaceInFile(p);
    }
  }
}

walk(path.join(process.cwd(), 'src'));
