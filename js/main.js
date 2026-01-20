const API_URL = "https://script.google.com/macros/s/AKfycbziO9eIiLUgQfW2YY7URL_bKab1lOX7BpkKPZBYdw5LTztFiP5j7gAdGzTpeAOm_nJ8UA/exec";

async function loadQuanNhan() {
    const res = await fetch(API_URL);
    const data = await res.json();

    const list = document.getElementById("list");
    list.innerHTML = "";

    data.forEach(qn => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
        <div class="flag"></div>
        <div class="card-body">
            <h3>${qn.HoTen}</h3>
            <p><strong>Đơn vị:</strong> ${qn.DonVi}</p>
            <a href="profile.html?id=${qn.MaQN}" class="profile-link">Xem hồ sơ</a>
        </div>
        <div class="qr" id="qr-${qn.MaQN}"></div>
        `;

        list.appendChild(div);

        // Trung
        const BASE_URL = "https://qtruong02it.github.io/QUANLYQUANNHAN_WEB";

        // Tạo QR code
        new QRCode(document.getElementById(`qr-${qn.MaQN}`), {
            text: `${BASE_URL}/profile.html?id=${qn.MaQN}`,

            // text: `${window.location.origin}/profile.html?id=${qn.MaQN}`, // lỗi, vì đang dùng ip local, client như điện thoại khác không truy cập được
            width: 100,
            height: 100
        });
    });
}

loadQuanNhan();
