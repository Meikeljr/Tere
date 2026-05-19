document.getElementById("strokeForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // 1. Ambil Input Data
  const age = parseInt(document.getElementById("age").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);
  const hypertension = parseInt(document.getElementById("hypertension").value);
  const diabetes = parseInt(document.getElementById("diabetes").value);
  const cholesterol = parseInt(document.getElementById("cholesterol").value);
  const familyHistory = parseInt(
    document.getElementById("familyHistory").value,
  );

  // 2. Kalkulasi Indeks Massa Tubuh (BMI)
  const heightInMeter = height / 100;
  const bmi = weight / (heightInMeter * heightInMeter);
  const isObese = bmi >= 25.0; // Standar Obesitas Regional Asia-Pasifik

  // 3. Evaluasi Aturan Sistem Pakar (Hasil Sintesis Wawancara Dokter)
  let statusKategori = "";
  let warnaTema = ""; // Pilihan: danger, warning, success
  let persentaseBar = 0;
  let iconSaran = "";

  let faktorKritisAktif =
    hypertension + diabetes + cholesterol + (isObese ? 1 : 0);

  if (faktorKritisAktif >= 2 || (hypertension === 1 && isObese)) {
    statusKategori = "Risiko Tinggi (Sangat Rentan)";
    warnaTema = "danger";
    persentaseBar = 100;
    iconSaran = "bi-exclamation-triangle-fill";
  } else if (faktorKritisAktif === 1 || familyHistory === 1 || age >= 55) {
    statusKategori = "Risiko Sedang (Waspada Dini)";
    warnaTema = "warning";
    persentaseBar = 65;
    iconSaran = "bi-exclamation-circle-fill";
  } else {
    statusKategori = "Risiko Rendah (Kondisi Baik)";
    warnaTema = "success";
    persentaseBar = 30;
    iconSaran = "bi-check-circle-fill";
  }

  // 4. Konstruksi Teks Saran Dokter Secara Dinamis
  let saranMedis = [];
  if (hypertension === 1) {
    saranMedis.push(
      "Wajib mengontrol dan memeriksakan tekanan darah Anda secara berkala ke fasilitas kesehatan.",
    );
  }
  if (diabetes === 1) {
    saranMedis.push(
      "Batasi ketat konsumsi gula/makanan manis serta pantau kadar glukosa secara mandiri.",
    );
  }
  if (isObese) {
    saranMedis.push(
      "Kurangi berat badan secara bertahap menuju batas ideal dan batasi konsumsi makanan asin/garam berlebih.",
    );
  }
  if (cholesterol === 1) {
    saranMedis.push(
      "Hindari mengonsumsi makanan berminyak, bersantan, atau mengandung lemak jenuh tinggi.",
    );
  }
  if (familyHistory === 1) {
    saranMedis.push(
      "Karena adanya faktor riwayat genetik stroke di keluarga, lakukan medical check-up secara berkala.",
    );
  }
  if (saranMedis.length === 0) {
    saranMedis.push(
      "Kondisi Anda sangat baik. Pertahankan dengan olahraga teratur minimal 3 kali seminggu dan konsumsi serat seimbang.",
    );
  }

  // 5. Update DOM & Desain Visual Secara Dinamis
  const resultCard = document.getElementById("resultCard");
  const progressBar = document.getElementById("riskProgressBar");
  const riskStatus = document.getElementById("riskStatus");
  const saranContainer = document.getElementById("saranContainer");
  const saranIconBox = document.getElementById("saranIconBox");
  const saranIcon = document.getElementById("saranIcon");
  const saranList = document.getElementById("saranList");

  // Modifikasi Kelas Elemen Berdasarkan Tingkat Risiko
  progressBar.className = `progress-bar progress-bar-striped progress-bar-animated bg-${warnaTema}`;
  progressBar.style.width = persentaseBar + "%";
  progressBar.innerText = statusKategori;

  riskStatus.innerText = statusKategori;
  riskStatus.className = `fw-extrabold m-0 text-${warnaTema}`;

  // Desain Warna Wadah Kotak Saran Secara Adaptif
  saranContainer.className = `p-4 rounded-4 border-0 mb-3 bg-${warnaTema}-subtle`;
  saranIconBox.className = `icon-box-sm rounded-circle bg-${warnaTema} text-white`;
  saranIcon.className = `bi ${iconSaran}`;

  // Render Butir-Butir Rekomendasi
  saranList.innerHTML = "";
  saranMedis.forEach(function (saran) {
    let li = document.createElement("li");
    li.innerText = saran;
    li.className = "mb-2 fw-medium";
    saranList.appendChild(li);
  });

  // Menampilkan Tampilan Hasil Ke Layar
  resultCard.classList.remove("d-none");
  resultCard.scrollIntoView({ behavior: "smooth" });
});
