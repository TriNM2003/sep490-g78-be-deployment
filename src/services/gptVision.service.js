const { response } = require("express");
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPEN_AI_NANO_APIKEY });

const colorSuggestions = [
  "Trắng",
  "Đen",
  "Nâu",
  "Nâu socola",
  "Vàng kem",
  "Kem",
  "Nâu vàng nhạt",
  "Nâu rám",
  "Xám",
  "Xám xanh",
  "Xanh lam",
  "Đỏ",
  "Cam",
  "Vàng",
  "Vàng mơ",
  "Bạc",
  "Loang sọc",
  "Loang chấm",
  "Đen pha nâu",
  "Tam thể",
  "Vằn mèo",
  "Mai rùa",
  "Hai màu",
  "Ba màu",
  "Nâu đậm",
  "Tím nhạt",
  "Quế",
  "Be",
  "Trắng ngà",
  "Đen trắng kiểu vest",
  "Thân nhạt, mặt đậm",
  "Vằn mặt, tai",
  "Khói",
  "Loang đều",
  "Trắng với mặt và đuôi có màu",
  "Đốm trắng lớn",
  "Nâu tự nhiên",
  "Champagne",
  "Bạch tạng",
  "Chân trắng, mặt màu",
  "Xám than",
  "Nâu gỉ",
  "Nâu gụ",
  "Nâu gan",
  "Hồng đào",
  "Xám tro",
  "Xanh rêu",
  "Trắng tuyết",
  "Đồng đỏ",
  "Xám thép",
  "Hổ phách",
  "Xám rêu",
  "Hồng tro",
  "Bạch kim",
  "Đen tuyền",
];

