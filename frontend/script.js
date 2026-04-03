const API = 'https://missx-khadijaabbasova.onrender.com';

let currentUser = null;

// ── YARDIMCI: Modal aç/kapat ─────────────────────────────────────────────────
function modalAc(id) {
    document.getElementById(id).classList.add('active');
}
function modalKapat(id) {
    document.getElementById(id).classList.remove('active');
}

// 1) KAYIT OL ─────────────────────────────────────────────────────────────────
async function kayitOl() {
    const name = prompt("Ad Soyad giriniz:");
    if (!name) return;

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`${API}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, skills: ["Genel"], balance: 5 })
    });

    const data = await res.json();
    if (res.ok) {
        alert("Kayıt Başarılı! Şimdi Giriş Yapabilirsiniz.");
    } else {
        alert(data.error || "Kayıt başarısız!");
    }
}

// 2) GİRİŞ YAP ────────────────────────────────────────────────────────────────
async function girisYap() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
        currentUser = data;
        currentUser.password = password;

        document.getElementById('auth-area').style.display = 'none';
        document.getElementById('user-area').style.display = 'block';
        document.getElementById('welcome').innerText = "Hoş geldin, " + currentUser.name;
        document.getElementById('my-balance').innerText = currentUser.balance;
        yetenekleriGetir();
    } else {
        alert(data.error || "Giriş Başarısız!");
    }
}

// 3) PROFİL GÜNCELLE MODAL AÇ ─────────────────────────────────────────────────
function profilGuncelleModal() {
    document.getElementById('new-name').value = currentUser.name || '';
    document.getElementById('new-skills').value = (currentUser.skills || []).join(', ');
    modalAc('profilModal');
}

// 3) PROFİL GÜNCELLE ──────────────────────────────────────────────────────────
async function profilGuncelle() {
    const name = document.getElementById('new-name').value.trim();
    const skillsRaw = document.getElementById('new-skills').value;
    const skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);

    if (!name) return alert("İsim boş olamaz!");

    const res = await fetch(`${API}/api/users/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, skills })
    });

    const data = await res.json();
    if (res.ok) {
        currentUser = { ...data, password: currentUser.password };
        document.getElementById('welcome').innerText = "Hoş geldin, " + currentUser.name;
        modalKapat('profilModal');
        alert("Profil güncellendi!");
        yetenekleriGetir();
    } else {
        alert(data.error || "Güncelleme başarısız!");
    }
}

// 4) PROFİL SİL ───────────────────────────────────────────────────────────────
async function profilSil() {
    if (confirm("Emin misiniz? Hesabınız kalıcı olarak silinecektir.")) {
        const res = await fetch(`${API}/api/users/${currentUser._id}`, { method: 'DELETE' });
        if (res.ok) {
            alert("Hesabınız silindi.");
            location.reload();
        }
    }
}

