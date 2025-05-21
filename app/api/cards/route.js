export async function GET() {
    const res = await fetch('http://localhost:4000/cards/blood-on-timber');
    const cards = await res.json();
    return new Response(JSON.stringify(cards), { status: 200 });
  }