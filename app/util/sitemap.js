const SitemapGenerator = require('sitemap-generator');

module.exports = () => {
  // create generator
  const generator = SitemapGenerator('https://planagroimoveis.com.br', {
    stripQuerystring: false,
    filepath: './app/public/sitemap.xml',
  });

  generator.on('done', (resul) => {
    console.log('Sitemap atualizado.')
  });

  generator.start();
};