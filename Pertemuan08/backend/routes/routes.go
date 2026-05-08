package routes

import (
	"inventaris-kantor-api/handlers"

	"github.com/gofiber/fiber/v2"
)

// Setup registers all API routes
func Setup(app *fiber.App) {
	api := app.Group("/api")

	// Barang routes
	barang := api.Group("/barang")
	barang.Get("/", handlers.GetAllBarang)
	barang.Get("/:kode", handlers.GetBarangByKode)
	barang.Post("/", handlers.CreateBarang)
	barang.Put("/:kode", handlers.UpdateBarang)
	barang.Delete("/:kode", handlers.DeleteBarang)

	// Peminjaman routes
	peminjaman := api.Group("/peminjaman")
	peminjaman.Get("/", handlers.GetAllPeminjaman)
	peminjaman.Get("/:id", handlers.GetPeminjamanByID)
	peminjaman.Post("/", handlers.CreatePeminjaman)
	peminjaman.Put("/:id", handlers.UpdatePeminjaman)
	peminjaman.Delete("/:id", handlers.DeletePeminjaman)
}
