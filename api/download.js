const axios = require('axios');

// Catatan: paket gratis Vercel membatasi response function sampai 4.5MB
// KECUALI response-nya benar-benar di-stream (bukan dikumpulkan dulu baru dikirim).
// Fungsi ini men-stream langsung dari sumber (response.data.pipe(res)) supaya
// tidak menahan seluruh file di memori. Untuk video yang sangat besar/lama,
// tetap ada risiko kena batas waktu eksekusi function di paket gratis.
// Kalau itu terjadi, alternatif paling aman: skip proxy ini, dan arahkan
// tombol download langsung ke noWatermarkUrl/watermarkUrl/audioUrl dari
// hasil /api/fetch (lihat catatan di README).

module.exports = async (req, res) => {
  const { url, filename } = req.query || {};

  if (!url || typeof url !== 'string') {
    return res.status(400).send('Parameter url wajib diisi.');
  }

  try {
    const response = await axios.get(url, { responseType: 'stream', timeout: 20000 });
    const safeName = (filename || 'toksave-video.mp4').replace(/[^a-zA-Z0-9._-]/g, '');

    res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    response.data.pipe(res);
  } catch (err) {
    console.error('Gagal proxy download:', err.message);
    res.status(502).send('Gagal mengunduh file dari sumber.');
  }
};
