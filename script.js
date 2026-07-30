document.getElementById('strokeForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // ==========================================
  // 1. AMBIL MASUKAN/INPUT DARI USER
  // ==========================================
  const age = parseFloat(document.getElementById('age').value) || 0;
  const weight = parseFloat(document.getElementById('weight').value) || 0;
  const height = parseFloat(document.getElementById('height').value) || 0;
  const hypertension = parseInt(document.getElementById('hypertension').value) || 0; // 1 = Ya, 0 = Tidak
  const diabetes = parseInt(document.getElementById('diabetes').value) || 0;         // 1 = Ya, 0 = Tidak
  const cholesterol = parseInt(document.getElementById('cholesterol').value) || 0;      // 1 = Ya, 0 = Tidak
  const familyHistory = parseInt(document.getElementById('familyHistory').value) || 0;  // 1 = Ya, 0 = Tidak
  const smoking = document.getElementById('smoking').value;                         // 'tidak', 'pernah', 'aktif'
  const exercise = document.getElementById('exercise').value;                        // 'rutin', 'kurang', 'jarang'

  // Hitung Nilai Antropometri (BMI)
  const heightM = height / 100;
  const bmi = heightM > 0 ? (weight / (heightM * heightM)).toFixed(1) : 0;
  const isObese = bmi >= 25.0;

  // ==========================================
  // 2. KALKULASI ALGORITMA CERTAINTY FACTOR (CF)
  // ==========================================
  let cfList = [];

  // Evaluasi Penyakit Komorbid Utama
  if (hypertension === 1) cfList.push(0.85); // Hipertensi (Pemicu Utama)
  if (diabetes === 1) cfList.push(0.65);     // Diabetes
  if (cholesterol === 1) cfList.push(0.55);  // Kolesterol

  // Evaluasi Perilaku Merokok
  if (smoking === 'aktif') cfList.push(0.75);
  else if (smoking === 'pernah') cfList.push(0.35);

  // Evaluasi Obesitas (BMI >= 25.0)
  if (isObese) cfList.push(0.50);

  // Evaluasi Usia (Kategori Gradual)
  if (age >= 60) cfList.push(0.60);
  else if (age >= 40) cfList.push(0.40);

  // Evaluasi Riwayat Keluarga
  if (familyHistory === 1) cfList.push(0.40);

  // Evaluasi Aktivitas Olahraga
  if (exercise === 'jarang') cfList.push(0.35);
  else if (exercise === 'kurang') cfList.push(0.20);

  // Hitung Kombinasi Sekuensial CF (CF Combine)
  let cfCombine = 0;
  if (cfList.length > 0) {
    cfCombine = cfList[0];
    for (let i = 1; i < cfList.length; i++) {
      cfCombine = cfCombine + cfList[i] * (1 - cfCombine);
    }
  }

  const cfPercentage = Math.round(cfCombine * 100);

  // ==========================================
  // 3. GENERASI SARAN SPESIFIK BERDASARKAN INPUT USER
  // ==========================================
  let listSaranKlinis = [];

  if (hypertension === 1) {
    listSaranKlinis.push("<strong>Garam & Tekanan Darah:</strong> Batasi konsumsi garam dapur maksimal 1 sendok teh/hari dan patuhi jadwal minum obat darah tinggi secara rutin.");
  }
  if (diabetes === 1) {
    listSaranKlinis.push("<strong>Gula Darah:</strong> Hindari makanan/minuman manis tinggi gula dan lakukan kontrol kadar gula darah secara berkala.");
  }
  if (cholesterol === 1) {
    listSaranKlinis.push("<strong>Lemak & Kolesterol:</strong> Batasi makanan berlemak jenuh/gorengan serta periksakan profil lipid darah secara rutin.");
  }
  if (isObese) {
    listSaranKlinis.push(`<strong>Indeks Massa Tubuh (BMI ${bmi}):</strong> Anda terdeteksi Obesitas. Turunkan berat badan secara bertahap melalui pengaturan pola makan kalori seimbang.`);
  }
  if (smoking === 'aktif') {
    listSaranKlinis.push("<strong>Penghentian Merokok:</strong> Hentikan kebiasaan merokok total. Zat kimia rokok mengentalkan darah dan merusak dinding pembuluh darah.");
  } else if (smoking === 'pernah') {
    listSaranKlinis.push("<strong>Pemulihan Pembuluh Darah:</strong> Pertahankan keputusan untuk tidak merokok lagi agar pemulihan dinding pembuluh darah optimal.");
  }
  if (exercise === 'jarang' || exercise === 'kurang') {
    listSaranKlinis.push("<strong>Aktivitas Fisik:</strong> Tingkatkan frekuensi olahraga (seperti jalan cepat) minimal 150 menit per minggu atau 30-60 menit per hari, 3-5 kali seminggu.");
  }
  if (age >= 40 || familyHistory === 1) {
    listSaranKlinis.push("<strong>Waspada Faktor Kerentanan:</strong> Karena faktor usia/genetik keluarga, lakukan pemeriksaan kesehatan rutin di Puskesmas terdekat.");
  }

  // ==========================================
  // 4. PENENTUAN STATUS TRIASE & SUSUN HTML SARAN
  // ==========================================
  let statusKategori = "";
  let warnaTema = "";
  let htmlSaranAkhir = "";

  // Ambang Batas Triase Klinis:
  // - Risiko Tinggi : >= 75%
  // - Risiko Sedang : 40% - 74%
  // - Risiko Rendah : < 40%
  if (cfPercentage >= 75) {
    statusKategori = "Risiko Tinggi (Sangat Rentan)";
    warnaTema = "danger";

    htmlSaranAkhir = `
      <div class="alert alert-danger mb-3">
        <h6 class="fw-bold mb-2"><i class="bi bi-exclamation-octagon-fill me-2"></i>Instruksi Tindakan Medis Segera:</h6>
        <p class="mb-1">Hasil analisis menunjukkan tingkat kerentanan tinggi. Sangat disarankan untuk segera berkonsultasi ke fasilitas kesehatan terdekat.</p>
      </div>
      <h6 class="fw-bold text-dark mb-2">Panduan Intervensi Mandiri (Sesuai Kondisi Anda):</h6>
      <ul class="mb-0 ps-3">
        ${listSaranKlinis.map(saran => `<li class="mb-2">${saran}</li>`).join('')}
      </ul>
    `;
  } else if (cfPercentage >= 40) {
    statusKategori = "Risiko Sedang (Waspada Dini)";
    warnaTema = "warning";

    htmlSaranAkhir = `
      <div class="alert alert-warning mb-3">
        <h6 class="fw-bold mb-2"><i class="bi bi-exclamation-triangle-fill me-2"></i>Langkah Waspada Dini:</h6>
        <p class="mb-1">Anda memiliki faktor risiko yang perlu diperbaiki sebelum berkembang menjadi komplikasi berat.</p>
      </div>
      <h6 class="fw-bold text-dark mb-2">Rekomendasi Perbaikan Gaya Hidup (Sesuai Input Anda):</h6>
      <ul class="mb-0 ps-3">
        ${listSaranKlinis.map(saran => `<li class="mb-2">${saran}</li>`).join('')}
      </ul>
    `;
  } else {
    statusKategori = "Risiko Rendah (Kondisi Baik)";
    warnaTema = "success";

    htmlSaranAkhir = `
      <div class="alert alert-success mb-3">
        <h6 class="fw-bold mb-2"><i class="bi bi-check-circle-fill me-2"></i>Kondisi Tubuh Terkontrol dengan Baik:</h6>
        <p class="mb-0">Selamat! Saat ini Anda berada dalam kategori risiko rendah. Pertahankan pola hidup sehat ini.</p>
      </div>
      <h6 class="fw-bold text-dark mb-2">Edukasi Pencegahan (Gerakan CERDIK Kemenkes RI):</h6>
      <ul class="mb-0 ps-3">
        <li class="mb-1"><strong>C - Cek Kesehatan:</strong> Rutin periksa tekanan darah dan gula darah secara berkala.</li>
        <li class="mb-1"><strong>E - Enyahkan Asap Rokok:</strong> Pertahankan lingkungan bebas dari asap rokok.</li>
        <li class="mb-1"><strong>R - Rajin Aktivitas Fisik:</strong> Jaga kebiasaan berolahraga teratur 30 menit sehari.</li>
        <li class="mb-1"><strong>D - Diet Seimbang:</strong> Konsumsi buah dan sayur serta batasi gula, garam, dan minyak.</li>
        <li class="mb-1"><strong>I - Istirahat Cukup & K - Kelola Stres:</strong> Tidur 7-8 jam sehari dan hindari stres berlebih.</li>
      </ul>
    `;
  }

  // ==========================================
  // 5. TAMPILKAN HASIL KE ELEMEN DOM
  // ==========================================
  const resultCard = document.getElementById('resultCard');
  const progressBar = document.getElementById('riskProgressBar');
  const riskStatus = document.getElementById('riskStatus');
  const recommendationBox = document.getElementById('recommendationBox');

  // Atur Indikator Progress Bar (Sesuai arahan dr. Nur Hayati: Tanpa Persentase Angka)
  progressBar.className = `progress-bar progress-bar-striped progress-bar-animated bg-${warnaTema}`;
  progressBar.style.width = `${cfPercentage}%`;
  progressBar.innerText = "";

  // Atur Teks Status Kategori
  riskStatus.innerText = statusKategori;
  riskStatus.className = `fw-extrabold m-0 text-${warnaTema}`;

  // Render Teks Saran Dinamis
  recommendationBox.innerHTML = htmlSaranAkhir;

  // Tampilkan Card Hasil & Gulirkan Layar Secara Halus
  resultCard.classList.remove('d-none');
  resultCard.scrollIntoView({ behavior: 'smooth' });
});