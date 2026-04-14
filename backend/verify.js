const http = require('http');
const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function debug() {
  try {
    const resLocal = await fetchJson('http://localhost:4000/api/companies').catch(() => null);
    const resStage = await fetchJson('https://stage.whichrenewables.com/api/companies').catch(() => null);
    
    const d = resLocal || resStage;
    if (!d) return console.log('Could not fetch companies');
    
    const data = d.data || d;
    const withItems = data.filter(c => c.tabs && c.tabs.productsServices && c.tabs.productsServices.items && c.tabs.productsServices.items.length > 0);
    const filtered = withItems.filter(c => c.tabs.productsServices.items.some(i => i.sector && i.sector.toLowerCase().includes('renewable')));
    
    if (filtered.length > 0) {
      const lastWithItems = filtered[filtered.length - 1];
      console.log('Company ID:', lastWithItems._id || lastWithItems.id);
      const items = lastWithItems.tabs.productsServices.items.filter(i => i.sector && i.sector.toLowerCase().includes('renewable'));
      console.dir(items, { depth: null });
    } else {
      console.log('none found. all items:');
      const allItems = withItems.flatMap(c => c.tabs.productsServices.items);
      console.dir(allItems, { depth: null });
    }
  } catch (e) {
    console.error(e);
  }
}
debug();
