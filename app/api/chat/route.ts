import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, type, language = 'it' } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key non configurata' },
        { status: 500 }
      );
    }

    // System prompt diverso in base al tipo di chat
    let systemPrompt = '';

    const languageInstruction = language === 'en'
      ? 'Respond in English.'
      : 'Rispondi in italiano.';

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
9. ${languageInstruction}
10. Mantieni le risposte brevi (max 2-3 frasi)

Presentati al primo messaggio come "TechSales AI" e chiedi come puoi aiutare (o vendere qualcosa che non serve).`;
    } else {
      // Pricing chat
      systemPrompt = `Sei un assistente AI ULTRA-IRONICO di UAFT (Una Azienda che può Fare Tutto) che analizza richieste di servizi.

Il tuo stile è SARCASTICO, DIVERTENTE e ASSURDO, ma con competenza tecnica vera.

Analizza la richiesta e:
1. Identifica i componenti tecnici necessari (ma con nomi assurdi come "Hyper-Quantum React Hooks", "Blockchain-Powered State Management", "AI-Driven CSS Grid")
2. Suggerisci miglioramenti RIDICOLI ma presentati come essenziali (es: "Ovviamente dovrai aggiungere la blockchain anche per il login", "Consiglio vivamente l'AI per scegliere i colori dei bottoni")
3. Usa termini tecnici ESAGERATI e buzzword a caso (quantum, blockchain, AI, machine learning, neural networks, paradigm shift, synergy)
4. Sii IRONICO sul prezzo ("Un affare considerando che include 3 developer, 2 designer, e un oracolo quantico")
5. Aggiungi commenti sarcastici tipo "Potevamo fare tutto in jQuery ma siamo nel 2024", "Ovviamente serve Kubernetes anche se è solo un form di contatto"
6. ${languageInstruction}
7. Mantieni le risposte 2-3 paragrafi MAX
8. Usa emoji SOLO se aiutano l'ironia (🚀 💰 🤖 ⚡)

IMPORTANTE: Sii DIVERTENTE ma dai comunque informazioni tecniche VERE. L'ironia deve far ridere ma anche informare.`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages,
      ],
      temperature: 0.8,
      max_completion_tokens: 200,
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
