# REST API Görev Dağılımı

**REST API Adresi:** api.talantloop.com

Bu dokümanda, proje ekibindeki her üyenin geliştirmekten sorumlu olduğu REST API metotları listelenmektedir.

---

## Grup Üyelerinin REST API Metotları

1. [Khadija Abbasova'nın REST API Metotları](#khadija-abbasovanın-rest-api-metotları)

---

## Khadija Abbasova'nın REST API Metotları

### 1. Kullanıcı Kayıt Ol

| Alan | Değer |
|------|-------|
| **Method** | `POST` |
| **Endpoint** | `/auth/register` |
| **Açıklama** | Sisteme yeni bir kullanıcı kaydeder |
| **Auth Gerekli** | Hayır |

**Request Body:**
```json
{
  "username": "ahmet_yilmaz",
  "email": "ahmet@example.com",
  "password": "Guvenli123!",
  "fullName": "Ahmet Yılmaz",
  "skills": ["Matematik", "Programlama"]
}
```

**Başarılı Yanıt (201):**
```json
{
  "id": "user_123",
  "username": "ahmet_yilmaz",
  "email": "ahmet@example.com",
  "creditBalance": 0,
  "createdAt": "2026-03-06T14:00:00Z"
}
```

---

### 2. Kullanıcı Giriş Yap

| Alan | Değer |
|------|-------|
| **Method** | `POST` |
| **Endpoint** | `/auth/login` |
| **Açıklama** | Sisteme erişim yetkisi alır, JWT token döner |
| **Auth Gerekli** | Hayır |

**Request Body:**
```json
{
  "email": "ahmet@example.com",
  "password": "Guvenli123!"
}
```

**Başarılı Yanıt (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400
}
```

---

### 3. Profil Bilgilerini Güncelle

| Alan | Değer |
|------|-------|
| **Method** | `PUT` |
| **Endpoint** | `/users/{userId}` |
| **Açıklama** | Kullanıcı adı veya yetkinlik bilgilerini günceller |
| **Auth Gerekli** | Evet |

**Request Body:**
```json
{
  "username": "ahmet_yilmaz_v2",
  "skills": ["Matematik", "Python", "Müzik"]
}
```

**Başarılı Yanıt (200):**
```json
{
  "id": "user_123",
  "username": "ahmet_yilmaz_v2",
  "skills": ["Matematik", "Python", "Müzik"]
}
```

---

### 4. Profilini Sil

| Alan | Değer |
|------|-------|
| **Method** | `DELETE` |
| **Endpoint** | `/users/{userId}` |
| **Açıklama** | Kullanıcı üyeliğini sonlandırır ve hesabını siler |
| **Auth Gerekli** | Evet |

**Başarılı Yanıt (204):** İçerik yok

---

### 5. Yeni İlan Oluştur

| Alan | Değer |
|------|-------|
| **Method** | `POST` |
| **Endpoint** | `/listings` |
| **Açıklama** | "1 saat ders verebilirim" gibi yeni bir hizmet ilanı açar |
| **Auth Gerekli** | Evet |

**Request Body:**
```json
{
  "title": "1 saat Python dersi verebilirim",
  "description": "Başlangıç seviyesinde Python programlama dersi",
  "skill": "Python",
  "creditCost": 1,
  "durationMinutes": 60
}
```

**Başarılı Yanıt (201):**
```json
{
  "id": "listing_789",
  "title": "1 saat Python dersi verebilirim",
  "skill": "Python",
  "creditCost": 1,
  "createdAt": "2026-03-06T14:00:00Z"
}
```

---

### 6. İlanları Listele

| Alan | Değer |
|------|-------|
| **Method** | `GET` |
| **Endpoint** | `/listings` |
| **Açıklama** | Mevcut tüm ilanları ana sayfada listeler |
| **Auth Gerekli** | Hayır |

**Query Parametreleri:**

| Parametre | Tip | Varsayılan | Açıklama |
|-----------|-----|------------|----------|
| `page` | integer | 1 | Sayfa numarası |
| `limit` | integer | 20 | Sayfa başına ilan sayısı |
| `skill` | string | - | Yetkinliğe göre filtrele |

**Başarılı Yanıt (200):**
```json
{
  "data": [
    {
      "id": "listing_789",
      "title": "1 saat Python dersi verebilirim",
      "skill": "Python",
      "creditCost": 1,
      "durationMinutes": 60
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

---

### 7. İlan Güncelle

| Alan | Değer |
|------|-------|
| **Method** | `PUT` |
| **Endpoint** | `/listings/{listingId}` |
| **Açıklama** | Açılan ilanın açıklamasını veya detaylarını değiştirir |
| **Auth Gerekli** | Evet |

**Request Body:**
```json
{
  "description": "İleri seviye Python dersi - veri bilimi odaklı",
  "creditCost": 2
}
```

**Başarılı Yanıt (200):**
```json
{
  "id": "listing_789",
  "description": "İleri seviye Python dersi - veri bilimi odaklı",
  "creditCost": 2
}
```

---

### 8. İlan Sil

| Alan | Değer |
|------|-------|
| **Method** | `DELETE` |
| **Endpoint** | `/listings/{listingId}` |
| **Açıklama** | Verilen ilanı sistemden kalıcı olarak kaldırır |
| **Auth Gerekli** | Evet |

**Başarılı Yanıt (204):** İçerik yok

---

### 9. Kredi Transferi Yap

| Alan | Değer |
|------|-------|
| **Method** | `POST` |
| **Endpoint** | `/credits/transfer` |
| **Açıklama** | İşlem tamamlandığında 1 krediyi birinden diğerine aktarır |
| **Auth Gerekli** | Evet |

**Request Body:**
```json
{
  "toUserId": "user_456",
  "amount": 1,
  "listingId": "listing_789",
  "note": "Python dersi tamamlandı"
}
```

**Başarılı Yanıt (200):**
```json
{
  "success": true,
  "fromUserId": "user_123",
  "toUserId": "user_456",
  "amount": 1,
  "newBalance": 4,
  "transferredAt": "2026-03-06T14:30:00Z"
}
```

---

### 10. Bakiye Sorgula

| Alan | Değer |
|------|-------|
| **Method** | `GET` |
| **Endpoint** | `/credits/balance` |
| **Açıklama** | Kullanıcının kaç kredisi kaldığını görüntüler |
| **Auth Gerekli** | Evet |

**Başarılı Yanıt (200):**
```json
{
  "userId": "user_123",
  "balance": 5,
  "lastUpdated": "2026-03-06T14:00:00Z"
}
```
