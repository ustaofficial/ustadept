# Ustadept (USTA) Whitepaper
**Sürüm:** v1.0  
**Tarih:** 2026-02-16 (Europe/Istanbul)  
**Tagline:** “USTA bilir.”

---

## Önemli Uyarı
USTA bir **meme/topluluk tokenidir**. **Kâr vaadi yoktur.** Yatırım tavsiyesi değildir. Bu doküman; proje yaklaşımını, doğrulanabilir referansları ve güvenlik sınırlarını açıklar.

---

## 1) Özet (TL;DR)
USTA, Ethereum üzerinde **sabit arzlı (100,000,000,000)** bir ERC-20 tokenidir. Arz **deployment anında tek sefer** mint edilir; **enflasyon yoktur**, “owner mint/emissions” gibi sonradan arzı artıran kaldıraçlar yoktur.

Ustadept’in iddiası basit ama serttir: **hikâye değil kanıt.**  
- Resmî linkler tek bir dosyada tutulur: `docs/OFFICIAL-LINKS.md`  
- Canonical deploy bilgisi tek bir dosyada tutulur: `DEPLOYMENTS.md`  
- Canonical mainnet sözleşmesi bu kayıtlarla sabittir.

---

## 2) Abstract (EN)
USTA is a fixed-supply ERC-20 token on Ethereum, built for community experiments, tipping, and fun. The supply is minted once at deployment and cannot be increased. The project emphasizes verifiability over narrative: official references and canonical deployments are maintained as single sources of truth in the repository.

---

## 3) Problem / Motivasyon
Kripto projelerinin en büyük saldırı yüzeyi çoğu zaman teknik değil, **sosyal**:
- Sahte “official” kanallar
- Belirsiz tokenomics / admin knob’lar
- “Trust me” üzerine kurulu vaatler
- Doğrulanamayan iddialar

Ustadept yaklaşımı bunun tersine kurulur:  
**En kısa yol = en az sürpriz + en fazla doğrulanabilirlik.**

---

## 4) Ustadept Nedir?
Ustadept, USTA etrafında şekillenen **açık kaynak** bir topluluk projesidir. Çekirdek fikir:
- “public inşa et”
- “kanıt üret”
- “playful ol ama mühendisliği disiplinli tut”

USTA’nın hedef kullanım alanları:
- tipping
- topluluk aktiviteleri
- küçük deneyler ve on-chain sosyal koordinasyon

---

## 5) Değerler (USTA Manifesto’nun özü)
Ustadept; şişirilmiş vaatlerden çok şu eksenleri önemser:
- **Useful:** gerçek fayda, abartı değil  
- **Verifiable:** “proof > statement” (link, kaynak kod, on-chain gerçek)  
- **Human:** hype yerine mizah; extraction yerine saygı  
- **Open:** açık kaynak ve açık tartışma  
- **Reliable:** hızlı/bozuk yerine basit/çalışan sistemler

Bu manifesto bir “pazarlama metni” değil; proje davranış standardıdır.

---

## 6) “Official” Sınırı (Anti-scam tasarım kuralı)
USTA ismi kolay taklit edilir. Bu yüzden **tek bir kural** projeyi korur:

> Bir link `docs/OFFICIAL-LINKS.md` içinde yoksa **official değildir**.

Bu kuralın sonucu:  
- Yeni bir sosyal hesap, domain, listeleme veya repo “official” sayılacaksa **OFFICIAL-LINKS’e PR/commit ile girmek zorunda**.

**Neden bu kadar sert?** Çünkü kullanıcı güvenliği; “kim söyledi” yerine “nerede kayıtlı” sorusuyla korunur.

---

## 7) Token Spesifikasyonu
### 7.1 Ağ / Standart
- **Ağ:** Ethereum Mainnet (canonical)
- **Standart:** ERC-20

### 7.2 Parametreler
- **Name / Symbol:** USTA / USTA
- **Decimals:** 18
- **Total Supply:** 100,000,000,000 USTA (fixed)
- **Minting:** constructor’da **tek sefer** MAX_SUPPLY mint

### 7.3 Arz Politikası (Hard Constraint)
USTA’nın ekonomik tasarımı özellikle “sıkıcı” seçilmiştir:
- **Enflasyon yok**
- **Owner mint yok**
- **Emissions yok**
- Token “vergi/tax” gibi transfer mekaniğiyle oynanmaz

Bu sıkıcılık bir feature: saldırı yüzeyini küçültür.

---

## 8) Sözleşme Tasarımı (Implementation Notları)
USTA sözleşmesi OpenZeppelin ERC-20 üzerine kurulur ve iki önemli güvenlik/operasyon detayı taşır:

### 8.1 Sabit Arz
Sözleşmede `MAX_SUPPLY` sabitidir:
- `100_000_000_000 * 10**18`

Constructor:
- `initialRecipient != 0x0` değilse revert
- `MAX_SUPPLY` miktarı initialRecipient’a mint edilir

### 8.2 “USTA_BUILD” Build Marker
Sözleşmede `USTA_BUILD` adında bir sabit bulunur. Amaç:
- Explorer’larda “Similar Match” problemini kırmak için runtime bytecode’u **benzersiz** yapmak
- Davranışı değiştirmez (sadece public getter üretir)
- Yeni deploy sonrası **full/exact verification** ihtimalini artırır

Bu, “güvenlik”ten çok “operasyonel doğrulanabilirlik” için tasarlanmış bir işarettir.

---

## 9) Canonical Deployments & Doğrulama (Single Source of Truth)
USTA için canonical gerçekler iki dosyada tutulur:
- `DEPLOYMENTS.md` → canonical deploy kayıtları
- `docs/OFFICIAL-LINKS.md` → canonical linkler + canonical contract

