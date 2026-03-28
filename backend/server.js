const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 MongoDB Bağlantısı
const MONGO_URI = 'mongodb+srv://abbasova:Xedice123@cluster0.vdn5jyu.mongodb.net/?appName=Cluster0';
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Bağlantısı Başarılı!"))
    .catch(err => console.log("❌ Bağlantı Hatası:", err));

// 1️⃣ KAYIT OL: Hata yakalama (Duplicate Key) eklenmiş hali
app.post('/api/register', async (req, res) => {
    try { 
        const u = new User(req.body); 
        await u.save(); 
        res.status(201).json(u); 
    } 
    catch (err) { 
        // Eğer hata kodu 11000 ise bu e-posta zaten veritabanında var demektir
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

// 3️⃣ TÜM KULLANICILARI LİSTELE
app.get('/api/users', async (req, res) => { 
    try {
        const users = await User.find();
        res.json(users); 
    } catch (err) {
        res.status(500).json({ error: "Kullanıcılar getirilemedi." });
    }
});

// 4️⃣ İLAN YAYINLA
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

// 5️⃣ PUAN TRANSFERİ
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

// 6️⃣ PROFİL SİL
app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Hesap silindi." });
    } catch (err) {
        res.status(500).json({ error: "Silme işlemi başarısız." });
    }
});

// Sunucuyu 8080 portunda başlat
const PORT = 8080;
app.listen(PORT, () => console.log(`🚀 Server http://localhost:${PORT} adresinde hazır!`));