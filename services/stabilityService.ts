/**
 * Calls Stability AI Stable Audio 2 API
 */
export const generateAudio = async (
  prompt: string,
  duration: number,
  apiKey: string
): Promise<Blob> => {
  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('duration', duration.toString());
  formData.append('seed', '0'); // 0 = random in some APIs, or specific seed
  formData.append('steps', '50');
  formData.append('cfg_scale', '7.0');
  formData.append('output_format', 'mp3');
  formData.append('model', 'stable-audio-2');

  // Stability API requires "image" field to be null for text-to-audio if using that specific endpoint structure
  // technically requests.post(files={"image": None}) in python means no image part.
  // In JS FormData, we just don't append 'image'.

  const response = await fetch(
    "https://api.stability.ai/v2beta/audio/stable-audio-2/text-to-audio",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "audio/*",
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Stability API Error (${response.status}): ${errorText}`);
  }

  const blob = await response.blob();
  return blob;
};