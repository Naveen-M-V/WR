const http = require('http');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function debug() {
  try {
    const d = await fetchJson('http://localhost:4000/api/companies');
    const data = d.data || d;
    
    // Find companies with "wellness" items somewhere
    const companies = data.filter(c => {
      // Check hierarchical
      if (c.hierarchicalProductsServices && JSON.stringify(c.hierarchicalProductsServices).toLowerCase().includes('wellness')) return true;
      
      // Check tabs
      if (c.tabs?.productsServices?.items) {
          return JSON.stringify(c.tabs.productsServices.items).toLowerCase().includes('wellness');
      }
      return false;
    });

    console.log(`Found ${companies.length} companies with 'wellness' in their product/service data`);
    for (const c of companies) {
      console.log(`\nCompany: ${c.companyName} (${c.id})`);
      const items = c.tabs?.productsServices?.items || [];
      const wellnessItems = items.filter(i => JSON.stringify(i).toLowerCase().includes('wellness'));
      console.log('Wellness Items:');
      console.dir(wellnessItems, { depth: null });
    }
  } catch (e) {
    console.error(e);
  }
}
debug();
