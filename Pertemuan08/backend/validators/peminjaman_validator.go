package validators

import (
	"fmt"
	"inventaris-kantor-api/config"
	"inventaris-kantor-api/models"
	"time"
)

// ValidatePeminjaman validates input for creating/updating a Peminjaman
func ValidatePeminjaman(p models.PeminjamanInput) []string {
	var errors []string

	// Required fields
	if p.KodeBarang == "" {
		errors = append(errors, "Kode barang wajib diisi")
	}
	if p.NamaPeminjam == "" {
		errors = append(errors, "Nama peminjam wajib diisi")
	}
	if p.Departemen == "" {
		errors = append(errors, "Departemen wajib diisi")
	}
	if p.TanggalPinjam == "" {
		errors = append(errors, "Tanggal pinjam wajib diisi")
	}

	// Character length validation
	if len(p.NamaPeminjam) > 200 {
		errors = append(errors, "Nama peminjam maksimal 200 karakter")
	}
	if len(p.Departemen) > 100 {
		errors = append(errors, "Departemen maksimal 100 karakter")
	}

	// Numeric validation
	if p.JumlahPinjam < 1 {
		errors = append(errors, "Jumlah pinjam minimal 1")
	}

	// Enum validation - Status Pinjam
	if p.StatusPinjam != "" {
		validStatus := map[string]bool{"dipinjam": true, "dikembalikan": true}
		if !validStatus[p.StatusPinjam] {
			errors = append(errors, fmt.Sprintf("Status pinjam tidak valid. Gunakan: dipinjam atau dikembalikan"))
		}
	}

	// Date format validation - tanggal pinjam
	var tglPinjam time.Time
	if p.TanggalPinjam != "" {
		var err error
		tglPinjam, err = time.Parse("2006-01-02", p.TanggalPinjam)
		if err != nil {
			errors = append(errors, "Format tanggal pinjam harus YYYY-MM-DD")
		}
	}

	// Date format validation - tanggal kembali (optional)
	if p.TanggalKembali != nil && *p.TanggalKembali != "" {
		tglKembali, err := time.Parse("2006-01-02", *p.TanggalKembali)
		if err != nil {
			errors = append(errors, "Format tanggal kembali harus YYYY-MM-DD")
		} else if !tglPinjam.IsZero() && tglKembali.Before(tglPinjam) {
			errors = append(errors, "Tanggal kembali harus setelah atau sama dengan tanggal pinjam")
		}
	}

	// Check if kode_barang exists in barang table using GORM
	if p.KodeBarang != "" {
		var count int64
		config.DB.Model(&models.Barang{}).Where("kode_barang = ?", p.KodeBarang).Count(&count)
		if count == 0 {
			errors = append(errors, fmt.Sprintf("Kode barang '%s' tidak ditemukan di data barang", p.KodeBarang))
		}
	}

	return errors
}
