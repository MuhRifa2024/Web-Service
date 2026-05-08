package middleware

import (
	"github.com/gofiber/fiber/v2/middleware/cors"
)

// CORSConfig returns the CORS middleware configuration
func CORSConfig() cors.Config {
	return cors.Config{
		AllowOrigins: "http://localhost:5173, http://127.0.0.1:5173",
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}
}
