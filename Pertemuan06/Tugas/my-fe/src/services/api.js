export async function getMahasiswa() {
  const res = await fetch("http://127.0.0.1:3000/api/mahasiswa");
  const payload = await res.json();

  if (!res.ok) {
    throw new Error(payload?.message || "Gagal mengambil data");
  }

  const mahasiswa = Array.isArray(payload) ? payload : payload?.data;

  if (!Array.isArray(mahasiswa)) {
    throw new Error("Format response tidak valid");
  }

  return mahasiswa;
}