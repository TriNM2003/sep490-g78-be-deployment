const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPEN_AI_NANO_APIKEY });

const analyzePetWithGPT = async (imageBase64) => {
  const prompt = `
Phân tích ảnh thú cưng sau và trả về kết quả ở dạng **JSON hợp lệ** duy nhất:

{
  "age": "Số tháng tuổi (ví dụ: '6')",
  "weight": "Cân nặng ước lượng (ví dụ: '5')",
  "color": "Màu lông (ví dụ: 'Vàng nâu')",
  "species": "Loài bằng tiếng Việt (ví dụ: 'Chó', 'Mèo')",
  "breed": "Giống (ví dụ: 'Chó ta', 'Phú Quốc')",
  "identificationFeature": "Đặc điểm nổi bật (ví dụ: 'Tai cụp, đuôi cong')"
}

Chỉ trả JSON. Nếu ảnh có nhiều con thú, trả về:
{ "error": "too_many_animals" }
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
              detail: "auto",
            },
          },
        ],
      },
    ],
    max_tokens: 500,
  });

  const text = response.choices[0].message.content;

  // Trích xuất JSON trong response
  const jsonMatch =
    text.match(/```json\s*(\{[\s\S]*?\})\s*```/) || text.match(/\{[\s\S]*?\}/);

  if (!jsonMatch) {
    throw new Error("Không thể trích xuất JSON từ phản hồi GPT");
  }

  try {
    const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);

    // Validate sơ bộ
    const requiredFields = [
      "species",
      "breed",
      "color",
      "identificationFeature",
    ];
    for (const field of requiredFields) {
      if (!parsed[field]) {
        throw new Error(`Thiếu trường bắt buộc: ${field}`);
      }
    }

    return parsed;
  } catch (err) {
    throw new Error("JSON không hợp lệ từ GPT: " + err.message);
  }
};

module.exports = { analyzePetWithGPT };
