# TokSave — versi Vercel

Struktur ini sudah disesuaikan supaya jalan sebagai serverless function di
Vercel (bukan server Express yang terus menyala).

## Cara deploy

**Lewat CLI:**
```
npm i -g vercel
cd toksave-vercel
vercel
```
Ikuti saja pertanyaannya (pilih akun, nama project, dsb). Nanti dapat URL live.

**Lewat dashboard vercel.com:**
1. Push folder ini ke repo GitHub.
2. Di vercel.com → "Add New Project" → pilih repo itu.
3. Framework preset: "Other". Build command & output directory boleh dikosongkan.
4. Deploy.

## Yang berbeda dari versi Express

- `server.js` diganti jadi dua file di `api/`: `fetch.js` dan `download.js`.
  Vercel otomatis mengubah tiap file di folder `api/` jadi endpoint sendiri
  (`/api/fetch`, `/api/download`) — tidak perlu `app.listen()`.
- File frontend (`index.html`, `style.css`, `script.js`) taruh di root,
  bukan di folder `public/`, supaya Vercel mengenalinya sebagai static file.
- Tidak perlu Express sama sekali, jadi dependensinya cuma `axios`.

## Batasan penting: ukuran file

Paket gratis (Hobby) Vercel membatasi response function sampai **4.5MB**
untuk response biasa. Endpoint `/api/download` sudah ditulis dengan cara
**streaming** (`response.data.pipe(res)`) supaya tidak kena batas ini — tapi
kalau kamu tetap menemui error saat mengunduh video yang besar/panjang,
solusi paling aman adalah **melewati proxy ini sama sekali**:

Di `script.js`, ganti pemanggilan `buildDownloadLink(...)` supaya tombol
download langsung mengarah ke `data.noWatermarkUrl` / `data.watermarkUrl` /
`data.audioUrl` (link CDN asli dari tikwm.com), tanpa lewat `/api/download`.
Konsekuensinya: nama file unduhan ikut apa adanya dari sumber, dan di
beberapa browser videonya mungkin terbuka di tab baru alih-alih otomatis
ke-download — tapi ini paling aman dari sisi batasan platform.

## Catatan yang sama seperti versi sebelumnya

- Bergantung pada API pihak ketiga (tikwm.com) yang bisa berubah sewaktu-waktu.
- Video yang diunduh tetap hak cipta kreatornya — gunakan untuk keperluan
  pribadi/wajar, bukan redistribusi konten orang lain tanpa izin.
