package validators

import (
	"fmt"
	"inventaris-kantor-api/models"
	"time"
)

// ValidateBarang validates input for creating/updating a Barang
func ValidateBarang(b models.Barang, isCreate bool) []string {
	var errors []string

	// Required fields
	if b.KodeBarang == "" && isCreate {
		errors = append(errors, "Kode barang wajib diisi")
	}
	if b.NamaBarang == "" {
		errors = append(errors, "Nama barang wajib diisi")
	}
	if b.Kategori == "" {
		errors = append(errors, "Kategori wajib diisi")
	}
	if b.Lokasi == "" {
		errors = append(errors, "Lokasi wajib diisi")
	}
	if b.Kondisi == "" {
		errors = append(errors, "Kondisi wajib diisi")
	}
	if b.TanggalPengadaan == "" {
		errors = append(errors, "Tanggal pengadaan wajib diisi")
	}

	// Character length validation
	if len(b.KodeBarang) > 50 {
		errors = append(errors, "Kode barang maksimal 50 karakter")
	}
	if len(b.NamaBarang) > 255 {
		errors = append(errors, "Nama barang maksimal 255 karakter")
	}
	if len(b.Kategori) > 100 {
		errors = append(errors, "Kategori maksimal 100 karakter")
	}
	if len(b.Merek) > 150 {
		errors = append(errors, "Merek maksimal 150 karakter")
	}
	if len(b.Lokasi) > 200 {
		errors = append(errors, "Lokasi maksimal 200 karakter")
	}

	// Numeric validation
	if b.Jumlah < 0 {
		errors = append(errors, "Jumlah tidak boleh negatif")
	}
	if b.HargaSatuan < 0 {
		errors = append(errors, "Harga satuan tidak boleh negatif")
	}

	// Enum validation - Kondisi
	validKondisi := map[string]bool{"Baik": true, "Rusak Ringan": true, "Rusak Berat": true}
	if b.Kondisi != "" && !validKondisi[b.Kondisi] {
		errors = append(errors, fmt.Sprintf("Kondisi tidak valid. Gunakan: Baik, Rusak Ringan, atau Rusak Berat"))
	}

	// Enum validation - Status
	if b.Status != "" {
		validStatus := map[string]bool{"tersedia": true, "dipinjam": true, "dalam_perbaikan": true}
		if !validStatus[b.Status] {
			errors = append(errors, fmt.Sprintf("Status tidak valid. Gunakan: tersedia, dipinjam, atau dalam_perbaikan"))
		}
	}

	// Date format validation
	if b.TanggalPengadaan != "" {
		_, err := time.Parse("2006-01-02", b.TanggalPengadaan)
		if err != nil {
			errors = append(errors, "Format tanggal pengadaan harus YYYY-MM-DD")
		}
	}

	return errors
}
