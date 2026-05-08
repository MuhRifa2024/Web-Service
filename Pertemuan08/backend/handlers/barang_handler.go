package handlers

import (
	"inventaris-kantor-api/config"
	"inventaris-kantor-api/models"
	"inventaris-kantor-api/validators"

	"github.com/gofiber/fiber/v2"
)

// GetAllBarang mengambil seluruh data barang
func GetAllBarang(c *fiber.Ctx) error {
	db := config.GetDB()
	var barangList []models.Barang

	if err := db.Order("created_at DESC").Find(&barangList).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.Response{
			Message: "Gagal mengambil data barang",
			Error:   err.Error(),
		})
	}

	return c.JSON(models.Response{
		Message: "Data barang berhasil diambil",
		Data:    barangList,
	})
}

// GetBarangByKode mengambil barang berdasarkan kode_barang
func GetBarangByKode(c *fiber.Ctx) error {
	db := config.GetDB()
	kode := c.Params("kode")

	var barang models.Barang
	if err := db.Where("kode_barang = ?", kode).First(&barang).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(models.Response{
			Message: "Barang tidak ditemukan",
			Error:   "Kode barang '" + kode + "' tidak ada di database",
		})
	}

	return c.JSON(models.Response{
		Message: "Barang ditemukan",
		Data:    barang,
	})
}

// CreateBarang menambahkan barang baru
func CreateBarang(c *fiber.Ctx) error {
	db := config.GetDB()
	var barang models.Barang

	if err := c.BodyParser(&barang); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.Response{
			Message: "Format data tidak valid",
			Error:   err.Error(),
		})
	}

	if barang.Status == "" {
		barang.Status = "tersedia"
	}

	// Validasi input
	validationErrors := validators.ValidateBarang(barang, true)
	if len(validationErrors) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(models.Response{
			Message: "Validasi gagal",
			Error:   joinErrors(validationErrors),
		})
	}

	// Cek duplikat kode_barang
	var count int64
	db.Model(&models.Barang{}).Where("kode_barang = ?", barang.KodeBarang).Count(&count)
	if count > 0 {
		return c.Status(fiber.StatusConflict).JSON(models.Response{
			Message: "Kode barang sudah digunakan",
			Error:   "Kode barang '" + barang.KodeBarang + "' sudah ada di database",
		})
	}

	if err := db.Create(&barang).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.Response{
			Message: "Gagal menambahkan barang",
			Error:   err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(models.Response{
		Message: "Barang berhasil ditambahkan",
		Data:    barang,
	})
}

// UpdateBarang mengubah data barang berdasarkan kode
func UpdateBarang(c *fiber.Ctx) error {
	db := config.GetDB()
	kode := c.Params("kode")

	var existing models.Barang
	if err := db.Where("kode_barang = ?", kode).First(&existing).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(models.Response{
			Message: "Barang tidak ditemukan",
			Error:   "Kode barang '" + kode + "' tidak ada di database",
		})
	}

	var barang models.Barang
	if err := c.BodyParser(&barang); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.Response{
			Message: "Format data tidak valid",
			Error:   err.Error(),
		})
	}

	validationErrors := validators.ValidateBarang(barang, false)
	if len(validationErrors) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(models.Response{
			Message: "Validasi gagal",
			Error:   joinErrors(validationErrors),
		})
	}

	db.Model(&existing).Updates(models.Barang{
		NamaBarang:       barang.NamaBarang,
		Kategori:         barang.Kategori,
		Merek:            barang.Merek,
		Jumlah:           barang.Jumlah,
		Lokasi:           barang.Lokasi,
		Kondisi:          barang.Kondisi,
		TanggalPengadaan: barang.TanggalPengadaan,
		HargaSatuan:      barang.HargaSatuan,
		Status:           barang.Status,
		Keterangan:       barang.Keterangan,
	})

	barang.KodeBarang = kode
	return c.JSON(models.Response{
		Message: "Barang berhasil diupdate",
		Data:    barang,
	})
}

// DeleteBarang menghapus barang berdasarkan kode
func DeleteBarang(c *fiber.Ctx) error {
	db := config.GetDB()
	kode := c.Params("kode")

	result := db.Where("kode_barang = ?", kode).Delete(&models.Barang{})
	if result.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(models.Response{
			Message: "Barang tidak ditemukan",
			Error:   "Kode barang '" + kode + "' tidak ada di database",
		})
	}

	return c.JSON(models.Response{
		Message: "Barang berhasil dihapus",
	})
}

// joinErrors menggabungkan slice error jadi satu string
func joinErrors(errors []string) string {
	result := ""
	for i, e := range errors {
		if i > 0 {
			result += "; "
		}
		result += e
	}
	return result
}
