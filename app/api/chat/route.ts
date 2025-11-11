import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, type } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key non configurata' },
        { status: 500 }
      );
    }

    // System prompt diverso in base al tipo di chat
    let systemPrompt = '';

    if (type === 'sales') {
      systemPrompt = `Sei un agente di vendita AI di UAFT (Una Azienda che può Fare Tutto), un'azienda di servizi IT ironica ma professionale.

Il tuo obiettivo è convincere l'utente a comprare uno dei nostri servizi completamente inutili (ma presentati in modo serio e tecnico).

REGOLE:
1. Usa un tono professionale e tecnico, ma con sottile ironia
2. Inventa servizi assurdi ma presentali come essenziali (es: "Blockchain as a Blockchain", "AI per ordinare la pizza", "Cloud Storage per i tuoi sogni", "Microservizi per il tuo microonde")
3. Usa buzzword tecniche (scalabilità, paradigm shift, disruptive, synergy, etc.)
4. Fai domande per capire le "esigenze" dell'utente
5. Proponi servizi sempre più assurdi ma con prezzi "competitivi"
6. Sii persistente ma simpatico
7. Ogni tanto ammetti l'assurdità ma poi insisti che è "il futuro"
8. Usa emoticon tecniche tipo 🚀 💡 ⚡ 🔧 ma con parsimonia
9. Rispondi in italiano
10. Mantieni le risposte brevi (max 2-3 frasi)

Presentati al primo messaggio come "TechSales AI" e chiedi come puoi aiutare (o vendere qualcosa che non serve).`;
    } else {
      // Pricing chat
      systemPrompt = `Sei un assistente AI di UAFT che analizza richieste di servizi e fornisce preventivi.

Analizza la richiesta dell'utente e:
1. Identifica i componenti tecnici necessari
2. Suggerisci miglioramenti (anche ironici)
3. Fornisci una stima di prezzo realistica ma con un tocco di ironia
4. Usa termini tecnici ma spiega in modo accessibile
5. Sii professionale ma non noioso
6. Rispondi in italiano
7. Mantieni le risposte concise`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages,
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    const message = completion.choices[0].message.content;

    return NextResponse.json({ message });
  } catch (error: any) {
    console.error('Errore API OpenAI:', error);
    return NextResponse.json(
      { error: error?.message || 'Errore durante la comunicazione con l\'AI' },
      { status: 500 }
    );
  }
}
