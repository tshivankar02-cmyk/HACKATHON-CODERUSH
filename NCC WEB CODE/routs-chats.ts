import { Router, type IRouter } from "express";
import { db, faqsTable } from "@workspace/db";
import { ChatWithBotBody, ChatWithBotResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/chat", async (req, res): Promise<void> => {
  const parsed = ChatWithBotBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const userMessage = parsed.data.message.toLowerCase().trim();
  const faqs = await db.select().from(faqsTable);

  let bestMatch: { question: string; answer: string } | null = null;
  let bestScore = 0;

  for (const faq of faqs) {
    const questionWords = faq.question.toLowerCase().split(/\s+/);
    const messageWords = userMessage.split(/\s+/);

    let matchCount = 0;
    for (const word of messageWords) {
      if (word.length < 3) continue;
      if (questionWords.some((qw) => qw.includes(word) || word.includes(qw))) {
        matchCount++;
      }
    }

    const score = matchCount / Math.max(messageWords.length, 1);
    if (score > bestScore && matchCount >= 1) {
      bestScore = score;
      bestMatch = { question: faq.question, answer: faq.answer };
    }
  }

  if (bestMatch) {
    res.json(
      ChatWithBotResponse.parse({
        reply: bestMatch.answer,
        matchedQuestion: bestMatch.question,
      }),
    );
  } else {
    res.json(
      ChatWithBotResponse.parse({
        reply:
          "I'm sorry, I couldn't find an answer to your question. Please contact the NCC office directly for more information, or try rephrasing your question.",
      }),
    );
  }
});

export default router;
