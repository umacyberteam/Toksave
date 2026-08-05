const axios = require('axios');

const TIKWM_ENDPOINT = 'https://www.tikwm.com/api/';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method tidak didukung.' });
  }

  const { url } = req.body || {};

  if (!url || typeof url !== 'string' || !url.includes('tiktok')) {
    return res.status(400).json({ error: 'Masukkan link TikTok yang valid.' });
  }

  try {
    const { data } = await axios.get(TIKWM_ENDPOINT, {
      params: { url, hd: 1 },
      timeout: 15000,
    });

    if (!data || data.code !== 0 || !data.data) {
      return res.status(404).json({ error: 'Video tidak ditemukan. Cek lagi link-nya.' });
    }

    const v = data.data;

    return res.status(200).json({
      success: true,
      data: {
        title: v.title || 'Video TikTok',
        cover: v.cover || v.origin_cover || '',
        author: v.author?.unique_id || v.author?.nickname || '',
        noWatermarkUrl: v.play || '',
        watermarkUrl: v.wmplay || '',
        audioUrl: v.music || '',
      },
    });
  } catch (err) {
    console.error('Gagal mengambil data:', err.message);
    return res.status(502).json({ error: 'Server sumber video sedang bermasalah, coba beberapa saat lagi.' });
  }
};
