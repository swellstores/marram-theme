import { Container } from 'ui-kit';

// One sentence the merchant writes about the store, set large and light with room all around it, and an optional link
// under it. Nothing when there is no sentence.
export const schema = {
  label: 'Statement',
  fields: [
    { id: 'label', type: 'text', label: 'Small label' },
    { id: 'sentence', type: 'textarea', label: 'Sentence' },
    { id: 'more_label', type: 'text', label: 'Link label' },
    { id: 'more_href', type: 'url', label: 'Link' },
    { id: 'align', type: 'select', label: 'Alignment', options: ['offset', 'center'], default: 'offset' },
    { id: 'tone', type: 'select', label: 'Background', options: ['page', 'raised'], default: 'page' },
  ],
} as const;

export const styles = `
@media (max-width: 700px) { & .mr-say { grid-template-columns: minmax(0, 1fr) !important; } & .mr-say > p:first-child { padding-top: 0 !important; } }
`;

type Props = { label?: string; sentence?: string; more_label?: string; more_href?: string; align?: string; tone?: string };

export default function Statement(p: Props) {
  const text = (p.sentence ?? '').trim();
  if (!text) return null;
  const center = p.align === 'center';
  return (
    <section style={{ padding: 'var(--uk-section-lg) 0', background: p.tone === 'raised' ? 'var(--uk-color-muted-bg)' : undefined }}>
      <Container>
        <div className="mr-say" style={{ display: 'grid', gridTemplateColumns: center ? 'minmax(0, 1fr)' : 'minmax(0, 1fr) minmax(0, 3fr)', gap: 'var(--uk-space-4) clamp(24px, 6vw, 96px)', textAlign: center ? 'center' : undefined }}>
          <p style={{ margin: 0, fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)', paddingTop: center ? 0 : '.9em' }}>{p.label}</p>
          <div style={{ justifySelf: center ? 'center' : undefined }}>
            <p style={{ margin: 0, maxWidth: '28ch', fontFamily: 'var(--uk-font-heading)', fontWeight: 300, fontSize: 'clamp(28px, 3.6vw, 52px)', lineHeight: 1.18, letterSpacing: '-.02em', color: 'var(--uk-color-heading)', textWrap: 'balance', marginInline: center ? 'auto' : undefined }}>{text}</p>
            {p.more_label && p.more_href ? (
              <a href={p.more_href} className="uk-link" style={{ display: 'inline-block', marginTop: 'var(--uk-space-5)', fontSize: 'var(--uk-text-sm)' }}>{p.more_label}</a>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
