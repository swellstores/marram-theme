import type { ProductData, SiteInfo, Translate } from 'ui-kit';
import { Container, Icon, Image, pricesHiddenFor, Price, QuickAdd, SignInForPrices } from 'ui-kit';

// One product given a whole band: its photo set on a wide pale plinth, with its name, price, a line from its
// description and a link to its page beside it (plus a one-click add when the product has nothing to choose). All of
// it comes from the product the merchant picks; nothing without one.
export const schema = {
  label: 'Product spotlight',
  fields: [
    { id: 'label', type: 'text', label: 'Small label' },
    { id: 'product', type: 'product', label: 'Product' },
    { id: 'photo_side', type: 'select', label: 'Photo side', options: ['left', 'right'], default: 'left' },
    { id: 'quick_add', type: 'select', label: 'Add to cart button (products with nothing to choose)', options: ['show', 'hide'], default: 'show' },
  ],
} as const;

export const styles = `
& .mr-spot { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 4fr); gap: var(--uk-space-7) clamp(32px, 7vw, 112px); align-items: end; }
& .mr-spot--right > :first-child { order: 2; }
& .mr-spot-more:hover svg { translate: 4px 0; }
& .mr-spot-more svg { transition: translate .25s ease; }
@media (max-width: 900px) {
  & .mr-spot { grid-template-columns: minmax(0, 1fr); }
  & .mr-spot--right > :first-child { order: 0; }
}
`;

type Props = { t: Translate; site?: SiteInfo; label?: string; product?: ProductData | null; photo_side?: string; quick_add?: string };

export default function ProductSpotlight(p: Props) {
  const { t } = p;
  const item = p.product && typeof p.product === 'object' ? p.product : null;
  if (!item) return null;
  const hidden = pricesHiddenFor(p.site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: p.site?.theme_settings?.apply_page });
  const line = item.description.find((b) => b && b.kind === 'p' && b.text)?.text || item.summary;
  return (
    <section style={{ padding: 'var(--uk-section-md) 0' }}>
      <Container>
        <div className={p.photo_side === 'right' ? 'mr-spot mr-spot--right' : 'mr-spot'}>
          <a href={item.url} aria-hidden="true" tabIndex={-1} style={{ display: 'block', padding: 'clamp(28px, 7vw, 104px)', background: 'var(--uk-color-surface)' }}>
            <span className="uk-media" style={{ display: 'block', aspectRatio: '1 / 1' }}>
              {item.image ? <Image image={item.image} alt="" sizes="(max-width: 900px) calc(100vw - 104px), 520px" /> : <span style={{ display: 'grid', placeItems: 'center', height: '100%', color: 'var(--uk-color-text-subtle)' }}><Icon name="bag" size={56} /></span>}
            </span>
          </a>
          <div style={{ paddingBottom: 'var(--uk-space-3)' }}>
            {p.label ? <p style={{ margin: '0 0 var(--uk-space-4)', fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}>{p.label}</p> : null}
            <h2 className="uk-heading uk-heading--lg" style={{ margin: 0 }}><a href={item.url} style={{ color: 'inherit', textDecoration: 'none' }}>{item.name}</a></h2>
            <p style={{ margin: 'var(--uk-space-3) 0 0', fontSize: 'var(--uk-text-md)', color: 'var(--uk-color-ink)' }}>
              {hidden ? <SignInForPrices pricesHidden={hidden} /> : <Price price={item.price} compare={item.compare_at} labels={{ was: t('product.was'), now: t('product.now') }} />}
            </p>
            {line ? <p style={{ margin: 'var(--uk-space-5) 0 0', maxWidth: '36ch', color: 'var(--uk-color-text-muted)' }}>{line}</p> : null}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--uk-space-4) var(--uk-space-6)', marginTop: 'var(--uk-space-6)' }}>
              {p.quick_add !== 'hide' && !hidden ? <QuickAdd product={item} variant="primary" labels={{ add: t('product.add_to_cart'), choose: '', was: t('product.was'), now: t('product.now'), sold_out: t('product.sold_out') }} /> : null}
              {t('spotlight.view') ? (
                <a className="mr-spot-more" href={item.url} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, paddingBottom: 3, borderBottom: '1px solid currentColor', fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-ink)', textDecoration: 'none' }}>
                  {t('spotlight.view')}
                  <Icon name="arrow" size={14} />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
