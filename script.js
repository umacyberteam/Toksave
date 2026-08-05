fetch('maintenance.json').then(r=>r.json()).then(c=>{if(c.maintenance){document.body.innerHTML=`<div style="font-family:Arial;height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column"><h1>Server/Website Sedang Maintenance</h1><p>Diharapkan Tunggu Beberapa Menit.</p></div>`;throw new Error('maintenance')}}).catch(()=>{});
const form = document.getElementById('downloadForm');
const urlInput = document.getElementById('tiktokUrl');
const submitBtn = document.getElementById('submitBtn');
const btnLabel = submitBtn.querySelector('.btn-label');
const errorMsg = document.getElementById('errorMsg');
const resultCard = document.getElementById('resultCard');

function buildDownloadLink(sourceUrl, filename) {
  if (!sourceUrl) return '#';
  return `/api/download?url=${encodeURIComponent(sourceUrl)}&filename=${encodeURIComponent(filename)}`;
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  btnLabel.textContent = isLoading ? 'Memproses' : 'Ambil Video';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const url = urlInput.value.trim();
  errorMsg.textContent = '';
  resultCard.classList.add('hidden');

  if (!url) return;

  setLoading(true);

  try {
    const response = await fetch('/api/fetch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.error || 'Gagal mengambil video. Coba lagi.');
    }

    const data = json.data;

    document.getElementById('resultThumb').src = data.cover;
    document.getElementById('resultTitle').textContent = data.title;
    document.getElementById('resultAuthor').textContent = data.author ? `@${data.author}` : '';

    document.getElementById('dlClean').href = buildDownloadLink(data.noWatermarkUrl, 'toksave-tanpa-watermark.mp4');
    document.getElementById('dlWatermark').href = buildDownloadLink(data.watermarkUrl, 'toksave-watermark.mp4');
    document.getElementById('dlAudio').href = buildDownloadLink(data.audioUrl, 'toksave-audio.mp3');

    resultCard.classList.remove('hidden');
  } catch (err) {
    errorMsg.textContent = err.message;
  } finally {
    setLoading(false);
  }
});
