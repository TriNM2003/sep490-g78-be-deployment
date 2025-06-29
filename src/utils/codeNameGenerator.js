function generateCodename(name){
  return name
    .normalize("NFD")                       // Tách dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, "")       // Xoá dấu
    .toLowerCase()                         // Đổi thành chữ thường
    .replace(/[^a-z0-9\s]/g, "")           // Xoá ký tự đặc biệt
    .trim()                                // Xoá khoảng trắng đầu/cuối
    .replace(/\s+/g, "-");                 // Đổi khoảng trắng thành dấu gạch
}


module.exports = generateCodename;