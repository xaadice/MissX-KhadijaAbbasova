# Gereksinim Analizi (Talantloop)

Bu proje, kullanıcıların sahip oldukları yetkinlikler üzerinden birbirlerine destek olabildikleri ve "kredi" sistemiyle hizmet alışverişi yaptıkları bir platformun backend altyapısını kapsamaktadır. Sistemin temel işleyişi şu ana gereksinimler üzerine kurulmuştur:

1.  **Kullanıcı ve Güvenlik Yönetimi:** Sisteme dahil olmak isteyen kullanıcıların kayıt olabilmesi, güvenli bir şekilde giriş yaparak yetkilendirme (token) alabilmesi ve gerektiğinde profil bilgilerini güncelleyip hesaplarını silebilmesi temel önceliktir.
2.  **İlan ve Hizmet Paylaşımı:** Kullanıcıların yeteneklerini sergileyebilecekleri ilanlar oluşturması (örneğin: "1 saatlik ders"), bu ilanların tüm kullanıcılar tarafından listelenebilmesi ve ilan sahibinin kendi ilanlarını yönetebilmesi (güncelleme/silme) sağlanmalıdır.
3.  **Ekonomik Döngü (Kredi Sistemi):** Platform içerisindeki hizmet takasının gerçekleşmesi için kullanıcılar arasında kredi transferi yapılabilmelidir. Her işlem sonunda bakiyeler güncellenmeli ve kullanıcılar mevcut kredi durumlarını anlık olarak sorgulayabilmelidir.

Bu analiz çerçevesinde hazırlanan REST API metotları, platformun hem sosyal hem de finansal modüllerinin birbiriyle uyumlu çalışmasını hedeflemektedir.
