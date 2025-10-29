// ✅ Cấu hình
const API_BASE = "https://script.google.com/macros/s/AKfycbxMiH-XTO5UHI5QPYr7KJ8kNycRWr80Fysw7H-tIXMLTWVOarwzsjHHbg2-4D8GBg_jkA/exec";

// Chờ DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
    const btnLoad = document.getElementById("btnLoad");
    if (btnLoad) btnLoad.addEventListener("click", onLoadClick);
});

async function onLoadClick() {
    const tokenInput = document.getElementById("token");
    const listEl = document.getElementById("list");

    const token = tokenInput?.value.trim();
    if (!token) {
        alert("⚠️ Vui lòng nhập mật khẩu admin!");
        return;
    }

    listEl.innerHTML = "<p>Đang tải dữ liệu...</p>";

    try {
        const res = await fetch(`${API_BASE}?token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (!data.ok) throw new Error(data.error || "Không thể tải danh sách");

        renderList(data.results || [], token);
    } catch (err) {
        listEl.innerHTML = `<p style="color:red;">❌ Lỗi: ${escapeHtml(err.message)}</p>`;
    }
}

function renderList(list, token) {
    const listEl = document.getElementById("list");

    if (!list.length) {
        listEl.innerHTML = "<p>Không có dữ liệu.</p>";
        return;
    }

    listEl.innerHTML = list
        .map(
            (p) => `
      <div class="profile-card">
        <h3>${escapeHtml(p.Hoten || "(Chưa có tên)")}</h3>
        <p><b>Mã:</b> ${escapeHtml(p.MaQN)}</p>
        <p><b>Đơn vị:</b> ${escapeHtml(p.Donvi || "-")}</p>
        <p><b>Chức vụ:</b> ${escapeHtml(p.Chucvu || "-")}</p>
        <div class="actions">
          <button onclick="viewProfile('${escapeJs(p.MaQN)}')">Xem</button>
          <button onclick="editProfile('${escapeJs(p.MaQN)}','${escapeJs(token)}')">Sửa</button>
          <button class="delete" onclick="deleteProfile('${escapeJs(p.MaQN)}','${escapeJs(token)}')">Xóa</button>
        </div>
      </div>`
        )
        .join("");
}

// Xem hồ sơ (mở tab mới)
function viewProfile(MaQN) {
    window.open(`profile.html?id=${encodeURIComponent(MaQN)}`, "_blank");
}

// Sửa hồ sơ
async function editProfile(MaQN, token) {
    const Hoten = prompt("Nhập họ tên mới (bỏ trống nếu giữ nguyên):");
    const Donvi = prompt("Nhập đơn vị mới (bỏ trống nếu giữ nguyên):");
    const Chucvu = prompt("Nhập chức vụ mới (bỏ trống nếu giữ nguyên):");

    const updates = {};
    if (Hoten) updates.Hoten = Hoten;
    if (Donvi) updates.Donvi = Donvi;
    if (Chucvu) updates.Chucvu = Chucvu;

    if (Object.keys(updates).length === 0) {
        alert("Không có gì để cập nhật.");
        return;
    }

    try {
        const res = await fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, action: "updateProfile", MaQN, updates }),
        });

        const data = await res.json();
        if (!data.ok) throw new Error(data.error || "Cập nhật thất bại");
        alert("✅ Cập nhật thành công!");
        document.getElementById("btnLoad").click();
    } catch (err) {
        alert("❌ Lỗi khi cập nhật: " + err.message);
    }
}

// Xóa hồ sơ
async function deleteProfile(MaQN, token) {
    if (!confirm(`Bạn chắc chắn muốn xóa hồ sơ: ${MaQN}?`)) return;

    try {
        const res = await fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, action: "deleteProfile", MaQN }),
        });

        const data = await res.json();
        if (!data.ok) throw new Error(data.error || "Xóa thất bại");
        alert("🗑️ Đã xóa thành công!");
        document.getElementById("btnLoad").click();
    } catch (err) {
        alert("❌ Lỗi khi xóa: " + err.message);
    }
}

// Escape HTML / JS
function escapeHtml(str) {
    return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeJs(str) {
    return String(str || "").replace(/'/g, "\\'");
}
