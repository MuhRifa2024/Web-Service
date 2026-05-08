package config

import (
	"fmt"
	"log"
	"os"

	"inventaris-kantor-api/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	// coba beberapa kemungkinan lokasi .env
	err := godotenv.Load(".env")
	if err != nil {
		err = godotenv.Load("../.env")
		if err != nil {
			log.Println("⚠️ .env tidak ditemukan di current maupun parent directory")
		}
	}

	dsn := os.Getenv("SUPABASE_DSN")
	if dsn == "" {
		log.Fatal("SUPABASE_DSN tidak ditemukan. Pastikan .env berisi DSN Supabase")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Gagal konek ke database: %v", err)
	}

	DB = db
	fmt.Println("✅ Koneksi ke PostgreSQL (Supabase) BERHASIL")
}

func GetDB() *gorm.DB {
	if DB == nil {
		log.Fatal("DB belum diinisialisasi. Panggil config.InitDB() lebih dulu.")
	}
	return DB
}

// AutoMigrate membuat tabel otomatis dari GORM models
func AutoMigrate() {
	err := DB.AutoMigrate(&models.Barang{}, &models.Peminjaman{})
	if err != nil {
		log.Fatalf("Gagal auto-migrate: %v", err)
	}
	fmt.Println("✅ Database migrated successfully")
}

// AutoSeed mengisi data awal jika tabel kosong
func AutoSeed() {
	var barangCount int64
	DB.Model(&models.Barang{}).Count(&barangCount)
	if barangCount == 0 {
		seedBarang()
	} else {
		fmt.Printf("ℹ️  Tabel 'barang' sudah memiliki %d data, skip seed\n", barangCount)
	}

	var peminjamanCount int64
	DB.Model(&models.Peminjaman{}).Count(&peminjamanCount)
	if peminjamanCount == 0 {
		seedPeminjaman()
	} else {
		fmt.Printf("ℹ️  Tabel 'peminjaman' sudah memiliki %d data, skip seed\n", peminjamanCount)
	}
}

func seedBarang() {
	barangList := []models.Barang{
		{KodeBarang: "INV-001", NamaBarang: "Laptop Dell Latitude 5540", Kategori: "Elektronik", Merek: "Dell", Jumlah: 5, Lokasi: "Ruang IT", Kondisi: "Baik", TanggalPengadaan: "2025-01-15", HargaSatuan: 15500000, Status: "tersedia", Keterangan: "Laptop kerja untuk tim IT"},
		{KodeBarang: "INV-002", NamaBarang: "Monitor LG 24\" IPS", Kategori: "Elektronik", Merek: "LG", Jumlah: 10, Lokasi: "Ruang Desain", Kondisi: "Baik", TanggalPengadaan: "2025-02-10", HargaSatuan: 2800000, Status: "tersedia", Keterangan: "Monitor tambahan untuk desainer"},
		{KodeBarang: "INV-003", NamaBarang: "Meja Kerja Minimalis", Kategori: "Furniture", Merek: "IKEA", Jumlah: 15, Lokasi: "Ruang Staff", Kondisi: "Baik", TanggalPengadaan: "2024-06-20", HargaSatuan: 1200000, Status: "tersedia", Keterangan: "Meja kerja standar kantor"},
		{KodeBarang: "INV-004", NamaBarang: "Kursi Ergonomis", Kategori: "Furniture", Merek: "Herman Miller", Jumlah: 3, Lokasi: "Ruang Manager", Kondisi: "Rusak Ringan", TanggalPengadaan: "2024-04-10", HargaSatuan: 4500000, Status: "dalam_perbaikan", Keterangan: "Roda kursi perlu diganti"},
		{KodeBarang: "INV-005", NamaBarang: "Printer HP LaserJet Pro", Kategori: "Elektronik", Merek: "HP", Jumlah: 2, Lokasi: "Ruang Admin", Kondisi: "Baik", TanggalPengadaan: "2025-03-05", HargaSatuan: 4500000, Status: "tersedia", Keterangan: "Printer utama kantor"},
		{KodeBarang: "INV-006", NamaBarang: "Proyektor Epson EB-X51", Kategori: "Elektronik", Merek: "Epson", Jumlah: 1, Lokasi: "Ruang Meeting", Kondisi: "Baik", TanggalPengadaan: "2024-11-12", HargaSatuan: 7200000, Status: "dipinjam", Keterangan: "Proyektor untuk presentasi"},
		{KodeBarang: "INV-007", NamaBarang: "Whiteboard Magnetic 120x240", Kategori: "Peralatan Kantor", Merek: "Sakana", Jumlah: 4, Lokasi: "Ruang Meeting", Kondisi: "Baik", TanggalPengadaan: "2024-08-01", HargaSatuan: 850000, Status: "tersedia", Keterangan: "Whiteboard ruang meeting utama"},
		{KodeBarang: "INV-008", NamaBarang: "AC Daikin 1.5 PK", Kategori: "Elektronik", Merek: "Daikin", Jumlah: 6, Lokasi: "Ruang Server", Kondisi: "Baik", TanggalPengadaan: "2024-03-15", HargaSatuan: 5800000, Status: "tersedia", Keterangan: "Pendingin ruang server"},
		{KodeBarang: "INV-009", NamaBarang: "Rak Buku Besi 5 Tingkat", Kategori: "Furniture", Merek: "Brother", Jumlah: 8, Lokasi: "Gudang", Kondisi: "Baik", TanggalPengadaan: "2024-05-22", HargaSatuan: 750000, Status: "tersedia", Keterangan: "Rak penyimpanan dokumen"},
		{KodeBarang: "INV-010", NamaBarang: "Scanner Epson DS-530", Kategori: "Elektronik", Merek: "Epson", Jumlah: 1, Lokasi: "Ruang Admin", Kondisi: "Rusak Ringan", TanggalPengadaan: "2025-01-08", HargaSatuan: 5200000, Status: "dalam_perbaikan", Keterangan: "Feeder bermasalah, sedang diperbaiki"},
		{KodeBarang: "INV-011", NamaBarang: "Kertas HVS A4 (Box)", Kategori: "ATK", Merek: "PaperOne", Jumlah: 50, Lokasi: "Gudang", Kondisi: "Baik", TanggalPengadaan: "2026-01-10", HargaSatuan: 55000, Status: "tersedia", Keterangan: "Stok kertas bulanan"},
		{KodeBarang: "INV-012", NamaBarang: "Toner HP 85A Original", Kategori: "ATK", Merek: "HP", Jumlah: 12, Lokasi: "Gudang", Kondisi: "Baik", TanggalPengadaan: "2026-02-15", HargaSatuan: 350000, Status: "tersedia", Keterangan: "Toner untuk printer HP LaserJet"},
		{KodeBarang: "INV-013", NamaBarang: "UPS APC 1200VA", Kategori: "Elektronik", Merek: "APC", Jumlah: 3, Lokasi: "Ruang Server", Kondisi: "Baik", TanggalPengadaan: "2024-09-30", HargaSatuan: 2100000, Status: "tersedia", Keterangan: "Backup listrik server"},
		{KodeBarang: "INV-014", NamaBarang: "Telepon Panasonic KX-TS505", Kategori: "Elektronik", Merek: "Panasonic", Jumlah: 7, Lokasi: "Ruang Resepsionis", Kondisi: "Rusak Berat", TanggalPengadaan: "2023-12-01", HargaSatuan: 450000, Status: "dalam_perbaikan", Keterangan: "Tidak bisa menerima panggilan masuk"},
		{KodeBarang: "INV-015", NamaBarang: "Filing Cabinet 4 Laci", Kategori: "Furniture", Merek: "Datascrip", Jumlah: 5, Lokasi: "Ruang Admin", Kondisi: "Baik", TanggalPengadaan: "2024-07-18", HargaSatuan: 1650000, Status: "dipinjam", Keterangan: "Lemari arsip dokumen penting"},
	}

	result := DB.Create(&barangList)
	if result.Error != nil {
		log.Fatalf("Gagal seed barang: %v", result.Error)
	}
	fmt.Println("✅ Seed 15 data ke tabel 'barang'")
}

