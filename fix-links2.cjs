const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // fix to: "/dashboard/..." to to: "/app/dashboard/..."
  const objDashRegex = /to:\s*["']\/dashboard\/(.*?)["']/g;
  if (objDashRegex.test(content)) {
    content = content.replace(objDashRegex, 'to: "/app/dashboard/$1"');
    changed = true;
  }
  
  // fix to="/dashboard/live" if any
  const toDashLive = /to=["']\/dashboard\/live["']/g;
  if (toDashLive.test(content)) {
    content = content.replace(toDashLive, 'to="/live"');
    changed = true;
  }

  // fix to="/app/dashboard/live" to "/live"
  const toAppDashLive = /to=["']\/app\/dashboard\/live["']/g;
  if (toAppDashLive.test(content)) {
    content = content.replace(toAppDashLive, 'to="/live"');
    changed = true;
  }

  // fix to="/dashboard/settings" to "/settings"
  const toDashSettings = /to=["']\/dashboard\/settings["']/g;
  if (toDashSettings.test(content)) {
    content = content.replace(toDashSettings, 'to="/settings"');
    changed = true;
  }

  // fix to="/app/dashboard/settings" to "/settings"
  const toAppDashSettings = /to=["']\/app\/dashboard\/settings["']/g;
  if (toAppDashSettings.test(content)) {
    content = content.replace(toAppDashSettings, 'to="/settings"');
    changed = true;
  }

  // fix to="/dashboard" to "/"
  const toDashExact = /to=["']\/dashboard["']/g;
  if (toDashExact.test(content)) {
    content = content.replace(toDashExact, 'to="/"');
    changed = true;
  }

  // fix to="/app/dashboard" to "/"
  const toAppDashExact = /to=["']\/app\/dashboard["']/g;
  if (toAppDashExact.test(content)) {
    content = content.replace(toAppDashExact, 'to="/"');
    changed = true;
  }

  // fix to: "/dashboard" to "/"
  const objDashExact = /to:\s*["']\/dashboard["']/g;
  if (objDashExact.test(content)) {
    content = content.replace(objDashExact, 'to: "/"');
    changed = true;
  }
  
  // fix to: "/app/dashboard" to "/"
  const objAppDashExact = /to:\s*["']\/app\/dashboard["']/g;
  if (objAppDashExact.test(content)) {
    content = content.replace(objAppDashExact, 'to: "/"');
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
