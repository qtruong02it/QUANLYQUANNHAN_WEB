const API_BASE = "https://script.google.com/macros/s/AKfycbyh8K7-60XnDDHhKYbuZ1MqxFTaHkjLuvwFiycS2t2ApypNlaGdwQ28oggy03w2LDykWA/exec"

window.API = {
    /** Lấy toàn bộ hồ sơ (chỉ admin) */
    async getAllProfiles(adminToken) {
        const url = `${API_BASE}?token=${encodeURIComponent(adminToken)}`;
        const res = await fetch(url);
        return res.json();
    },

    /** Lấy hồ sơ theo mã quân nhân */
    async getProfileById(id) {
        const url = `${API_BASE}?id=${encodeURIComponent(id)}`;
        const res = await fetch(url);
        return res.json();
    },

    /** Thêm hồ sơ mới */
    async addProfile(adminToken, row) {
        const body = { token: adminToken, action: "addProfile", row };
        const res = await fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        return res.json();
    },

    /** Cập nhật hồ sơ */
    async updateProfile(adminToken, MaQN, updates) {
        const body = { token: adminToken, action: "updateProfile", MaQN, updates };
        const res = await fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        return res.json();
    },

    /** Xóa hồ sơ */
    async deleteProfile(adminToken, MaQN) {
        const body = { token: adminToken, action: "deleteProfile", MaQN };
        const res = await fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        return res.json();
    },

    /** Thêm nhận xét */
    async addNhanxet(adminToken, row) {
        const body = { token: adminToken, action: "addNhanxet", row };
        const res = await fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        return res.json();
    },

    /** Upload ảnh (Base64) */
    async uploadImage(adminToken, MaQN, base64) {
        const body = { token: adminToken, action: "uploadImage", MaQN, base64 };
        const res = await fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        return res.json();
    },
};