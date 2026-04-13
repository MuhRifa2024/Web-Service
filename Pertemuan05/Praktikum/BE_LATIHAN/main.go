package main

import (
	"be_latihan/config"
	"be_latihan/model"
	"be_latihan/router"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	app := fiber.New()
	app.Use(logger.New())

	config.InitDB()
	// AutoMigrate membuat tabel berdasarkan Struct secara otomatis
	config.GetDB().AutoMigrate(&model.Mahasiswa{})
	router.SetupRouter(app)

	app.Listen(":3000")
}