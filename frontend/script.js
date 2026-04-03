const API = 'https://missx-khadijaabbasova.onrender.com';

let currentUser = null;

// 1) KAYIT OL
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

// 2) GİRİŞ YAP
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

// 3) İLAN YAYINLA
async function ilanVer() {
    if(!currentUser) return alert("Lütfen önce giriş yapın!");
    const title = document.getElementById('ad-title').value;
    if(!title) return alert("Lütfen bir ilan başlığı yazın!");

    const res = await fetch(`${API}/api/ads/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: "Hizmet veriyorum" })
    });

    if(res.ok) {
        alert("İlan Yayınlandı!");
        document.getElementById('ad-title').value = "";
        yetenekleriGetir(); 
    }
}

// 4) KEŞFET: TÜM KULLANICILAR VE İLANLAR
async function yetenekleriGetir() {
    const res = await fetch(`${API}/api/users`);
    const users = await res.json();
    const listDiv = document.getElementById('userList');
    
    listDiv.innerHTML = users.map(user => {
        const isMe = currentUser && currentUser._id === user._id;

        return `
        <div class="user-card" style="border: 1px solid #e2e8f0; padding: 20px; margin-top: 15px; border-radius: 16px; background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); font-family: sans-serif;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong style="font-size: 17px; color: #1e293b;">${user.name}</strong>
                <span class="balance-badge" style="font-size: 13px; background: #dcfce7; color: #22c55e; padding: 4px 12px; border-radius: 20px; font-weight: bold;">
                    ${user.balance} Puan
                </span>
            </div>
            
            <p style="margin: 8px 0; color: #64748b; font-size: 14px;">
                <strong>🔍 İlanlar:</strong> ${user.ads.map(a => a.title).join(', ') || 'Henüz ilan yok'}
            </p>
            
            <div style="margin-top: 15px; padding-top: 12px; border-top: 1px solid #f1f5f9;">
                <p style="margin-bottom: 10px; font-size: 13px; color: #475569;">📧 <strong>E-posta:</strong> ${user.email}</p>
                
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    ${!isMe ? `
                        <a href="mailto:${user.email}?subject=TalentLoop İş Birliği Teklifi" 
                           style="background: #22c55e; color: white; padding: 8px 14px; text-decoration: none; border-radius: 10px; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center;">
                           ✉️ Mesaj Gönder
                        </a>
                        
                        <button onclick="transfer('${user._id}')" 
                           style="background: #4f46e5; color: white; border: none; padding: 8px 14px; border-radius: 10px; cursor: pointer; font-size: 13px; font-weight: 600;">
                           💸 1 Puan Gönder
                        </button>
                    ` : `
                        <span style="color: #94a3b8; font-size: 13px; font-style: italic; padding: 8px 0;">✨ Bu sizin profiliniz</span>
                    `}
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// 5) PUAN TRANSFERİ
async function transfer(toId) {
    if(!currentUser) return alert("Lütfen önce giriş yapın!");
    
    const res = await fetch(`${API}/api/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromId: currentUser._id, toId })
    });

    const data = await res.json();

    if (res.ok) { 
        alert("Puan Transfer Edildi!"); 
        
        const refresh = await fetch(`${API}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUser.email, password: currentUser.password })
        });

        if(refresh.ok) {
            currentUser = await refresh.json();
            currentUser.password = document.getElementById('password').value;
            document.getElementById('my-balance').innerText = currentUser.balance;
        }
        yetenekleriGetir(); 
    } else {
        alert(data.error || "Transfer başarısız!");
    }
}

// 6) PROFİL SİL
async function profilSil() {
    if(confirm("Emin misiniz? Hesabınız kalıcı olarak silinecektir.")) {
        const res = await fetch(`${API}/api/users/${currentUser._id}`, { method: 'DELETE' });
        if(res.ok) {
            alert("Hesabınız silindi.");
            location.reload();
        }
    }
}