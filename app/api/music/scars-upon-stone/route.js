export async function GET() {
    try {
      const res = await fetch('http://localhost:4000/music/scars-upon-stone');
  
      if (!res.ok) {
        console.error(`Failed to fetch from Express: ${res.status}`);
        return new Response(JSON.stringify({ error: 'Failed to fetch music data' }), { status: 500 });
      }
  
      const data = await res.json();
      console.log('DATA', data);
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (err) {
      console.error('Error proxying to Express:', err);
      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
  }
  