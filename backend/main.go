package main

import (
	"log"
	"os"

	"inventaris-kantor-api/config"
	mw "inventaris-kantor-api/middleware"
	"inventaris-kantor-api/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	// Inisialisasi database (load .env + koneksi + migrate + seed)
	config.InitDB()
	config.AutoMigrate()
	config.AutoSeed()

	// Buat Fiber app
	app := fiber.New(fiber.Config{
		AppName: "Inventaris Kantor API v1.0",
	})

	// Register middleware
	app.Use(logger.New(mw.LoggerConfig()))
	app.Use(cors.New(mw.CORSConfig()))

	// Register routes
	routes.Setup(app)

	// Health check
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Inventaris Kantor API is running",
			"version": "1.0.0",
		})
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("🚀 Server berjalan di port %s", port)
	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Gagal menjalankan server: %v", err)
	}
}
