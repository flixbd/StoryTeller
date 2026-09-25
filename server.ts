import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Shared server-side Gemini client as per gemini-api skill
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API endpoint to generate complete Bengali Classics Audio Script in Arnab's style
app.post('/api/stories/generate', async (req: Request, res: Response) => {
  try {
    const { title, author, contextPrompt, theme } = req.body;

    const systemPrompt = `You are a master Bengali literary audio-play director and storyteller in the exact style of '@BengaliClassicsByArnab' (Bengali Classics by Arnab).
The hallmark of this style is:
1. Deeply philosophical and introspective opening (স্বগত ভাষণ ও দার্শনিক ভূমিকা) by the narrator or author, connecting a tangible scene or sensory detail (a misty pond at dawn, shivering bamboo leaves, falling autumn fog, an old door latch, fading lantern, smell of damp soil) to the human soul, fate, memory, and the core emotional dilemma of the story.
2. Rich, evocative metaphors (অনবদ্য উপমা ও দৃশ্যকল্প) that touch the listener's heart and paint cinema inside the mind.
3. Designed specifically for a versatile solo voice storyteller (একক কথকের বহুমুখী কণ্ঠ) who shifts vocal tonality, pitch, and timbre for different characters (narrator, protagonist, cold proud antagonist, loving gentle wife, desperate peasant, arrogant landlord/manager, etc.).
4. Detailed Sound FX (প্রকৃতির সজীব শব্দসজ্জা, পদশব্দ, দরজার আওয়াজ, বৃষ্টির শব্দ) and Music cues (সেতার, বাঁশি, পিয়ানো, বিষাদময় ভায়োলিন).
5. Psychological and literary conclusion (মনস্তাত্ত্বিক উপসংহার ও সাহিত্যিক বিশ্লেষণ).

Return ONLY valid JSON with this exact structure:
{
  "title": "string (বাংলায় গল্প ও নাট্যরূপের শিরোনাম)",
  "author": "string (মূল লেখক)",
  "dramatization": "অডিও ড্রামা ফরম্যাট | Bengali Classics by Arnab অনুকরণে",
  "theme": "string (গল্পের মূলসুর)",
  "style": "একক গল্পকথকের বহুমুখী ও নাটকীয় কণ্ঠ",
  "characters": [
    { "name": "চরিত্রের নাম", "voiceDescription": "কথকের কণ্ঠের ধরন ও বাচনভঙ্গি" }
  ],
  "acts": [
    {
      "actNumber": 1,
      "actTitle": "পর্ব ১: শিরোনাম",
      "sfx": "শব্দ পরিকল্পনা ও আবহ বর্ণনা",
      "bgm": "বাদ্যযন্ত্রের সুর ও মেজাজ",
      "narratorTone": "কথকের বাচনভঙ্গি নির্দেশিকা",
      "scenes": [
        {
          "speaker": "কথক" or "চরিত্রের নাম",
          "emotion": "কণ্ঠের আবেগ/ভঙ্গি (e.g. গম্ভীর ও অন্তর্মুখী, তরুণ বয়সের আকুল কণ্ঠে, হিমশীতল ও অহংকারী)",
          "text": "বাংলায় চমৎকার সাহিত্যিক সংলাপ বা বর্ণনার বাক্যগুলো",
          "sfxCue": "ঐচ্ছিক তাৎক্ষণিক শব্দ সংকেত"
        }
      ]
    }
  ],
  "epilogue": {
    "literaryAnalysis": "গল্পের সাহিত্যিক ও মনস্তাত্ত্বিক তাৎপর্য (আর্নবের স্টাইলে অন্তিম বিশ্লেষণ)",
    "closingBGM": "ধীর ও বিষাদময় সমাপ্তি সুর"
  }
}`;

    const promptText = `Please write a comprehensive audio story script for the classic Bengali story: "${title || 'একটি কালজয়ী বাংলা ছোটগল্প'}" by "${author || 'বাংলা সাহিত্যের প্রথিতযশা কথাশিল্পী'}".
Context / Instructions: ${contextPrompt || 'গল্পের সূচনা হবে একজন চিন্তাশীল কথকের মনের গভীর ভাবনার সাথে কোনো একটি বিষাদময় বা অর্থবহ প্রাকৃতিক দৃশ্যের উপমার মেলবন্ধন ঘটিয়ে।'}.
Theme: ${theme || 'জীবন, ভালোবাসা, অহংকার এবং আত্মমর্যাদা'}.

Ensure deep poetic Bengali prose, vivid imagery, evocative metaphors, and voice directions for solo audio storytelling.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.8,
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, story: parsed });
  } catch (error: any) {
    console.error('Error generating story script:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate story script',
    });
  }
});

// API endpoint to generate deep literary/voice commentary
app.post('/api/stories/analyze', async (req: Request, res: Response) => {
  try {
    const { storyTitle, excerpt } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `গল্প: "${storyTitle}"\nপাঠ্যাংশ: "${excerpt}"\n\nঅনুগ্রহ করে '@BengaliClassicsByArnab' ধারার একজন বিশিষ্ট সাহিত্য সমঝদার ও অডিও কথকের দৃষ্টিকোণ থেকে এই গল্পের দৃশ্যপট, উপমার জাদু, চরিত্রের অন্তর্দ্বন্দ্ব এবং বাচনভঙ্গির রূপান্তর নিয়ে একটি গভীর মনস্তাত্ত্বিক ও সাহিত্যিক বিশ্লেষণ লিখুন।`,
      config: {
        systemInstruction: 'You are an insightful Bengali literary critic and master audio voice actor.',
        temperature: 0.7,
      },
    });

    return res.json({ success: true, analysis: response.text });
  } catch (error: any) {
    console.error('Error analyzing story:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Analysis failed' });
  }
});

// API endpoint for Gemini Text-To-Speech with high-fidelity Bengali pronunciation
app.post('/api/tts/generate', async (req: Request, res: Response) => {
  try {
    const {
      text,
      voiceName = 'Fenrir',
      characterKey = 'narrator',
      emotion = 'গম্ভীর ও প্রজ্ঞাপূর্ণ',
      speaker = 'কথক',
    } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, error: 'Text is required' });
    }

    // Bengli storyteller style prompt tailored for dramatic cadence, emotional depth, and clear diction
    let styleDirective = 'Eloquent, native Bengali master audio storyteller with clear, authentic pronunciation, natural literary cadence, and deep emotional sensitivity.';
    
    if (characterKey === 'narrator') {
      styleDirective = 'Wise, introspective Bengali literary narrator speaking with measured pacing, warm resonant timbre, and poetic gravitas like an audio drama master.';
    } else if (characterKey === 'nishith') {
      styleDirective = 'Reflective Bengali young scholar/teacher, speaking with dignified emotion, gentle warmth, and poignant sincerity.';
    } else if (characterKey === 'nabanita') {
      styleDirective = 'Proud, defiant Bengali woman with aristocratic dignity, crisp clear enunciation, and cold, uncompromising resolve.';
    } else if (characterKey === 'minati') {
      styleDirective = 'Loving, peaceful, and tender Bengali wife speaking with soft, melodious warmth and humble contentedness.';
    } else if (characterKey === 'nirmal') {
      styleDirective = 'Harsh, commanding, and arrogant Bengali estate manager speaking with stern authority and harsh dismissal.';
    } else if (characterKey === 'proja') {
      styleDirective = 'Desperate, trembling, and plaintive Bengali villager pleading with raw vulnerability.';
    }

    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text,
              speechMetadata: {
                speaker: speaker,
                style: `${styleDirective} Expressing emotion: ${emotion}. Speak in pure, fluent, natural Bengali diction with poetic pauses.`,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(502).json({ success: false, error: 'Audio generation yielded no data' });
    }

    return res.json({
      success: true,
      audioBase64: base64Audio,
      sampleRate: 24000,
      mimeType: 'audio/pcm;rate=24000',
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Text to speech failed',
    });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Storyteller server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
