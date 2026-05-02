export default function DataDiri() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Data Diri Mahasiswa</h1>

      <div className="bg-white rounded-xl shadow-md p-6 flex gap-8">
        {/* Foto */}
        <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">Foto</span>
        </div>

        {/* Biodata */}
        <div className="flex-1 grid grid-cols-2 gap-y-4">
          <div className="font-semibold">NPM</div>
          <div>17758789015651900</div>

          <div className="font-semibold">Nama</div>
          <div>Test User3</div>

          <div className="font-semibold">Program Studi</div>
          <div>Teknik Informatika</div>

          <div className="font-semibold">Email</div>
          <div>test@example.com</div>

          <div className="font-semibold">No HP</div>
          <div>08178876768767</div>

          <div className="font-semibold">Alamat</div>
          <div>Jl. Test No. 123</div>
        </div>
      </div>
    </div>
  );
}