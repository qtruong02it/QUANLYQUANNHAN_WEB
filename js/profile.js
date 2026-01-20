// js/profile.js

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const container = document.getElementById("profileContainer");
  const loading = document.getElementById("loading");

  if (!id) {
    container.innerHTML = "<p class='error'> Thiếu mã quân nhân!</p>";
    loading.style.display = "none";
    return;
  }

  try {
    const res = await API.getProfileById(id);
    loading.style.display = "none";

    if (!res.ok || !res.profile) {
      container.innerHTML = `<p class='error'> Không tìm thấy hồ sơ cho mã <b>${id}</b>.</p>`;
      return;
    }

    const p = res.profile;

    // Thông tin cá nhân
    const infoHTML = `
      <div class="card">
        <h2>Hồ sơ quân nhân: ${p.Hoten || "(Chưa có tên)"}</h2>
        <table class="info-table">
          <tr><th>Mã QN</th><td>${p.MaQN}</td></tr>
          <tr><th>Chức vụ</th><td>${p.Chucvu || ""}</td></tr>
          <tr><th>Ngày sinh</th><td>${p.Ngaysinh || ""}</td></tr>
          <tr><th>Quê quán</th><td>${p.Quequan || ""}</td></tr>
          <tr><th>Đơn vị</th><td>${p.Donvi || ""}</td></tr>
          <tr><th>Tổng hợp rèn luyện</th><td>${p.THRenluyen || ""}</td></tr>
        </table>
      </div>
    `;

    // Nhận xét
    const nhanxetHTML = `
      <div class="card">
        <h3>Nhận xét</h3>
        ${p.Nhanxet && p.Nhanxet.length
        ? `<ul class="list">
              ${p.Nhanxet
          .map(
            n => `
                  <li>
                    <strong>${n.Ngaydanhgia || ""}</strong> - ${n.Noidungnhanxet || ""}
                    ${n.Ghichu ? `<br><em>Ghi chú: ${n.Ghichu}</em>` : ""}
                  </li>`
          )
          .join("")}
            </ul>`
        : "<p>Chưa có nhận xét nào.</p>"}
      </div>
    `;

    // Hình ảnh
    const hinhanhHTML = `
      <div class="card">
        <h3>Hình ảnh</h3>
        ${p.Hinhanh && p.Hinhanh.length
        ? p.Hinhanh
          .map(
            h => `
                  <div class="photo-block">
                    ${h.Anhdaidien ? `<img src="${h.Anhdaidien}" alt="Ảnh đại diện">` : ""}
                    ${h.Anhsinhhoat ? `<img src="${h.Anhsinhhoat}" alt="Ảnh sinh hoạt">` : ""}
                    <small>Cập nhật: ${h.Ngaycapnhat || ""}</small>
                  </div>`
          )
          .join("")
        : "<p>Chưa có hình ảnh.</p>"
      }
      </div>
    `;

    container.innerHTML = infoHTML + nhanxetHTML + hinhanhHTML;
  } catch (err) {
    console.error(err);
    loading.style.display = "none";
    container.innerHTML = `<p class='error'>Lỗi tải dữ liệu: ${err.message}</p>`;
  }
});

// const API_URL = "https://script.google.com/macros/s/AKfycbxXYZ123/exec";

// async function loadProfile() {
//     const params = new URLSearchParams(window.location.search);
//     const id = params.get("id");
//     if (!id) {
//         document.getElementById("profile").innerText = "Không tìm thấy hồ sơ!";
//         return;
//     }

//     const res = await fetch(`${API_URL}?action=getOne&id=${id}`);
//     const data = await res.json();

//     if (!data || data.error) {
//         document.getElementById("profile").innerText = "Không tìm thấy quân nhân!";
//         return;
//     }

//     document.getElementById("profile").innerHTML = `
//     <h2>${data.HoTen}</h2>
//     <p><strong>Mã QN:</strong> ${data.MaQN}</p>
//     <p><strong>Chức vụ:</strong> ${data.ChucVu}</p>
//     <p><strong>Ngày sinh:</strong> ${data.NgaySinh}</p>
//     <p><strong>Quê quán:</strong> ${data.QueQuan}</p>
//     <p><strong>Đơn vị:</strong> ${data.DonVi}</p>
//     <p><strong>Tình hình rèn luyện:</strong> ${data.THRenLuyen}</p>
//     <h3>Nhận xét</h3>
//     <ul>
//       ${data.NhanXet.map(n => `<li>${n.NgayDanhGia}: ${n.NoiDungNX}</li>`).join("")}
//     </ul>
//     <h3>Hình ảnh</h3>
//     <div>
//       ${data.HinhAnh.map(h => `<img src="${h.URLAnh}" width="200">`).join("")}
//     </div>
//   `;
// }

// loadProfile();