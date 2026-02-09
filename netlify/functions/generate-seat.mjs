export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: { message: 'Method not allowed' } }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: 'OpenAI API key not configured on server' } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let payload;
  try {
    payload = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: { message: 'Invalid JSON body' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { prompt, referenceImage } = payload;
  if (!prompt) {
    return new Response(JSON.stringify({ error: { message: 'Missing prompt' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Stream response to bypass function timeout (10s/26s limit doesn't apply to streaming)
  const { readable, writable } = new TransformStream();

  (async () => {
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Heartbeat keeps connection alive during long OpenAI processing
    const heartbeat = setInterval(() => {
      writer.write(encoder.encode(' ')).catch(() => clearInterval(heartbeat));
    }, 5000);

    try {
      // Try Responses API with reference image first
      let response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          input: [{
            role: 'user',
            content: [
              { type: 'input_image', image_url: referenceImage },
              {
                type: 'input_text',
                text: 'Edit this car seat photo. ' + prompt + ' Keep the exact same seat shape, angle, and perspective as the reference photo. Only change the colors and details described.'
              }
            ]
          }],
          tools: [{ type: 'image_generation', quality: 'high', size: '1024x1536' }],
          tool_choice: 'required'
        })
      });

      // If 403 (image_generation tool not available), fall back to generations
      if (response.status === 403) {
        response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-image-1',
            prompt: prompt,
            n: 1,
            size: '1024x1536',
            quality: 'high',
            output_format: 'png'
          })
        });
      }

      const data = await response.text();
      clearInterval(heartbeat);
      await writer.write(encoder.encode(data));
    } catch (err) {
      clearInterval(heartbeat);
      await writer.write(encoder.encode(
        JSON.stringify({ error: { message: 'Server error: ' + err.message } })
      ));
    } finally {
      await writer.close();
    }
  })();

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain' }
  });
};
