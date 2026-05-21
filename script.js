document.getElementById("strokeForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // 1. Ambil Input Data Form
  const age = parseInt(document.getElementById("age").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);
  const hypertension = parseInt(document.getElementById("hypertension").value);
  const diabetes = parseInt(document.getElementById("diabetes").value);
  const cholesterol = parseInt(document.getElementById("cholesterol").value);
  const familyHistory = parseInt(
    document.getElementById("familyHistory").value,
  );
  const smoking = document.getElementById("smoking").value;
  const exercise = document.getElementById("exercise").value;

  // 2. Kalkulasi Indeks Massa Tubuh (BMI)
  const heightInMeter = height / 100;
  const bmi = weight / (heightInMeter * heightInMeter);
  const isObese = bmi >= 25.0; // Batas klasifikasi Obesitas regional Asia-Pasifik

  // 3. Evaluasi Logika Aturan Majemuk (Sintesis Hasil Wawancara Fix dr. Nur Hayati)
  let statusKategori = "";
  let warnaTema = "";
  let persentaseBar = 0;
  let iconSaran = "";

  // Menghitung akumulasi jumlah faktor klinis kritis utama yang aktif
  let faktorKritisUtama =
    hypertension + diabetes + cholesterol + (isObese ? 1 : 0);

  // Penerapan Aturan Logika Pengkondisian Majemuk
  if (
    faktorKritisUtama >= 2 ||
    (hypertension === 1 && isObese) ||
    (hypertension === 1 && smoking === "aktif")
  ) {
    // Komplikasi mayor: Klinis ≥2, ATAU (Hipertensi + Obesitas), ATAU (Hipertensi + Perokok Aktif) = Risiko Tinggi
    statusKategori = "Risiko Tinggi (Sangat Rentan)";
    warnaTema = "danger";
    persentaseBar = 100;
    iconSaran = "bi-exclamation-triangle-fill";
  } else if (
    faktorKritisUtama === 1 ||
    familyHistory === 1 ||
    age >= 40 ||
    smoking === "aktif" ||
    smoking === "pernah" ||
    exercise === "kurang" ||
    exercise === "jarang"
  ) {
    // Deteksi Risiko Sedang berdasarkan faktor pendukung, usia ≥40 tahun, atau paparan perilaku berisiko
    statusKategori = "Risiko Sedang (Waspada Dini)";
    warnaTema = "warning";
    persentaseBar = 65;
    iconSaran = "bi-exclamation-circle-fill";
  } else {
    // Semua variabel berada dalam rentang aman/terkontrol
    statusKategori = "Risiko Rendah (Kondisi Baik)";
    warnaTema = "success";
    persentaseBar = 30;
    iconSaran = "bi-check-circle-fill";
  }

  // 4. Konstruksi Teks Rekomendasi Medis Dinamis Berdasarkan Kondisi Pengguna
  let saranMedis = [];

  if (hypertension === 1) {
    saranMedis.push(
      "Wajib minum obat teratur bagi penderita hipertensi dan lakukan kontrol berkala ke fasilitas kesehatan.",
    );
  }
  if (diabetes === 1) {
    saranMedis.push(
      "Batasi ketat konsumsi gula, karbohidrat berlebih, serta pantau kadar glukosa darah Anda secara teratur.",
    );
  }
  if (cholesterol === 1) {
    saranMedis.push(
      "Hindari mengonsumsi makanan berminyak, bersantan jenuh, atau tinggi kolesterol jahat.",
    );
  }
  if (isObese) {
    saranMedis.push(
      "Atur pola diet seimbang untuk menurunkan berat badan ke rentang ideal dan kurangi konsumsi garam/asin.",
    );
  }
  if (familyHistory === 1) {
    saranMedis.push(
      "Mengingat adanya faktor riwayat genetik penyakit di keluarga, lakukan medical check-up rutin.",
    );
  }

  // Saran khusus untuk variabel perilaku baru (Rokok & Olahraga)
  if (smoking === "aktif") {
    saranMedis.push(
      "Segera hentikan kebiasaan merokok karena zat kimianya merusak dinding pembuluh darah secara akut.",
    );
  } else if (smoking === "pernah") {
    saranMedis.push(
      "Pertahankan keputusan berhenti merokok untuk membantu pemulihan elastisitas pembuluh darah Anda.",
    );
  }

  if (exercise === "kurang" || exercise === "jarang") {
    saranMedis.push(
      "Tingkatkan aktivitas fisik. Lakukan olahraga teratur minimal 30 menit per hari, 3-5 kali dalam seminggu untuk meningkatkan HDL.",
    );
  }

  // Jika pengguna masuk kategori risiko rendah tanpa riwayat gejala negatif
  if (saranMedis.length === 0) {
    saranMedis.push(
      "Kondisi tubuh Anda luar biasa. Ikuti terus gerakan pola hidup sehat CERDIK dari Kemenkes RI.",
    );
  }

  // 5. Pembaruan Elemen Antarmuka (DOM Manipulation - Tanpa Persentase Angka)
  const resultCard = document.getElementById("resultCard");
  const progressBar = document.getElementById("riskProgressBar");
  const riskStatus = document.getElementById("riskStatus");
  const saranContainer = document.getElementById("saranContainer");
  const saranIconBox = document.getElementById("saranIconBox");
  const saranIcon = document.getElementById("saranIcon");
  const saranList = document.getElementById("saranList");

  // Mengatur grafik batang visual
  progressBar.className = `progress-bar progress-bar-striped progress-bar-animated bg-${warnaTema}`;
  progressBar.style.width = persentaseBar + "%";
  progressBar.innerText = statusKategori;

  // Memperbarui teks kesimpulan utama
  riskStatus.innerText = statusKategori;
  riskStatus.className = `fw-extrabold m-0 text-${warnaTema}`;

  // Desain adaptif kotak saran kesehatan
  saranContainer.className = `p-4 rounded-4 border-0 mb-3 bg-${warnaTema}-subtle`;
  saranIconBox.className = `icon-box-sm rounded-circle bg-${warnaTema} text-white`;
  saranIcon.className = `bi ${iconSaran}`;

  // Render poin edukasi medis
  saranList.innerHTML = "";
  saranMedis.forEach(function (saran) {
    let li = document.createElement("li");
    li.innerText = saran;
    li.className = "mb-2 fw-medium";
    saranList.appendChild(li);
  });

  // Menampilkan komponen hasil dan auto-scroll
  resultCard.classList.remove("d-none");
  resultCard.scrollIntoView({ behavior: "smooth" });
});
