import { useCallback, useState } from 'react';
import { Button, DataTable, DevGrid, InputField, Loaders, TembokLogo, ToastProvider, useToast } from '@tembok/ui-react';

type SampleRow = { id: number; name: string; status: string; amount: number };
const rows: SampleRow[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1, name: ['North', 'East', 'West', 'Central'][i % 4] + ' project ' + (i + 1),
  status: i % 3 === 0 ? 'Pending' : 'Active', amount: (i + 1) * 125,
}));
const columns = [
  { id: 'name', label: 'Project', isPrimary: true, sortable: true },
  { id: 'status', label: 'Status', sortable: true },
  { id: 'amount', label: 'Amount', sortable: true, align: 'right' as const },
];

function ToastFixtures() {
  const { show, clear } = useToast();
  return <div className="playground-fixture-block">
    <h3>Toast · Notifications</h3>
    <p>Try stacking, dismissing, waiting for auto-dismiss, and persistent notifications.</p>
    <div className="playground-actions">
      <Button size="sm" onClick={() => show({ title: 'Saved', description: 'Your changes were saved.', intent: 'success', duration: 3500 })}>Success</Button>
      <Button size="sm" intent="neutral" onClick={() => show({ title: 'Connection interrupted', description: 'Try again in a moment.', intent: 'warning', duration: 6000 })}>Warning</Button>
      <Button size="sm" intent="danger" onClick={() => show({ title: 'Could not save', description: 'Please retry your request.', intent: 'danger', duration: 0 })}>Sticky error</Button>
      <Button size="sm" intent="secondary" onClick={() => show({ title: 'Update available', intent: 'neutral' })}>Information</Button>
      <Button size="sm" intent="secondary" onClick={() => show({ title: 'File uploaded', description: <span><strong>report.pdf</strong> · 2.4 MB · <span style={{ overflowWrap: 'anywhere' }}>https://example.com/files/report.pdf</span></span>, intent: 'success', duration: 0, action: { label: 'View', onClick: () => {}, dismissOnClick: true } })}>Rich upload</Button>
      <Button size="sm" intent="secondary" onClick={() => show({ title: 'New message', description: <span style={{ display:'flex', gap:8, alignItems:'center' }}><span aria-hidden="true" style={{ display:'grid',placeItems:'center',flexShrink:0,width:24,height:24,borderRadius:'50%',background:'var(--tmbk-primary)',color:'var(--tmbk-primary-fg)' }}>M</span><span>“Are you available tomorrow?”</span></span>, action: <button type="button" style={{ border:'1px solid var(--tmbk-border)',borderRadius:8,padding:'6px 9px',background:'var(--tmbk-bg-dark)',color:'var(--tmbk-fg)',cursor:'pointer' }}>Reply</button>, duration: 0 })}>Rich message</Button>
      <Button size="sm" intent="neutral" onClick={clear}>Clear all</Button>
    </div>
  </div>;
}

export function RemainingComponentFixtures() {
  const [empty, setEmpty] = useState(false);
  const [selected, setSelected] = useState(0);
  const [name, setName] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [gridOn, setGridOn] = useState(false);
  const loadSuggestions = useCallback(async (query: string) =>
    ['Design', 'Development', 'Documentation', 'Delivery']
      .filter(label => label.toLowerCase().includes(query.toLowerCase()))
      .map((label, i) => ({ slug: label.toLowerCase(), label, usage: 4 - i })), []);

  return <div className="playground-fixtures">
    <ToastProvider position="br"><ToastFixtures /></ToastProvider>

    <div className="playground-fixture-block">
      <h3>DataTable · Sorting, selection and pagination</h3>
      <p>Sort columns, select rows and navigate pages. Switch to empty data to inspect its fallback.</p>
      <div className="playground-actions">
        <Button size="sm" intent="neutral" onClick={() => setEmpty(v => !v)}>{empty ? 'Show rows' : 'Show empty table'}</Button>
        <span aria-live="polite">Selected: {selected}</span>
      </div>
      <div className="playground-fixture-table">
        <DataTable data={empty ? [] : rows} columns={columns} getRowId={row => row.id}
          enableSorting enableSelection enablePagination defaultPagination={{ pageIndex: 0, pageSize: 5 }}
          onSelectionChange={({ selectedIds }) => setSelected(selectedIds.length)} />
      </div>
    </div>

    <div className="playground-fixture-block">
      <h3>InputField · Standard, validation and suggestions</h3>
      <div className="playground-fixture-fields">
        <InputField label="Project name" description="A standard controlled input." placeholder="Enter name"
          value={name} onChange={setName} required />
        <InputField label="Validation example" description="Toggle error state." value={name}
          onChange={setName} error={invalid ? 'A valid project name is required.' : undefined} />
        <InputField label="Suggested category" placeholder="Try 'de'" value={suggestion}
          onChange={setSuggestion} suggestionsLoader={loadSuggestions}
          onSuggestionSelect={item => setSuggestion(item.label)} />
        <InputField label="Disabled input" value="Unavailable" onChange={() => {}} disabled />
      </div>
      <Button size="sm" intent="neutral" onClick={() => setInvalid(v => !v)}>Toggle error state</Button>
    </div>

    <div className="playground-fixture-block">
      <h3>Loaders · Types and sizes</h3>
      <div className="playground-fixture-loaders">
        {(['energyspin', 'spintrail'] as const).map(type => <div key={type}>
          <strong>{type}</strong>
          <div className="playground-actions">
            {(['sm', 'md', 'lg'] as const).map(size => <div key={size} className="playground-fixture-loader">
              <Loaders type={type} size={size} color="var(--tmbk-primary)" />
              <small>{size}</small>
            </div>)}
          </div>
        </div>)}
      </div>
    </div>

    <div className="playground-fixture-block">
      <h3>Developer tools · Grid and logo</h3>
      <p>DevGrid is a developer overlay. Toggle it to inspect grid alignment and responsive breakpoint changes.</p>
      <div className="playground-actions">
        <Button size="sm" intent="neutral" onClick={() => setGridOn(v => !v)}>{gridOn ? 'Hide grid' : 'Show grid'}</Button>
        <TembokLogo size="sm" />
        <TembokLogo size="md" animateOnHover={false} />
      </div>
      {gridOn && <DevGrid enabled columns={12} />}
    </div>
  </div>;
}
