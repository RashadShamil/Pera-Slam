const fs = require('fs');
const path = require('path');

// 1. Move and update App.tsx to page.tsx
const appPath = path.join('src', 'app', 'App.tsx');
let appContent = '';
if (fs.existsSync(appPath)) {
  appContent = fs.readFileSync(appPath, 'utf8');
  if (!appContent.includes('use client')) {
    appContent = '"use client";\n' + appContent;
  }
  fs.writeFileSync(path.join('src', 'app', 'page.tsx'), appContent);
  fs.unlinkSync(appPath);
}

// 2. Delete Vite files
const filesToDelete = [
  'index.html',
  'vite.config.ts',
  path.join('src', 'main.tsx'),
  'temp.js' // delete the old failed file
];

filesToDelete.forEach(f => {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
  }
});

// 3. Automatically add "use client" to all components using React Hooks or framer-motion
function findAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findAllFiles(fullPath, fileList);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const components = findAllFiles(path.join('src', 'app', 'components'));
components.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('"use client"') && !content.includes("'use client'")) {
    if (content.includes('useState') || content.includes('useEffect') || content.includes('useRef') || content.includes('motion') || content.includes('createContext')) {
      fs.writeFileSync(file, '"use client";\n' + content);
      console.log('Added use client to', file);
    }
  }
});
