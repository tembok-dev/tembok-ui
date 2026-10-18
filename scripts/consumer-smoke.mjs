/**
 * Local release smoke test. Uses a packed tarball in an isolated temporary Vite
 * consumer. No publish, version change, CI or persistent fixtures.
 * Run from repo root: pnpm consumer:check
 */
import { execSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(fileURLToPath(new URL('..', import.meta.url)));
const pkgDir = join(repo, 'packages', 'ui-react');
const temp = mkdtempSync(join(tmpdir(), 'tembok-consumer-'));
const quote = s => '"' + s.replace(/"/g, '\\"') + '"';
const run = (command, cwd = repo) => execSync(command, { cwd, stdio: 'inherit', shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/sh' });
const write = (path, content) => writeFileSync(join(temp, path), content);
try {
  run('pnpm --filter @tembok/ui-react build');
  run('pnpm --filter @tembok/ui-react copy:styles');
  run('pnpm pack --pack-destination ' + quote(temp), pkgDir);
  const tarball = readdirSync(temp).find(f => f.endsWith('.tgz'));
  if (!tarball) throw new Error('No package tarball generated');
  // An isolated package.json ensures package resolution cannot fall back to workspace:*.
  write('package.json', JSON.stringify({
    private: true, type: 'module',
    scripts: { typecheck: 'tsc --noEmit', build: 'vite build' },
    dependencies: {
      '@tembok/ui-react': 'file:./' + tarball,
      react: '^18.3.1', 'react-dom': '^18.3.1'
    },
    devDependencies: {
      '@types/react': '^18.3.26', '@types/react-dom': '^18.3.7',
      typescript: '~5.9.3', vite: '^7.2.4'
    }
  }, null, 2));
  write('tsconfig.json', JSON.stringify({
    compilerOptions: {
      target: 'ES2022', lib: ['ES2022', 'DOM', 'DOM.Iterable'],
      module: 'ESNext', moduleResolution: 'Bundler', jsx: 'react-jsx',
      strict: true, noEmit: true, skipLibCheck: true, allowSyntheticDefaultImports: true
    },
    include: ['src']
  }, null, 2));
  write('index.html', '<!doctype html><html><head><meta charset="UTF-8"></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>');
  mkdirSync(join(temp, 'src'));
  write('src/main.tsx', `import { createRoot } from 'react-dom/client';
import { Button, IconButton, Modal, AlertDialog, Popover, Dropdown,
  MenuItem, SideBar, ToastProvider, useToast, DataTable, InputField,
  Loaders, DevGrid, TembokLogo, primaryForeground,
  type DataTableProps, type InputFieldProps, type ToastInput, type LoadersProps
} from '@tembok/ui-react';
import { useState } from 'react';

const toastOptions: ToastInput = { title: 'Installed correctly', description: 'Packed package', intent: 'success' };
const tableProps: DataTableProps<{ id: number; name: string }> = {
  data: [{ id: 1, name: 'Test' }],
  columns: [{ id: 'name', label: 'Name', sortable: true }],
  getRowId: row => row.id,
};
const loaderProps: LoadersProps = { size: 'sm', label: 'Loading' };
const inputProps: InputFieldProps = { label: 'Name', value: '', onChange: () => {} };
function Consumer() {
  const [open, setOpen] = useState(false);
  const { show } = useToast();
  return <div className="tmbk-theme">
    <Button onClick={() => show(toastOptions)}>Notify</Button>
    <IconButton label="Open" onClick={() => setOpen(true)}>+</IconButton>
    <DataTable {...tableProps} />
    <InputField {...inputProps} />
    <Loaders {...loaderProps} />
    <TembokLogo />
    <Modal open={open} onOpenChange={setOpen} header={<h2>Modal</h2>}>Content</Modal>
    <span style={{ color: primaryForeground('#ffffff') }}>Accessible text</span>
  </div>;
}
createRoot(document.getElementById('root')!).render(<ToastProvider><Consumer /></ToastProvider>);
// Public-symbol imports above also exercise package declarations for overlay primitives.
void [AlertDialog, Popover, Dropdown, MenuItem, SideBar, DevGrid];
`);
  console.log('\nInstalling packed package in isolated consumer...');
  run('pnpm install --ignore-scripts', temp);
  run('pnpm typecheck', temp);
  run('pnpm build', temp);
  const out = join(temp, 'dist', 'assets');
  const assets = existsSync(out) ? readdirSync(out) : [];
  // tsup is configured with injectStyle: true, so Vite may bundle Tembok's
  // stylesheet into JavaScript instead of emitting a separate .css asset.
  const hasCssAsset = assets.some(f => f.endsWith('.css'));
  const jsContent = assets.filter(f => f.endsWith('.js'))
    .map(f => readFileSync(join(out, f), 'utf8')).join('\n');
  const hasInjectedStyles = jsContent.includes('--tmbk-primary') &&
    jsContent.includes('.tmbk-toast');
  if (!hasCssAsset && !hasInjectedStyles) {
    throw new Error('Styles not found in CSS assets or JS style-injection payload');
  }
  console.log('\nPASS: packed-package install, exported types, Vite build and packaged styles (' +
    (hasCssAsset ? 'CSS asset' : 'injected JS') + ').');
} finally {
  rmSync(temp, { recursive: true, force: true });
}
