package handlers

import (
	"inventaris-kantor-api/config"
	"inventaris-kantor-api/models"
	"inventaris-kantor-api/validators"

	"github.com/gofiber/fiber/v2"
)

// GetAllPeminjaman mengambil seluruh data peminjaman
func GetAllPeminjaman(c *fiber.Ctx) error {
	db := config.GetDB()
	var peminjamanList []models.Peminjaman

	if err := db.Order("created_at DESC").Find(&peminjamanList).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.Response{
			Message: "Gagal mengambil data peminjaman",
			Error:   err.Error(),
		})
	}

	// Join nama_barang dari tabel barang
	for i := range peminjamanList {
		var barang models.Barang
		if err := db.Select("nama_barang").Where("kode_barang = ?", peminjamanList[i].KodeBarang).First(&barang).Error; err == nil {
			peminjamanList[i].NamaBarang = barang.NamaBarang
		}
	}

	return c.JSON(models.Response{
		Message: "Data peminjaman berhasil diambil",
		Data:    peminjamanList,
	})
}

// GetPeminjamanByID mengambil peminjaman berdasarkan ID
func GetPeminjamanByID(c *fiber.Ctx) error {
	db := config.GetDB()
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.Response{
			Message: "ID harus berupa angka",
			Error:   err.Error(),
		})
	}

	var peminjaman models.Peminjaman
	if err := db.Where("id_peminjaman = ?", id).First(&peminjaman).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(models.Response{
			Message: "Data peminjaman tidak ditemukan",
		})
	}

	// Join nama_barang
	var barang models.Barang
	if err := db.Select("nama_barang").Where("kode_barang = ?", peminjaman.KodeBarang).First(&barang).Error; err == nil {
		peminjaman.NamaBarang = barang.NamaBarang
	}

	return c.JSON(models.Response{
		Message: "Data peminjaman ditemukan",
		Data:    peminjaman,
	})
}

// CreatePeminjaman menambahkan data peminjaman baru
func CreatePeminjaman(c *fiber.Ctx) error {
	db := config.GetDB()
	var input models.PeminjamanInput

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.Response{
			Message: "Format data tidak valid",
			Error:   err.Error(),
		})
	}

	if input.StatusPinjam == "" {
		input.StatusPinjam = "dipinjam"
	}

	validationErrors := validators.ValidatePeminjaman(input)
	if len(validationErrors) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(models.Response{
			Message: "Validasi gagal",
			Error:   joinErrors(validationErrors),
		})
	}

	peminjaman := models.Peminjaman{
		KodeBarang:     input.KodeBarang,
		NamaPeminjam:   input.NamaPeminjam,
		Departemen:     input.Departemen,
		TanggalPinjam:  input.TanggalPinjam,
		TanggalKembali: input.TanggalKembali,
		JumlahPinjam:   input.JumlahPinjam,
		StatusPinjam:   input.StatusPinjam,
	}

	if err := db.Create(&peminjaman).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.Response{
			Message: "Gagal menambahkan peminjaman",
			Error:   err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(models.Response{
		Message: "Peminjaman berhasil ditambahkan",
		Data:    peminjaman,
	})
}

// UpdatePeminjaman mengubah data peminjaman
func UpdatePeminjaman(c *fiber.Ctx) error {
	db := config.GetDB()
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.Response{
			Message: "ID harus berupa angka",
			Error:   err.Error(),
		})
	}

	var existing models.Peminjaman
	if err := db.Where("id_peminjaman = ?", id).First(&existing).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(models.Response{
			Message: "Data peminjaman tidak ditemukan",
		})
	}

	var input models.PeminjamanInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.Response{
			Message: "Format data tidak valid",
			Error:   err.Error(),
		})
	}

	validationErrors := validators.ValidatePeminjaman(input)
	if len(validationErrors) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(models.Response{
			Message: "Validasi gagal",
			Error:   joinErrors(validationErrors),
		})
	}

	db.Model(&existing).Updates(map[string]interface{}{
		"kode_barang":     input.KodeBarang,
		"nama_peminjam":   input.NamaPeminjam,
		"departemen":      input.Departemen,
		"tanggal_pinjam":  input.TanggalPinjam,
		"tanggal_kembali": input.TanggalKembali,
		"jumlah_pinjam":   input.JumlahPinjam,
		"status_pinjam":   input.StatusPinjam,
	})

	existing.KodeBarang = input.KodeBarang
	existing.NamaPeminjam = input.NamaPeminjam
	existing.Departemen = input.Departemen
	existing.TanggalPinjam = input.TanggalPinjam
	existing.TanggalKembali = input.TanggalKembali
	existing.JumlahPinjam = input.JumlahPinjam
	existing.StatusPinjam = input.StatusPinjam

	return c.JSON(models.Response{
		Message: "Peminjaman berhasil diupdate",
		Data:    existing,
	})
}

// DeletePeminjaman menghapus data peminjaman
func DeletePeminjaman(c *fiber.Ctx) error {
	db := config.GetDB()
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.Response{
			Message: "ID harus berupa angka",
			Error:   err.Error(),
		})
	}

	result := db.Where("id_peminjaman = ?", id).Delete(&models.Peminjaman{})
	if result.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(models.Response{
			Message: "Data peminjaman tidak ditemukan",
		})
	}

	return c.JSON(models.Response{
		Message: "Peminjaman berhasil dihapus",
	})
}
