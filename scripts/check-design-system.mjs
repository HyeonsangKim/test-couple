import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TARGET_DIRS = ['src/app', 'src/components'];
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx']);

const checks = [
  {
    id: 'legacy-button-variant',
    description: 'Legacy Button variant usage',
    regex: /variant\s*=\s*"(?<value>primary|secondary|outline|danger)"/g,
    message: (match) => `legacy variant "${match.groups?.value ?? ''}"`,
  },
  {
    id: 'manual-danger-text',
    description: 'Manual danger textStyle override',
    regex: /textStyle\s*=\s*\{\{\s*color\s*:\s*colors\.accent\.danger\s*\}\}/g,
    message: () => 'manual textStyle danger override',
  },
  {
    id: 'raw-color-literal',
    description: 'Raw color literal',
    regex: /#[0-9A-Fa-f]{3,8}\b|rgba?\s*\(/g,
    message: (match) => `raw color literal "${match[0]}"`,
  },
];

const listSourceFiles = (dirPath) => {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...listSourceFiles(fullPath));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const ext = path.extname(entry.name);
    if (SOURCE_EXTENSIONS.has(ext)) {
      files.push(fullPath);
    }
  }

  return files;
};

const indexToLine = (source, index) => {
  let line = 1;
  for (let i = 0; i < index; i += 1) {
    if (source[i] === '\n') {
      line += 1;
    }
  }
  return line;
};

const findings = [];

for (const relDir of TARGET_DIRS) {
  const absDir = path.join(ROOT, relDir);
  if (!fs.existsSync(absDir)) {
    continue;
  }

  const files = listSourceFiles(absDir);
  for (const filePath of files) {
    const source = fs.readFileSync(filePath, 'utf8');

    for (const check of checks) {
      check.regex.lastIndex = 0;
      let match;
      while ((match = check.regex.exec(source)) !== null) {
        findings.push({
          check: check.id,
          description: check.description,
          filePath,
          line: indexToLine(source, match.index),
          message: check.message(match),
        });
      }
    }
  }
}

if (findings.length === 0) {
  console.log('✅ design-system check passed');
  process.exit(0);
}

console.error(`❌ design-system check failed (${findings.length} finding${findings.length > 1 ? 's' : ''})`);
for (const finding of findings) {
  const relativePath = path.relative(ROOT, finding.filePath);
  console.error(`- [${finding.check}] ${relativePath}:${finding.line} ${finding.message}`);
}

process.exit(1);
