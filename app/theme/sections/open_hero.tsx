import type { SiteInfo } from 'ui-kit';
import { Container, Icon, Image } from 'ui-kit';

// A first section that leads with words: a large, light heading (the store's name when none is written) with a short
// line and one link set apart on the right, then, when the merchant adds one, a wide photo underneath or a narrow one
// beside the words. Nothing is invented: without a photo it stays a band of type and space.
export const schema = {
  label: 'Open hero',
  fields: [
    { id: 'kicker', type: 'text', label: 'Small line above the heading' },
    { id: 'heading', type: 'textarea', label: 'Heading (blank: the store\'s name)' },
    { id: 'line', type: 'textarea', label: 'Short line' },
    { id: 'link_label', type: 'text', label: 'Link label', default: 'Shop all' },
    { id: 'link_href', type: 'url', label: 'Link', default: '/products' },
    { id: 'image', type: 'image', label: 'Photo' },
    { id: 'image_place', type: 'select', label: 'Photo position', options: ['below', 'beside'], default: 'below' },
    { id: 'photo_ratio', type: 'select', label: 'Photo shape (below)', options: ['16:7', '3:1'], default: '16:7' },
    { id: 'rule', type: 'select', label: 'Hairline under the words', options: ['show', 'hide'], default: 'show' },
  ],
} as const;

export const styles = `
& .mr-hero-words { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 4fr); gap: var(--uk-space-6) clamp(32px, 8vw, 140px); align-items: end; }
& .mr-hero-words h1 { font-size: clamp(44px, 7.4vw, 112px); line-height: 1.02; letter-spacing: -.035em; text-wrap: balance; }
& .mr-hero-link:hover svg { translate: 4px 0; }
& .mr-hero-link svg { transition: translate .25s ease; }
@media (max-width: 900px) {
  & .mr-hero-words { grid-template-columns: minmax(0, 1fr); align-items: start; }
  & .mr-hero-beside { grid-template-columns: minmax(0, 1fr) !important; }
  & .mr-hero-beside > :first-child { order: 2; }
}
`;

type Props = {
  site?: SiteInfo;
  kicker?: string; heading?: string; line?: string; link_label?: string; link_href?: string;
  image?: { url: string; alt?: string; width?: number; height?: number }; image_place?: string; photo_ratio?: string; rule?: string;
};

export default function OpenHero(p: Props) {
  const heading = (p.heading ?? '').trim() || p.site?.store.name || '';
  const photo = p.image && p.image.url ? { url: p.image.url, alt: p.image.alt ?? '', width: p.image.width, height: p.image.height } : null;
  const beside = !!photo && p.image_place === 'beside';
  const words = (
    <div className="mr-hero-words" style={{ gridTemplateColumns: beside ? 'minmax(0, 1fr)' : undefined, alignItems: beside ? 'start' : undefined }}>
      <div>
        {p.kicker ? <p style={{ margin: '0 0 var(--uk-space-4)', fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}>{p.kicker}</p> : null}
        {heading ? <h1 className="uk-heading" style={{ margin: 0, maxWidth: '13ch' }}>{heading}</h1> : null}
      </div>
      {p.line || (p.link_label && p.link_href) ? (
        <div style={{ paddingBottom: beside ? 0 : '0.6em' }}>
          {p.line ? <p style={{ margin: 0, maxWidth: '34ch', fontSize: 'var(--uk-text-md)', color: 'var(--uk-color-text-muted)' }}>{p.line}</p> : null}
          {p.link_label && p.link_href ? (
            <a className="mr-hero-link" href={p.link_href} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 'var(--uk-space-5)', paddingBottom: 4, borderBottom: '1px solid currentColor', color: 'var(--uk-color-ink)', textDecoration: 'none' }}>
              {p.link_label}
              <Icon name="arrow" size={16} />
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
  return (
    <section style={{ padding: 'clamp(56px, 11vw, 168px) 0 var(--uk-section-sm)' }}>
      <Container>
        {beside && photo ? (
          <div className="mr-hero-beside" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 4fr) minmax(0, 5fr)', gap: 'var(--uk-space-7) clamp(32px, 7vw, 120px)', alignItems: 'end' }}>
            <div className="uk-media" style={{ aspectRatio: '4 / 5' }}><Image image={photo} sizes="(max-width: 900px) calc(100vw - 48px), 460px" priority /></div>
            {words}
          </div>
        ) : words}
        {p.rule !== 'hide' && !beside ? <hr style={{ margin: 'clamp(48px, 7vw, 104px) 0 0', border: 0, borderTop: '1px solid var(--uk-color-line)' }} /> : null}
        {photo && !beside ? (
          <div className="uk-media" style={{ marginTop: 'clamp(32px, 5vw, 72px)', aspectRatio: p.photo_ratio === '3:1' ? '3 / 1' : '16 / 7' }}>
            <Image image={photo} sizes="(max-width: 900px) calc(100vw - 48px), 1200px" priority />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
