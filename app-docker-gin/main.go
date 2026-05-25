package main

import (
	"database/sql"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var db *sql.DB

func main() {
	godotenv.Load()

	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbName := os.Getenv("DB_NAME")

	dsn := dbUser + ":" + dbPass + "@tcp(" + dbHost + ")/" + dbName

	var err error
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		panic("Error conectando a MySQL: " + err.Error())
	}
	defer db.Close()

	
	initDB()

	r := gin.Default()

	
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
			"time":   time.Now(),
		})
	})

	
	r.GET("/db-status", func(c *gin.Context) {
		err := db.Ping()
		if err != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{
				"connected": false,
				"error":     err.Error(),
			})
			return
		}
		var result string
		db.QueryRow("SELECT NOW()").Scan(&result)
		c.JSON(http.StatusOK, gin.H{
			"connected": true,
			"db_time":   result,
		})
	})

	//el created_at y el id (AI) ya lo pone directo no hace falta ponerlo en POSTMAN
	r.POST("/create-item", func(c *gin.Context) {
		var body struct {
			Nombre string `json:"nombre"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		res, err := db.Exec("INSERT INTO items (nombre) VALUES (?)", body.Nombre)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		id, _ := res.LastInsertId()
		c.JSON(http.StatusCreated, gin.H{"id": id, "nombre": body.Nombre})
	})

	
	r.GET("/items", func(c *gin.Context) {
		rows, err := db.Query("SELECT id, nombre, created_at FROM items")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		var items []gin.H
		for rows.Next() {
			var id int
			var nombre, createdAt string
			rows.Scan(&id, &nombre, &createdAt)
			items = append(items, gin.H{"id": id, "nombre": nombre, "created_at": createdAt})
		}
		c.JSON(http.StatusOK, items)
	})

	r.Run(":8080")
}

func initDB() {
	db.Exec(`CREATE TABLE IF NOT EXISTS items (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        nombre     VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`)
}