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
    const res = await fetchJson('http://localhost:4000/api/companies/by-hierarchical-category/company-wellness');
    console.dir(res.data, { depth: null });
  } catch(e) {
    console.error(e);
  }
}
debug();
