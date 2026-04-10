package main

import (
	"be_latihan/config"
	"be_latihan/model"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	config.InitDB()
	// AutoMigrate membuat tabel berdasarkan Struct secara otomatis
	config.GetDB().AutoMigrate(&model.Mahasiswa{})

	app.Listen(":3000")
}