// 5) YENİ İLAN OLUŞTUR ────────────────────────────────────────────────────────
async function ilanVer() {
    if (!currentUser) return alert("Lütfen önce giriş yapın!");
    const title = document.getElementById('ad-title').value;
    if (!title) return alert("Lütfen bir ilan başlığı yazın!");

    const res = await fetch(`${API}/api/ads/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: "Hizmet veriyorum" })
    });

    if (res.ok) {
        alert("İlan Yayınlandı!");
        document.getElementById('ad-title').value = "";
        yetenekleriGetir();
    }
}

// 6) İLANLARI LİSTELE ─────────────────────────────────────────────────────────
async function yetenekleriGetir() {
    const res = await fetch(`${API}/api/users`);
    const users = await res.json();
    const listDiv = document.getElementById('userList');

    listDiv.innerHTML = users.map(user => {
        const isMe = currentUser && currentUser._id === user._id;

        const ilanlarHTML = user.ads.length > 0
            ? user.ads.map(ad => `
                <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; padding:8px 12px; border-radius:10px; margin:6px 0;">
                    <span style="font-size:13px; color:#334155;">📌 ${ad.title}</span>
                    ${isMe ? `
                        <div style="display:flex; gap:6px;">
                            <button onclick="ilanGuncelleModal('${ad._id}','${ad.title}','${ad.description || ''}')"
                                style="background:#e0e7ff; color:#4f46e5; border:none; padding:4px 10px; border-radius:8px; cursor:pointer; font-size:12px; font-weight:600;">
                                ✏️
                            </button>
                            <button onclick="ilanSil('${ad._id}')"
                                style="background:#fee2e2; color:#ef4444; border:none; padding:4px 10px; border-radius:8px; cursor:pointer; font-size:12px; font-weight:600;">
                                🗑️
                            </button>
                        </div>
                    ` : ''}
                </div>
            `).join('')
            : '<p style="color:#94a3b8; font-size:13px; margin:6px 0;">Henüz ilan yok</p>';

        return `
        <div class="user-card" style="border:1px solid #e2e8f0; padding:20px; margin-top:15px; border-radius:16px; background:white; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <strong style="font-size:17px; color:#1e293b;">${user.name}</strong>
                <span style="font-size:13px; background:#dcfce7; color:#22c55e; padding:4px 12px; border-radius:20px; font-weight:bold;">
                    ${user.balance} Puan
                </span>
            </div>

            <p style="margin:4px 0; color:#64748b; font-size:13px;">🎯 <strong>Yetenekler:</strong> ${(user.skills || []).join(', ') || '-'}</p>

            <div style="margin:10px 0;">
                <p style="font-size:13px; font-weight:600; color:#475569; margin-bottom:4px;">🔍 İlanlar:</p>
                ${ilanlarHTML}
            </div>

            <div style="margin-top:12px; padding-top:12px; border-top:1px solid #f1f5f9;">
                <p style="margin-bottom:10px; font-size:13px; color:#475569;">📧 <strong>E-posta:</strong> ${user.email}</p>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    ${!isMe ? `
                        <a href="mailto:${user.email}?subject=TalentLoop İş Birliği Teklifi"
                           style="background:#22c55e; color:white; padding:8px 14px; text-decoration:none; border-radius:10px; font-size:13px; font-weight:600; display:inline-flex; align-items:center;">
                           ✉️ Mesaj Gönder
                        </a>
                        <button onclick="transfer('${user._id}')"
                           style="background:#4f46e5; color:white; border:none; padding:8px 14px; border-radius:10px; cursor:pointer; font-size:13px; font-weight:600;">
                           💸 1 Puan Gönder
                        </button>
                    ` : `
                        <span style="color:#94a3b8; font-size:13px; font-style:italic; padding:8px 0;">✨ Bu sizin profiliniz</span>
                    `}
                </div>
            </div>
        </div>`;
    }).join('');
}

// 7) İLAN GÜNCELLE MODAL AÇ ───────────────────────────────────────────────────
function ilanGuncelleModal(adId, title, description) {
    document.getElementById('edit-ad-id').value = adId;
    document.getElementById('edit-ad-title').value = title;
    document.getElementById('edit-ad-description').value = description;
    modalAc('ilanModal');
}

// 7) İLAN GÜNCELLE ────────────────────────────────────────────────────────────
async function ilanGuncelle() {
    const adId = document.getElementById('edit-ad-id').value;
    const title = document.getElementById('edit-ad-title').value.trim();
    const description = document.getElementById('edit-ad-description').value.trim();

    if (!title) return alert("Başlık boş olamaz!");

    const res = await fetch(`${API}/api/ads/${currentUser._id}/${adId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
    });

    if (res.ok) {
        modalKapat('ilanModal');
        alert("İlan güncellendi!");
        yetenekleriGetir();
    } else {
        const data = await res.json();
        alert(data.error || "Güncelleme başarısız!");
    }
}

// 8) İLAN SİL ─────────────────────────────────────────────────────────────────
async function ilanSil(adId) {
    if (!confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;

    const res = await fetch(`${API}/api/ads/${currentUser._id}/${adId}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        alert("İlan silindi!");
        yetenekleriGetir();
    } else {
        const data = await res.json();
        alert(data.error || "Silme başarısız!");
    }
}

// 9) KREDİ TRANSFERİ YAP ──────────────────────────────────────────────────────
async function transfer(toId) {
    if (!currentUser) return alert("Lütfen önce giriş yapın!");

    const res = await fetch(`${API}/api/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromId: currentUser._id, toId })
    });

    const data = await res.json();
    if (res.ok) {
        alert("Puan Transfer Edildi!");
        await bakiyeSorgula();
        yetenekleriGetir();
    } else {
        alert(data.error || "Transfer başarısız!");
    }
}

// 10) BAKİYE SORGULA ──────────────────────────────────────────────────────────
async function bakiyeSorgula() {
    if (!currentUser) return;

    const res = await fetch(`${API}/api/users/${currentUser._id}/balance`);
    if (res.ok) {
        const data = await res.json();
        currentUser.balance = data.balance;
        document.getElementById('my-balance').innerText = data.balance;
    }
}