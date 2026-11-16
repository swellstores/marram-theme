import { Container } from 'ui-kit';

// Up to four short notes side by side under a hairline (shipping, returns, how things are made: the merchant's own
// words), each a small title and a few lines. Nothing when no note has words.
export const schema = {
  label: 'Text columns',
  fields: [
    { id: 'heading', type: 'text', label: 'Heading' },
    {
      id: 'items', type: 'list', label: 'Notes', max: 4,
      item: [
        { id: 'name', type: 'text', label: 'Title' },
        { id: 'words', type: 'textarea', label: 'Text' },
        { id: 'link_text', type: 'text', label: 'Link label' },
        { id: 'link_to', type: 'url', label: 'Link' },
      ],
    },
    { id: 'tone', type: 'select', label: 'Background', options: ['page', 'raised'], default: 'page' },
  ],
} as const;

export const styles = `
@media (max-width: 900px) { & .mr-cols { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important; } }
@media (max-width: 520px) { & .mr-cols { grid-template-columns: minmax(0, 1fr) !important; } }
`;

type Props = { heading?: string; items?: { name?: string; words?: string; link_text?: string; link_to?: string }[]; tone?: string };

export default function TextColumns(p: Props) {
  const notes = (p.items ?? []).filter((x) => x && (x.name || x.words));
  if (!notes.length) return null;
  return (
    <section style={{ padding: 'var(--uk-section-sm) 0', background: p.tone === 'raised' ? 'var(--uk-color-muted-bg)' : undefined }}>
      <Container>
        {p.heading ? <h2 className="uk-heading uk-heading--sm" style={{ margin: '0 0 var(--uk-space-6)' }}>{p.heading}</h2> : null}
        <div className="mr-cols" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max(notes.length, 3)}, minmax(0, 1fr))`, gap: 'var(--uk-space-6) clamp(20px, 3vw, 48px)' }}>
          {notes.map((n, i) => (
            <div key={i} style={{ paddingTop: 'var(--uk-space-4)', borderTop: '1px solid var(--uk-color-line-strong)' }}>
              {n.name ? <h3 style={{ margin: 0, fontFamily: 'var(--uk-font-body)', fontSize: 'var(--uk-text-sm)', fontWeight: 500, color: 'var(--uk-color-heading)' }}>{n.name}</h3> : null}
              {n.words ? <p style={{ margin: 'var(--uk-space-2) 0 0', fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}>{n.words}</p> : null}
              {n.link_text && n.link_to ? <a className="uk-link" href={n.link_to} style={{ display: 'inline-block', marginTop: 'var(--uk-space-3)', fontSize: 'var(--uk-text-sm)' }}>{n.link_text}</a> : null}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
