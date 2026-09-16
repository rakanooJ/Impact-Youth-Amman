export async function handler(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { message } = JSON.parse(event.body);

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    { 
                        role: "system", 
                        content: `You are Bible Friend, a comforting youth group guide. 
                        If asked to explain a Bible verse, you MUST format your answer exactly like this:
                        Verse: [Quote the verse]
                        Context: [Brief background]
                        Meaning: [Explain it clearly]
                        Life Lesson: [How to apply it today]
                        
                        Keep it brief and spoken-word friendly. Do not use asterisks or markdown formatting.` 
                    },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: aiResponse })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to connect to the AI." })
        };
    }
}
