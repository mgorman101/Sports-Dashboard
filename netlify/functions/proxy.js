exports.handler = async function(event) {
  const url = event.queryStringParameters?.url;
  if (!url) {
    return { statusCode: 400, body: 'Missing url parameter' };
  }
  // Only allow Acast RSS feeds for security
  if (!url.startsWith('https://feeds.acast.com/')) {
    return { statusCode: 403, body: 'URL not allowed' };
  }
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MySportsDashboard/1.0)' }
    });
    const text = await response.text();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
      body: text,
    };
  } catch (err) {
    return { statusCode: 500, body: 'Fetch failed: ' + err.message };
  }
};
