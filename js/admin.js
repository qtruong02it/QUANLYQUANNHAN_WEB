// Kiểm tra DOM sẵn sàng (nếu bạn include file ở bottom của body thì không cần)
document.addEventListener("DOMContentLoaded", () => {
    const btnLoad = document.getElementById("btnLoad");
    if (btnLoad) {
        btnLoad.addEventListener("click", onLoadClick);
    }
});

async function onLoadClick() {
    const tokenInput = document.getElementById("token");
    const listEl = document.getElementById("list");

    const token = tokenInput ? tokenInput.value.trim() : "";
    if (!token) {
        alert("Vui lòng nhập admin token!");
        return;
    }

    listEl.innerHTML = "<p>Đang tải dữ liệu...</p>";

    try {
        // Cú pháp đúng: dùng template literal để nối URL
        const res = await fetch(`${API_BASE}?token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (!data.ok) throw new Error(data.error || "Không thể tải danh sách");

        // Render danh sách
        const html = (data.results || [])
            .map(
                (p) => `
        <div class="card">
          <b>${escapeHtml(p.Hoten) || "(Chưa có tên)"}</b>
          <span style="margin-left:8px">(${escapeHtml(p.MaQN)}) - ${escapeHtml(p.Donvi || "")}</span>
          <div style="margin-top:8px">
            <button onclick="viewProfile('${escapeJs(p.MaQN)}')">Xem</button>
            <button onclick="editProfile('${escapeJs(p.MaQN)}', '${escapeJs(token)}')">Sửa</button>
            <button onclick="deleteProfile('${escapeJs(p.MaQN)}', '${escapeJs(token)}')">Xóa</button>
          </div>
        </div>`
            )
            .join("");

        listEl.innerHTML = html || "<p>Không có dữ liệu</p>";
    } catch (err) {
        listEl.innerHTML = `<p style="color:red;">Lỗi: ${escapeHtml(err.message || String(err))}</p>`;
    }
}

// Mở trang profile (mở tab mới)
function viewProfile(MaQN) {
    window.open(`profile.html?id=${encodeURIComponent(MaQN)}`, "_blank");
}

// Sửa hồ sơ (ví dụ đơn giản dùng prompt)
async function editProfile(MaQN, token) {
    const Hoten = prompt("Cập nhật họ tên (để trống nếu không đổi):");
    const Donvi = prompt("Cập nhật đơn vị (để trống nếu không đổi):");
    const Chucvu = prompt("Cập nhật chức vụ (để trống nếu không đổi):");

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
        alert("Đã cập nhật!");
        document.getElementById("btnLoad").click();
    } catch (err) {
        alert("Lỗi khi cập nhật: " + (err.message || err));
    }
}

// Xóa hồ sơ
async function deleteProfile(MaQN, token) {
    if (!confirm("Xác nhận xóa hồ sơ " + MaQN + "?")) return;

    try {
        const res = await fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, action: "deleteProfile", MaQN }),
        });
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || "Xóa thất bại");
        alert("Đã xóa!");
        document.getElementById("btnLoad").click();
    } catch (err) {
        alert("Lỗi khi xóa: " + (err.message || err));
    }
}

// Helper: escape HTML để an toàn khi inject string
function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Helper: escape string khi chèn vào onclick JS string literal
function escapeJs(str) {
    if (str == null) return "";
    return String(str).replace(/'/g, "\\'");
}