import { useState } from 'react';
import { Button, Modal, AlertDialog, Popover, Dropdown, IconButton, SideBar, MenuItem, primaryForeground } from '@tembok/ui-react';

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type Side = 'auto' | 'up' | 'down';
const brandSwatches = [
  { name: 'Default', value: '#5aedea' },
  { name: 'Red', value: '#c31f39' },
  { name: 'Cyan', value: '#00ffff' },
  { name: 'Lime', value: '#c5e836' },
  { name: 'Ink', value: '#1a2332' },
] as const;
function ThemeIcon({ mode }: { mode: 'light' | 'dark' }) {
  return <svg aria-hidden="true" viewBox="0 -960 960 960" width="20" height="20" fill="currentColor"><path d={mode === 'light' ? 'M565-395q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm-226.5 56.5Q280-397 280-480t58.5-141.5Q397-680 480-680t141.5 58.5Q680-563 680-480t-58.5 141.5Q563-280 480-280t-141.5-58.5ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z' : 'M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z'} /></svg>;
}

function PlaygroundMenuIcon({ name }: { name: 'edit' | 'copy' | 'delete' }) {
  const paths = {"edit":"M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z","copy":"M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z","delete":"M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"};
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 -960 960 960" fill="currentColor"><path d={paths[name]} /></svg>;
}

