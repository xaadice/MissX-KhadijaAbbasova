require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 MongoDB Bağlantısı
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Bağlantısı Başarılı!"))
    .catch(err => console.log("❌ Bağlantı Hatası:", err));

// 1️⃣ KAYIT OL
app.post('/api/register', async (req, res) => {
    try {
        const u = new User(req.body);
        await u.save();
        res.status(201).json(u);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: "Bu e-posta adresi zaten kayıtlı! Lütfen giriş yapın." });
        }
        res.status(400).json({ error: "Kayıt sırasında bir hata oluştu: " + err.message });
    }
});

// 2️⃣ GİRİŞ YAP
app.post('/api/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email, password: req.body.password });
        if (user) {
            res.json(user);
        } else {
            res.status(401).json({ error: "E-posta veya şifre hatalı!" });
        }
    } catch (err) {
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

// 3️⃣ PROFİL BİLGİLERİNİ GÜNCELLE
app.put('/api/users/:id', async (req, res) => {
    try {
        const { name, skills } = req.body;
        const u = await User.findByIdAndUpdate(
            req.params.id,
            { name, skills },
            { new: true }
        );
        if (!u) return res.status(404).json({ error: "Kullanıcı bulunamadı." });
        res.json(u);
    } catch (err) {
        res.status(400).json({ error: "Profil güncellenirken hata oluştu: " + err.message });
    }
});

// 4️⃣ PROFİL SİL
app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Hesap silindi." });
    } catch (err) {
        res.status(500).json({ error: "Silme işlemi başarısız." });
    }
});

// 5️⃣ YENİ İLAN OLUŞTUR
app.post('/api/ads/:userId', async (req, res) => {
    try {
        const u = await User.findById(req.params.userId);
        if (!u) return res.status(404).json({ error: "Kullanıcı bulunamadı." });
        u.ads.push(req.body);
        await u.save();
        res.json(u);
    } catch (err) {
        res.status(400).json({ error: "İlan eklenirken hata oluştu." });
    }
});

// 6️⃣ İLANLARI LİSTELE (TÜM KULLANICILAR)
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Kullanıcılar getirilemedi." });
    }
});

// 7️⃣ İLAN GÜNCELLE
app.put('/api/ads/:userId/:adId', async (req, res) => {
    try {
        const u = await User.findById(req.params.userId);
        if (!u) return res.status(404).json({ error: "Kullanıcı bulunamadı." });

        const ad = u.ads.id(req.params.adId);
        if (!ad) return res.status(404).json({ error: "İlan bulunamadı." });

        if (req.body.title) ad.title = req.body.title;
        if (req.body.description) ad.description = req.body.description;

        await u.save();
        res.json(u);
    } catch (err) {
        res.status(400).json({ error: "İlan güncellenirken hata oluştu: " + err.message });
    }
});

// 8️⃣ İLAN SİL
app.delete('/api/ads/:userId/:adId', async (req, res) => {
    try {
        const u = await User.findById(req.params.userId);
        if (!u) return res.status(404).json({ error: "Kullanıcı bulunamadı." });

        u.ads = u.ads.filter(ad => ad._id.toString() !== req.params.adId);
        await u.save();
        res.json({ message: "İlan silindi.", user: u });
    } catch (err) {
        res.status(500).json({ error: "İlan silinirken hata oluştu." });
    }
});

// 9️⃣ KREDİ TRANSFERİ YAP
app.post('/api/transfer', async (req, res) => {
    try {
        const { fromId, toId } = req.body;
        const sender = await User.findById(fromId);
        const receiver = await User.findById(toId);
        if (!sender || !receiver) return res.status(404).json({ error: "Kullanıcı bulunamadı." });
        if (sender.balance > 0) {
            sender.balance -= 1;
            receiver.balance += 1;
            await sender.save();
            await receiver.save();
            res.json({ message: "Puan transferi başarılı!" });
        } else {
            res.status(400).json({ error: "Yetersiz puan!" });
        }
    } catch (err) {
        res.status(500).json({ error: "Transfer işlemi sırasında hata oluştu." });
    }
});

// 🔟 BAKİYE SORGULA
app.get('/api/users/:id/balance', async (req, res) => {
    try {
        const u = await User.findById(req.params.id);
        if (!u) return res.status(404).json({ error: "Kullanıcı bulunamadı." });
        res.json({ userId: u._id, name: u.name, balance: u.balance });
    } catch (err) {
        res.status(500).json({ error: "Bakiye sorgulanamadı." });
    }
});

// Sunucuyu başlat
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server http://localhost:${PORT} adresinde hazır!`));