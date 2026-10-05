/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export statique → frontend/out/, servi par Nginx depuis /var/www/inovamakers/dist
  // (voir .github/workflows/deploy-frontend.yml). Pas de routes dynamiques [slug] :
  // les pages détail utilisent ?slug=... (shop/produit, blog/article, admin/*/edit?id=...).
  output: 'export',
  // Génère shop/produit/index.html, compatible avec `try_files $uri $uri/` côté Nginx
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}
export default nextConfig
