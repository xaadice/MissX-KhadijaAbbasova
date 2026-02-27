# Hatice Abbasoca'nın REST API Metotları

## Görev1 — Kayıt Olma
- **Endpoint:** `POST /auth/register`
- **Request Body:**
```json
{
  "name": "Hatice Abbasoca",
  "email": "hatice@example.com",
  "password": "Guvenli123!"
}
```
- **Response:** `201 Created` — Kullanıcı hesabı başarıyla oluşturuldu

---

## Görev2 — Giriş Yapma
- **Endpoint:** `POST /auth/login`
- **Request Body:**
```json
{
  "email": "hatice@example.com",
  "password": "Guvenli123!"
}
```
- **Response:** `200 OK` — Giriş başarılı, token döndürülür

---

## Görev3 — Profil Güncelleme
- **Endpoint:** `PUT /users/{userId}`
- **Path Parameters:** `userId` (string, required)
- **Authentication:** Bearer Token gerekli
- **Request Body:**
```json
{
  "name": "Yeni İsim",
  "skill": "Python, Matematik"
}
```
- **Response:** `200 OK` — Profil başarıyla güncellendi

---

## Görev4 — Profili Silme
- **Endpoint:** `DELETE /users/{userId}`
- **Path Parameters:** `userId` (string, required)
- **Authentication:** Bearer Token gerekli
- **Response:** `204 No Content` — Üyelik başarıyla sonlandırıldı

---

## Görev5 — Yeni İlan Oluşturma
- **Endpoint:** `POST /listings`
- **Authentication:** Bearer Token gerekli
- **Request Body:**
```json
{
  "title": "1 saat Python dersi verebilirim",
  "description": "Temel Python ve veri yapıları konularında ders verebilirim.",
  "durationHours": 1
}
```
- **Response:** `201 Created` — İlan başarıyla oluşturuldu

---

## Görev6 — İlanları Listeleme
- **Endpoint:** `GET /listings`
- **Response:** `200 OK` — Tüm ilanlar döndürülür

---

## Görev7 — İlan Güncelleme
- **Endpoint:** `PUT /listings/{listingId}`
- **Path Parameters:** `listingId` (string, required)
- **Authentication:** Bearer Token gerekli
- **Request Body:**
```json
{
  "description": "Güncellenmiş ilan açıklaması."
}
```
- **Response:** `200 OK` — İlan başarıyla güncellendi

---

## Görev8 — İlan Silme
- **Endpoint:** `DELETE /listings/{listingId}`
- **Path Parameters:** `listingId` (string, required)
- **Authentication:** Bearer Token gerekli
- **Response:** `204 No Content` — İlan başarıyla silindi

---

## Görev9 — Kredi Transferi
- **Endpoint:** `POST /credits/transfer`
- **Authentication:** Bearer Token gerekli
- **Request Body:**
```json
{
  "toUserId": "u456",
  "amount": 1
}
```
- **Response:** `200 OK` — 1 kredi başarıyla transfer edildi

---

## Görev10 — Bakiye Sorgulama
- **Endpoint:** `GET /credits/balance`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` — Mevcut kredi bakiyesi döndürülür