func seedPeminjaman() {
	tgl1 := "2026-04-15"
	tgl2 := "2026-04-20"
	tgl3 := "2026-04-25"
	tgl4 := "2026-04-28"
	tgl5 := "2026-05-01"
	tgl6 := "2026-05-05"

	peminjamanList := []models.Peminjaman{
		{KodeBarang: "INV-001", NamaPeminjam: "Andi Pratama", Departemen: "IT", TanggalPinjam: "2026-04-01", TanggalKembali: &tgl1, JumlahPinjam: 1, StatusPinjam: "dikembalikan"},
		{KodeBarang: "INV-006", NamaPeminjam: "Siti Nurhaliza", Departemen: "Marketing", TanggalPinjam: "2026-04-10", TanggalKembali: nil, JumlahPinjam: 1, StatusPinjam: "dipinjam"},
		{KodeBarang: "INV-005", NamaPeminjam: "Budi Santoso", Departemen: "Keuangan", TanggalPinjam: "2026-04-12", TanggalKembali: &tgl2, JumlahPinjam: 1, StatusPinjam: "dikembalikan"},
		{KodeBarang: "INV-015", NamaPeminjam: "Dewi Lestari", Departemen: "HRD", TanggalPinjam: "2026-04-15", TanggalKembali: nil, JumlahPinjam: 2, StatusPinjam: "dipinjam"},
		{KodeBarang: "INV-002", NamaPeminjam: "Rizky Ramadhan", Departemen: "Desain", TanggalPinjam: "2026-04-18", TanggalKembali: &tgl3, JumlahPinjam: 1, StatusPinjam: "dikembalikan"},
		{KodeBarang: "INV-003", NamaPeminjam: "Fajar Nugraha", Departemen: "Operasional", TanggalPinjam: "2026-04-20", TanggalKembali: &tgl4, JumlahPinjam: 3, StatusPinjam: "dikembalikan"},
		{KodeBarang: "INV-011", NamaPeminjam: "Linda Permata", Departemen: "Admin", TanggalPinjam: "2026-04-22", TanggalKembali: nil, JumlahPinjam: 5, StatusPinjam: "dipinjam"},
		{KodeBarang: "INV-001", NamaPeminjam: "Agus Setiawan", Departemen: "Keuangan", TanggalPinjam: "2026-04-25", TanggalKembali: &tgl5, JumlahPinjam: 1, StatusPinjam: "dikembalikan"},
		{KodeBarang: "INV-007", NamaPeminjam: "Maya Sari", Departemen: "Marketing", TanggalPinjam: "2026-05-01", TanggalKembali: nil, JumlahPinjam: 1, StatusPinjam: "dipinjam"},
		{KodeBarang: "INV-012", NamaPeminjam: "Hendro Wijaya", Departemen: "IT", TanggalPinjam: "2026-05-03", TanggalKembali: &tgl6, JumlahPinjam: 2, StatusPinjam: "dikembalikan"},
	}

	result := DB.Create(&peminjamanList)
	if result.Error != nil {
		log.Fatalf("Gagal seed peminjaman: %v", result.Error)
	}
	fmt.Println("✅ Seed 10 data ke tabel 'peminjaman'")
}