### 9.1 Canonical Mainnet (USTA v1)
Canonical mainnet sözleşmesi ve doğrulama referansları repo’da kayıtlıdır:
- Contract: `0x8D15C25E0fF24256401Fd4DA6d85301084FC3672`

`DEPLOYMENTS.md` ayrıca şunları da kaydeder:
- Deployer (EOA)
- Initial recipient (mint)
- Contract creation tx
- Block ve timestamp
- Etherscan code/token linkleri

### 9.2 Testnet Canonical’leri (Sepolia)
Repo’da Sepolia için canonical ve deprecated sürümler ayrıştırılmıştır:
- “current/canonical” olanlar
- “deprecated / do not use” olanlar
- “Similar Match” kaynaklı doğrulama sorunları notları

Bu ayrım **entegrasyon yapanlar için kritik**: yanlış sözleşmeye bağlanmayı engeller.

---

## 10) Deploy Guard’ları ve Verification Tooling
USTA repo’su operasyonel hatalara karşı guard içerir:

### 10.1 Mainnet deploy guard
Mainnet deploy script’i:
- chainId == 1 değilse çalışmaz
- `CONFIRM_MAINNET_DEPLOY=YES` yoksa çalışmaz
- recipient set değilse çalışmaz
- zero address ise çalışmaz

Bu yaklaşım “yanlış network’e deploy” gibi pahalı hataları azaltır.

### 10.2 Verification helper (DEPLOYMENTS.md okur)
`verify.mjs`:
- network + version parametresi alır
- `DEPLOYMENTS.md` içinden doğru contract/constructor arg’ını çekip
- `hardhat verify` komutunu doğru bayraklarla koşturur (`--build-profile production|default`, `--force`)

### 10.3 CI güvenlik standardı (npm audit gate)
Repo’da `audit-high.mjs`:
- `npm audit --json` çalıştırır
- high/critical varsa pipeline’ı fail eder

Basit ama etkili: bağımlılık riskini “görmezden gelme”yi engeller.

---

## 11) Dağıtım Modeli
USTA Litepaper’ın söylediği net:
- Tüm arz initial recipient’a mint edilmiştir
- Sonraki dağıtım normal on-chain transferlerle olur
- “public sale / ICO / IEO” iddiası yoktur

Bu model, token’ın “satış anlatısı” yerine topluluk kullanımına odaklanmasını amaçlar.

---

## 12) Topluluk ve Ekosistem
USTA’nın “utility”si; merkezî bir uygulamadan çok, topluluğun ürettiği küçük ama gerçek şeylerden gelir:
- tipping araçları
- bounties (docs/çeviri/test/entegrasyon)
- mini oyunlar/deneyler
- eğitim içerikleri, reproducible demo’lar

**İlke:** 1 büyük vaat yerine 100 küçük doğrulanabilir katkı.

---

## 13) Ustadept Foundation (rol tanımı)
Ustadept Foundation; topluluk odaklı, non-profit-minded bir koordinasyon katmanı olarak tanımlanır:
- open-source geliştirme, dokümantasyon, eğitim desteği
- brand & user-safety defense (scam/impersonation azaltma)
- public “trailmap”: şeffaf öncelikler, görünür ilerleme, hesap verebilir release’ler

Foundation’ın en kritik işi: “single source of truth” yaklaşımını sürdürmek.

---

## 14) Güvenlik Politikası ve Sorumlu Bildirim
Bir güvenlik problemi bulursan:
- Email: `ustadept@ustadept.com`
- Subject: `[SECURITY] USTA Token Vulnerability Report`

Kapsam:
- `contracts/`
- `scripts/`

Repo güvenlik politikası özellikle şunu söyler:
- “Garantili timeline” vaadi verilmez  
Bu; gerçekçi beklenti yönetimi için bilinçli bir tercihtir.

---

## 15) Riskler (dürüst bölüm)
- **Market riski:** fiyat volatil olabilir, hatta sıfıra gidebilir.
- **Smart contract riski:** kod basit olsa da yazılım riski sıfır değildir.
- **Phishing/impersonation:** OFFICIAL-LINKS dışında hiçbir kanal “official” kabul edilmemelidir.
- **Operasyon riski:** yanlış sözleşmeye bağlanma/yanlış chain gibi hatalar, canonical kayıtlar takip edilmezse mümkündür.

---

## 16) Non-affiliation
“USTA” burada Türkçe “usta” (master/craftsman) kelimesine referanstır.  
United States Tennis Association veya başka bir kurumla **bağlılık iddiası yoktur**.

---

## 17) Roadmap yerine “Trailmap”
USTA klasik “roadmap” şişirmeyi sevmez. Trailmap şudur:
- issue/PR’lar
- release’ler
- deploy kayıtları
- verification kanıtları

**Kural:** Yapılmadıysa “plan” sayılır; yapıldıysa “commit” sayılır.

---

## Appendix A — Canonical Referanslar
**Official links (SSoT):**
- `docs/OFFICIAL-LINKS.md`

**Canonical deployments (SSoT):**
- `DEPLOYMENTS.md`

**Litepaper:**
- `docs/LITEPAPER.md`

**Repo:**
- `https://github.com/ustaofficial/ustadept`

**Website:**
- `https://www.ustadept.com/`

---

## Appendix B — Canonical Contracts (kısa)
- Ethereum Mainnet (USTA v1): `0x8D15C25E0fF24256401Fd4DA6d85301084FC3672`
- Sepolia canonical sürümler ve deprecated notları için: `DEPLOYMENTS.md`

---

**End of document.**
