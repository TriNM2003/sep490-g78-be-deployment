const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPEN_AI_NANO_APIKEY });

const analyzePetWithGPT = async (imageBase64) => {
  const prompt = `
Bạn là chuyên gia nhận diện thú cưng. Hãy phân tích ảnh và trả kết quả **chỉ ở dạng JSON**, với các trường sau:

{
  "age": "Số tháng tuổi ước lượng (ví dụ: '6')",
  "weight": "Cân nặng ước lượng theo kg (ví dụ: '5')",
  "color": "Các màu lông chính, cách nhau bởi dấu phẩy (ví dụ: 'Trắng, Nâu')",
  "species": "Loài (ví dụ: 'Chó' hoặc 'Mèo',...)",
  "breed": "Tên giống loài nếu nhận ra (ví dụ: 'Husky', 'Tabby',...)",
  "identificationFeature": "Đặc điểm nhận dạng nổi bật (ví dụ: 'Tai cụp, mắt to')"
}

Chỉ trả JSON hợp lệ, không thêm lời giải thích, không markdown, không văn bản khác.
Hãy xác định thông tin về con thú duy nhất trong ảnh. Nếu ảnh chứa nhiều hơn một con thú, chỉ cần trả về: { error: "too_many_animals" }.

Gợi ý: Nếu không chắc chắn, bạn có thể ghi giá trị gần đúng hoặc null.
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
