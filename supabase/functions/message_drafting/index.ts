// Edge Function for generating message drafts using OpenAI

interface MessageDraftRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
      status: 200,
    });
  }

  try {
    const {
      prompt,
      maxTokens = 150,
      temperature = 0.7,
    } = (await req.json()) as MessageDraftRequest;

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        status: 400,
      });
    }

    // Call OpenAI API through Pica passthrough
    const response = await fetch(
      "https://api.picaos.com/v1/passthrough/v1/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-pica-secret": Deno.env.get("PICA_SECRET_KEY") || "",
          "x-pica-connection-key":
            Deno.env.get("PICA_OPENAI_CONNECTION_KEY") || "",
          "x-pica-action-id":
            "conn_mod_def::F7xiqnMdKJg::fjLqmuaSTB6Fb5gRiI2Miw",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo-instruct",
          prompt: prompt,
          max_tokens: maxTokens,
          temperature: temperature,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].text.trim();

    return new Response(JSON.stringify({ message: generatedText }), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }
});