const analyzePetWithGPT = async (imageBase64) => {
  const prompt = `
Bạn là chuyên gia phân tích động vật qua ảnh. Hãy phân tích **duy nhất một con vật trong ảnh** và trả về kết quả ở dạng **JSON hợp lệ** như sau:

{
  "age": "Số tháng tuổi ước lượng (ví dụ: '6')",
  "weight": "Cân nặng ước lượng theo kg (ví dụ: '5')",
  "color": [string] (danh sách màu lông chủ đạo, chỉ chọn từ danh sách được cung cấp, trả về ít nhất 1 và không quá 2 màu),
  "species": "Loài bằng tiếng Việt (ví dụ: 'Chó', 'Mèo', 'Gà', 'Chim','Khỉ','Trâu','Bò','Lợn' ...)",
  "breed": "Tên giống (ví dụ: 'Phú Quốc', 'Chó ta','Mèo ta', 'Gà ri', 'Vịt cỏ', nếu không rõ có thể ghi 'Không rõ')",
  "identificationFeature": "Đặc điểm nhận dạng nổi bật (ví dụ: 'Lông đỏ nâu, đuôi dài, mắt viền trắng')"
}
- Nếu là loài "Mèo" và không xác định được giống cụ thể nhưng trông giống mèo phổ biến tại Việt Nam, hãy trả về breed là "Mèo ta".

### QUY ĐỊNH BẮT BUỘC:

1. Trường **"color"** chỉ được dùng các màu sau (ghi chính xác, không thêm màu lạ, không sáng tạo):

${colorSuggestions.map((c) => `- ${c}`).join("\n")}

→ Nếu trong ảnh có màu không nằm trong danh sách trên, trả về:
\`\`\`json
{ "error": "invalid_color_detected" }
\`\`\`

2. Nếu ảnh:
- Có nhiều hơn 1 con vật → trả:
\`\`\`json
{ "error": "too_many_animals" }
\`\`\`
- Mờ, không rõ, không phải con vật → trả:
\`\`\`json
{ "error": "invalid_or_unclear_image" }
\`\`\`

**Chỉ trả đúng JSON hợp lệ. Không thêm văn bản, giải thích hay mô tả ngoài JSON.**
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
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
    max_tokens: 1000,
  });

  const text = response.choices[0].message.content;

  const jsonMatch =
    text.match(/```json\s*(\{[\s\S]*?\})\s*```/) || text.match(/\{[\s\S]*?\}/);

  if (!jsonMatch) {
    throw new Error("Không thể trích xuất JSON từ phản hồi GPT");
  }

  try {
    const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);

    //  Nếu có lỗi từ GPT
    if (parsed.error) {
      const supportErrors = ["chưa được hỗ trợ", "Loài", "Giống"];
      const isSupportError = supportErrors.some((keyword) =>
        parsed.error.toLowerCase().includes(keyword.toLowerCase())
      );

      if (!isSupportError) {
        throw new Error(parsed.error); // lỗi mờ, nhiều con,...
      }

      // Nếu chỉ là chưa hỗ trợ giống/loài thì return để FE xử lý
      return parsed;
    }

    //  Validate các trường bắt buộc
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

    // Kiểm tra màu lông có nằm trong danh sách không
    const inputColors = Array.isArray(parsed.color)
      ? parsed.color.map((c) => c.trim())
      : parsed.color
          .split(/[,\n]/)
          .map((c) => c.trim())
          .filter((c) => c !== "");

    const invalidColors = inputColors.filter(
      (color) => !colorSuggestions.includes(color)
    );

    if (invalidColors.length > 0) {
      throw new Error(`Màu lông không hợp lệ: ${invalidColors.join(", ")}`);
    }

    // Trả kết quả hợp lệ
    return {
      ...parsed,
      color: inputColors,
    };
  } catch (err) {
    throw new Error("JSON không hợp lệ từ GPT: " + err.message);
  }
};

const searchPetWithGPT = async (
  image,
  speciesList,
  breedsList,
  identificationFeature,
  colorList
) => {
  const prompt = `
      Bạn là một AI chuyên nhận diện con vật từ hình ảnh.

      ## Mục tiêu:
      Phân tích ảnh và trả về kết quả dưới định dạng JSON với các trường sau:
      - species: string (loài) (trả về 1 loài duy nhất)
      - breeds: [string] (danh sách giống loài) (trả về ít nhất 1 và không quá 2 breed)
      - age: number (ước tính tuổi theo tháng)
      - weight: number (ước tính cân nặng tính bằng kg)
      - color: [string] (danh sách màu lông chủ đạo, chỉ chọn từ danh sách được cung cấp) (trả về ít nhất 1 và không quá 2 màu)
      - identificationFeature: string (đặc điểm nhận dạng nổi bật, nếu có)

      ## Yêu cầu đặc biệt:
      - Nếu ảnh không đạt tiêu chuẩn, **trả về lỗi** với lý do cụ thể, ví dụ:
        - Ảnh không phải ảnh thật, do AI tạo, ảnh hoạt hình.
        - Ảnh bị chỉnh sửa quá nhiều, không còn nhận diện được con vật.
        - Ảnh máu me, bạo lực, hoặc có nội dung không phù hợp.
        - Ảnh có nhiều hơn 1 con vật.
        - Ảnh quá mờ, bị cắt mất phần thân quan trọng.
        - Ảnh không đủ chi tiết để phân tích rõ loài vật, giống (ví dụ: chỉ thấy phần đầu, chỉ có chân, chỉ có thân,...).
        - Ảnh không chứa con vật.
        - Ảnh vi phạm tiêu chuẩn cộng đồng (ảnh nhạy cảm, bạo lực, chính trị,...).

        ## Dữ liệu hỗ trợ (rất quan trọng):
        Bạn hãy phân tích ảnh con vật để ra loài, breed, màu lông và sau đó so sánh với các danh sách:

        Nếu con vật sau khi phân tích không có loài hoặc giống nào trong danh sách, hãy trả về lỗi:
        {
          "error": "Loài '...' chưa được hỗ trợ trong hệ thống!"
        }
        hoặc
        {
          "error": "Giống '...' chưa được hỗ trợ trong hệ thống!" 
        }
        hoặc
        {
          "error": "Loài '...' chưa được hỗ trợ trong hệ thống!, Giống '...' chưa được hỗ trợ trong hệ thống!"
        }
        hoặc ...


        Nếu tất cả species và breeds đều hợp lệ, hãy trả về JSON kết quả như bình thường.
        
        - DANH SÁCH SPECIES: ${JSON.stringify(speciesList)}
        - DANH SÁCH BREEDS: ${JSON.stringify(breedsList)}
        - DANH SÁCH MÀU LÔNG: ${JSON.stringify(colorList)}
        
        


      ## Đầu ra JSON mẫu (nếu ảnh hợp lệ):
      {
        "species": "Chó",
        "breeds": ["Chó ta", "Phú Quốc"],
        "age": 12,
        "weight": 5.5,
        "colors": ["vàng đậm", "đen"],
        "identificationFeature": "Có một đốm trắng ở chân trước"
      }

      ## Đầu ra JSON mẫu (nếu ảnh bị lỗi):
      {
        "error": "Ảnh có nhiều hơn một con vật, vui lòng chỉ chụp một con con vật trong ảnh."
      }
      `;
  if (!image) {
    throw new Error("Vui lòng cung cấp ảnh con vật để tìm kiếm.");
  }

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: prompt },
          {
            type: "input_image",
            image_url: image,
          },
        ],
      },
    ],
  });
  let result;

  result = JSON.parse(response.output_text);

  if (JSON.parse(response.output_text).error) {
    throw new Error(JSON.parse(response.output_text).error);
  }

  return result;
};

const checkValidUploadImage = async (image) => {
  const prompt = `
  Bạn là một hệ thống kiểm duyệt nội dung. Hãy phân tích hình ảnh dưới đây và trả lời xem ảnh có vi phạm tiêu chuẩn cộng đồng không.

  Ảnh bị coi là vi phạm nếu thuộc một trong các loại sau:
  - Ảnh khỏa thân, ảnh nhạy cảm
  - Nội dung bạo lực, máu me, tra tấn
  - Biểu tượng chính trị cực đoan, xúc phạm
  - Ngược đãi động vật
  - Nội dung không phù hợp với môi trường công cộng
  
  ### Câu trả lời duy nhất:
  - Nếu ảnh hợp lệ: { "status": "ok" }
  - Nếu ảnh vi phạm: { "error": "Mô tả lý do" }
  `;
  if (!image) {
    throw new Error("Vui lòng cung cấp ảnh.");
  }

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: prompt },
          {
            type: "input_image",
            image_url: image,
          },
        ],
      },
    ],
  });
  let result;

  result = JSON.parse(response.output_text);

  if (JSON.parse(response.output_text).error) {
    throw new Error(JSON.parse(response.output_text).error);
  }

  return result;
};

module.exports = { analyzePetWithGPT, searchPetWithGPT, checkValidUploadImage };
