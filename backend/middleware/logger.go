package middleware

import (
	"github.com/gofiber/fiber/v2/middleware/logger"
)

// LoggerConfig returns the Logger middleware configuration
func LoggerConfig() logger.Config {
	return logger.Config{
		Format:     "[${time}] ${status} - ${latency} ${method} ${path}\n",
		TimeFormat: "2006/01/02 15:04:05",
		TimeZone:   "Asia/Jakarta",
	}
}
