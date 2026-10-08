export default function Footer() {
  return (
    <footer className="bg-steam-header py-8 text-xs text-steam-muted">
      <section id="about" tabIndex={-1} aria-labelledby="about-h"
        className="mx-auto max-w-(--page-w) scroll-mt-16 px-3 py-2 outline-none">
        <h2 id="about-h" className="mb-1 text-sm font-semibold uppercase tracking-wide text-white">About</h2>
        <p>Freznel is a demo storefront built for the Binaire Private Limited assessment. Prices and discounts are generated for demonstration only.</p>
        <p className="mt-2">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </section>
    </footer>
  );
}