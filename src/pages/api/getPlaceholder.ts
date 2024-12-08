import { getPlaiceholder } from "plaiceholder";
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { poster } = req.query;

  try {
    const response = await fetch(poster);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const buffer = await response.buffer();
    const { base64 } = await getPlaiceholder(buffer, { size: 10 });

    res.status(200).json({ base64 });
  } catch (error) {
    res.status(500).json({ error: "Failed to read file" });
  }
}