export function Playground() {
  const [page, setPage] = useState<'gallery' | 'qa'>('gallery');
  const [modalOpen, setModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showcaseTheme, setShowcaseTheme] = useState<'light' | 'dark'>('light');
  const [themePreset, setThemePreset] = useState<'neutral' | 'tembok'>('neutral');
  const [showcaseRadius, setShowcaseRadius] = useState(12);
  const [showcaseMotion, setShowcaseMotion] = useState(true);
  const [primaryColor, setPrimaryColor] = useState('#475569');
  const [section, setSection] = useState<'buttons' | 'overlays' | 'surfaces'>('buttons');
  const [corner, setCorner] = useState<Corner>('bottom-right');
  const [side, setSide] = useState<Side>('down');
  const [tall, setTall] = useState(false);
  const [emptyModal, setEmptyModal] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const [contextPoint, setContextPoint] = useState({ x: 120, y: 200 });
  const [lastDismissal, setLastDismissal] = useState('none');

  return (
    <div className="playground" data-showcase-theme={showcaseTheme} data-preset={themePreset} data-motion={showcaseMotion ? "on" : "off"} style={{ ["--tmbk-radius-surface" as string]: `${showcaseRadius}px`, ["--tmbk-primary" as string]: primaryColor, ["--tmbk-primary-fg" as string]: primaryForeground(primaryColor), ["--tmbk-ring" as string]: `${primaryColor}66`, ["--tmbk-motion-fast" as string]: showcaseMotion ? "140ms" : "0ms", ["--tmbk-motion-normal" as string]: showcaseMotion ? "220ms" : "0ms" }}>
      <header className="playground-header">
        <div><strong>Tembok UI</strong><span>React playground · local source</span></div>
        <nav aria-label="Playground sections">
          <Button type="button" intent={page === 'gallery' ? 'primary' : 'neutral'} onClick={() => setPage('gallery')}>Gallery</Button>
          <Button type="button" intent={page === 'qa' ? 'primary' : 'neutral'} onClick={() => setPage('qa')}>Overlay QA</Button>
        </nav>
      </header>
      {page === 'gallery' ? (
        <main className="workbench" aria-label="Component workbench">
          <aside className="workbench-nav" aria-label="Component navigation">
            <div className="workbench-nav-title">COMPONENTS</div>
            {(['buttons','overlays','surfaces'] as const).map(item =>
              <button key={item} className={section === item ? 'workbench-nav-item selected' : 'workbench-nav-item'} aria-current={section === item ? 'page' : undefined} onClick={() => setSection(item)}>
                {item === 'buttons' ? 'Buttons' : item === 'overlays' ? 'Overlays' : 'Surfaces'}
              </button>
            )}
            <div className="workbench-nav-title workbench-nav-tools">TOOLS</div>
            <button className="workbench-nav-item" onClick={() => setPage('qa')}>Overlay QA ↗</button>
          </aside>
          <div className="workbench-content">
            <div className="workbench-heading"><div><div className="workbench-breadcrumb">React / Components / {section}</div><h1>{section === 'buttons' ? 'Buttons' : section === 'overlays' ? 'Overlays' : 'Surfaces'}</h1><p>{section === 'buttons' ? 'Actions, sizes and states.' : section === 'overlays' ? 'Modal, popover and menu behavior.' : 'Appearance, depth and radius tokens.'}</p></div><span className="workbench-source">LOCAL SOURCE</span></div>
            <div className="workbench-preview">
              <div className="workbench-preview-top"><span>PREVIEW</span><span>Actual @tembok/ui-react components</span></div>
              <div className="workbench-stage">
                {section === 'buttons' && <div className="workbench-examples"><div className="workbench-example-label">Intents</div><div className="playground-actions"><Button intent="primary">Primary</Button><Button intent="secondary">Secondary</Button><Button intent="neutral">Neutral</Button><Button intent="ghost">Ghost</Button><Button intent="danger">Danger</Button><Button disabled>Disabled</Button><IconButton label="Favorite"><span aria-hidden="true">✦</span></IconButton></div><div className="workbench-example-label">Sizes</div><div className="playground-actions"><Button size="sm">Small</Button><Button size="md">Medium</Button><Button size="lg">Large</Button></div><div className="workbench-example-label">Icon buttons · 28px Edit / 32px Duplicate / disabled Delete</div><div className="playground-actions"><IconButton size="xs" intent="neutral" label="Compact edit"><PlaygroundMenuIcon name="edit" /></IconButton><IconButton size="xs" intent="ghost" label="Compact duplicate" style={{ ["--tmbk-icon-button-xs-size" as string]: "32px" }}><PlaygroundMenuIcon name="copy" /></IconButton><IconButton size="xs" intent="neutral" disabled label="Disabled compact delete"><PlaygroundMenuIcon name="delete" /></IconButton></div></div>}
                {section === 'overlays' && <div className="workbench-examples"><div className="workbench-example-label">Floating components</div><div className="playground-actions"><Button onClick={() => setModalOpen(true)}>Open modal</Button><Button intent="neutral" data-sidebar-open="qa-sidebar">Open sidebar</Button><Button intent="neutral" onClick={() => setSettingsOpen(true)}>Settings modal</Button><Button intent="danger" onClick={() => setConfirmOpen(true)}>Confirm action</Button><Popover trigger={<Button intent="neutral">Popover</Button>}><div className="fixture-content"><span>Popover content</span><button type="button">Focusable action</button></div></Popover><Dropdown trigger={<Button intent="neutral">Dropdown</Button>}><MenuItem icon={<PlaygroundMenuIcon name="edit" />} trailing="⌘ E">Edit</MenuItem><MenuItem icon={<PlaygroundMenuIcon name="copy" />}>Duplicate</MenuItem><MenuItem danger icon={<PlaygroundMenuIcon name="delete" />}>Delete</MenuItem></Dropdown></div><p className="workbench-hint">Try Escape, keyboard focus and clicking outside.</p></div>}
                {section === 'surfaces' && <div className="workbench-surface-example"><div className="workbench-surface-card"><small>STATUS</small><strong>Ready for review</strong><span>Semantic surface and elevation tokens.</span><Button size="sm">Review</Button></div></div>}
              </div>
              <div className="workbench-preview-bottom"><span>{section === 'buttons' ? 'Hover · Focus · Disabled' : section === 'overlays' ? 'Portals · Focus · Dismissal' : 'Colors · Radius · Elevation'}</span><span>PREVIEW / 01</span></div>
            </div>
            <div className="workbench-reference"><h2>Component notes</h2><p>{section === 'buttons' ? 'Use intent to communicate priority. Theme tokens define the appearance.' : section === 'overlays' ? 'Overlays mount in document.body. The preview applies appearance and accent to portals as well as the workbench.' : 'Adjust surface radius and appearance in the inspector. These values are configurable, not hard-coded into consumer apps.'}</p></div>
          </div>
          <aside className="workbench-inspector" aria-label="Preview inspector">
            <div className="workbench-inspector-title">PREVIEW SETTINGS</div>
            <label className="workbench-field">Theme preset
              <select aria-label="Theme preset" value={themePreset} onChange={event => {
                const preset = event.target.value as typeof themePreset;
                setThemePreset(preset);
                setPrimaryColor(preset === 'tembok' ? '#5aedea' : '#475569');
              }}>
                <option value="neutral">Neutral default</option>
                <option value="tembok">Tembok brand</option>
              </select>
            </label>
            <div className="workbench-field"><span>Appearance</span><div className="workbench-mode-tabs" role="group" aria-label="Appearance">
              {(['light', 'dark'] as const).map(mode => <button type="button" key={mode} aria-label={mode === 'light' ? 'Light mode' : 'Dark mode'} aria-pressed={showcaseTheme === mode} className={showcaseTheme === mode ? 'active' : ''} onClick={() => setShowcaseTheme(mode)}><ThemeIcon mode={mode}/></button>)}
            </div></div>
            <div className="workbench-field"><span>Primary color</span><div className="workbench-swatches" role="group" aria-label="Preset primary colors">
              {brandSwatches.map(swatch => <button key={swatch.name} type="button" title={swatch.name} aria-label={swatch.name + ' primary'} aria-pressed={primaryColor.toLowerCase() === swatch.value} className={primaryColor.toLowerCase() === swatch.value ? 'selected' : ''} style={{ backgroundColor: swatch.value }} onClick={() => setPrimaryColor(swatch.value)} />)}
            </div><label htmlFor="workbench-primary" className="workbench-custom-label">Custom color</label><div className="workbench-color"><input id="workbench-primary" type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} /><output>{primaryColor.toUpperCase()}</output></div></div>
            <label className="workbench-field">Corner radius <div className="workbench-range"><input aria-label="Surface radius" type="range" min="4" max="24" step="2" value={showcaseRadius} onChange={e => setShowcaseRadius(Number(e.target.value))} /><output>{showcaseRadius}px</output></div></label>
            <label className="workbench-check"><input type="checkbox" checked={showcaseMotion} onChange={e => setShowcaseMotion(e.target.checked)} /> Enable motion</label>
            <p className="workbench-inspector-note">Preview only. No changes to package defaults.</p>
          </aside>
        </main>
      ) : (
        <main className="playground-main">
          <h1>Overlay QA</h1>
          <p>Inspect the package, not custom overlay replacements. Native test controls are intentional.</p>
          <div className="qa-controls">
            <label>Anchor <select value={corner} onChange={event => setCorner(event.target.value as Corner)}>
              <option value="top-left">top-left</option><option value="top-right">top-right</option>
              <option value="bottom-left">bottom-left</option><option value="bottom-right">bottom-right</option>
            </select></label>
            <label>Preferred side <select value={side} onChange={event => setSide(event.target.value as Side)}>
              <option value="auto">auto</option><option value="up">up</option><option value="down">down</option>
            </select></label>
            <label><input type="checkbox" checked={tall} onChange={event => setTall(event.target.checked)} /> Tall menu</label>
            <label><input type="checkbox" checked={emptyModal} onChange={event => setEmptyModal(event.target.checked)} /> Modal without focusables</label>
            <Button onClick={() => setModalOpen(true)}>Open modal</Button>
            <Button data-sidebar-open="qa-sidebar" intent="neutral">Open sidebar</Button>
            <button type="button">Outside focus target</button>
          </div>
          <p className="qa-note">Tab through each overlay, press Escape, verify focus returns to its trigger. Test at 375, 900 and 1280px.</p>
          <section className="playground-card">
            <h2>Controlled context menu</h2>
            <p>Right-click in the dashed region, or use the keyboard button to open without a synthetic trigger click.</p>
            <div data-testid="context-zone" tabIndex={0}
              onContextMenu={event => {
                event.preventDefault();
                setContextPoint({ x: event.clientX, y: event.clientY });
                setContextOpen(true);
              }}
              style={{ border: '1px dashed currentColor', padding: 24 }}>
              Right-click here
            </div>
            <Button type="button" onClick={() => { setContextPoint({ x: 120, y: 240 }); setContextOpen(true); }}>Open context menu by keyboard</Button>
            <p data-testid="dismissal-reason">Last dismissal: {lastDismissal}</p>
            <Dropdown open={contextOpen} onOpenChange={(next, reason) => {
              setContextOpen(next);
              if (!next) setLastDismissal(reason);
            }} anchorRect={contextPoint} ariaLabel="Context actions" side="auto">
              <div className="fixture-content" data-testid="context-menu">
                <button type="button">Rename</button>
                <button type="button" data-close-popover="false">Keep open</button>
              </div>
            </Dropdown>
          </section>
          <section className="playground-card" aria-label="Scoped portal theme comparison">
            <h2>Portal inheritance: two product scopes</h2>
            <p>Open both menus and compare their colors. Neither should inherit the other product's palette or require a body theme override.</p>
            <div className="qa-controls">
              <div style={{ padding: 12, background: '#f8fafc', color: '#1f2937', borderRadius: 8,
                '--tmbk-primary': '#f8c61e', '--tmbk-primary-fg': '#111111',
                '--tmbk-surface-raised': '#252c37', '--tmbk-surface-text': '#f6f7f9',
                '--tmbk-surface-border': '#5b6a80' } as React.CSSProperties}>
                <Dropdown trigger={<Button intent="primary">Product A menu</Button>}>
                  <MenuItem>Product A action</MenuItem>
                </Dropdown>
              </div>
              <div style={{ padding: 12, background: '#e0f2fe', color: '#142d42', borderRadius: 8,
                '--tmbk-primary': '#2563eb', '--tmbk-primary-fg': '#ffffff',
                '--tmbk-surface-raised': '#f0f9ff', '--tmbk-surface-text': '#142d42',
                '--tmbk-surface-border': '#93c5fd' } as React.CSSProperties}>
                <Dropdown trigger={<Button intent="primary">Product B menu</Button>}>
                  <MenuItem>Product B action</MenuItem>
                </Dropdown>
              </div>
            </div>
          </section>
          <div className={`qa-anchors qa-${corner}`}>
            <Popover key={`popover-${corner}-${side}-${tall}`} trigger={<Button intent="neutral">Open popover</Button>} side={side} align="end">
              <div className="fixture-content" data-testid="popover-content">
                <label>Popover input <input aria-label="Popover input" /></label>
                {tall && <div className="fixture-tall">{Array.from({ length: 25 }, (_, i) => <p key={i}>Item {i + 1}</p>)}</div>}
              </div>
            </Popover>
            <Dropdown key={`dropdown-${corner}-${side}-${tall}`} trigger={<Button intent="neutral">Open dropdown</Button>} side={side} align="end">
              <div className="fixture-content" data-testid="dropdown-content">
                <button type="button">Action one</button><button type="button">Action two</button>
                {tall && <div className="fixture-tall">{Array.from({ length: 25 }, (_, i) => <button key={i} type="button">Action {i + 3}</button>)}</div>}
              </div>
            </Dropdown>
          </div>
        </main>
      )}
      <SideBar id="qa-sidebar" closeOnEscape={false} showClose header={<strong>QA sidebar (Escape disabled)</strong>}>
        <div className="fixture-content">
          <button data-close-menu type="button">Close sidebar</button>
          <Popover trigger={<Button intent="neutral">Sidebar popover</Button>}>
            <div className="fixture-content"><button type="button">Sidebar nested action</button></div>
          </Popover>
        </div>
      </SideBar>
      <Modal open={settingsOpen} onOpenChange={setSettingsOpen} size="xl"
        header={<h2>Settings</h2>}
        footer={<Button onClick={() => setSettingsOpen(false)}>Done</Button>}>
        <div className="fixture-tall" style={{ minWidth: 0 }}>
          <p>A wider workspace modal with independently scrolling body and persistent footer.</p>
          <label>Workspace name <input aria-label="Workspace name" defaultValue="Sample workspace" /></label>
          {Array.from({ length: 25 }, (_, i) => <p key={i}>Setting section {i + 1}</p>)}
        </div>
      </Modal>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}
        title="Delete draft?"
        cancelAction={<Button intent="neutral" onClick={() => setConfirmOpen(false)}>Cancel</Button>}
        confirmAction={<Button intent="danger" onClick={() => setConfirmOpen(false)}>Confirm delete</Button>}>
        <p>Delete this draft? This action cannot be undone.</p>
      </AlertDialog>
      <Modal open={modalOpen} onOpenChange={setModalOpen}
        header={<h2>QA modal</h2>}
        footer={emptyModal ? undefined : <Button onClick={() => setModalOpen(false)}>Close modal</Button>}>
        {!emptyModal && <div className="modal-fixture"><label>Modal input <input aria-label="Modal input" /></label><button type="button" disabled>Disabled (skip)</button><a href="#focus-check" onClick={event => event.preventDefault()}>Modal link</a><Popover trigger={<Button type="button" intent="neutral">Nested popover</Button>}><div className="fixture-content"><button type="button">Nested action</button></div></Popover></div>}
      </Modal>
    </div>
  );
}
