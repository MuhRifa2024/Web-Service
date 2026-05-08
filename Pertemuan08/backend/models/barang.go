package models

import "time"

// Barang represents an inventory item in the office
type Barang struct {
	KodeBarang       string    `json:"kode_barang" gorm:"column:kode_barang;primaryKey;type:varchar(50)"`
	NamaBarang       string    `json:"nama_barang" gorm:"column:nama_barang;type:varchar(255);not null"`
	Kategori         string    `json:"kategori" gorm:"column:kategori;type:varchar(100);not null"`
	Merek            string    `json:"merek" gorm:"column:merek;type:varchar(150)"`
	Jumlah           int       `json:"jumlah" gorm:"column:jumlah;type:integer;not null;check:jumlah >= 0"`
	Lokasi           string    `json:"lokasi" gorm:"column:lokasi;type:varchar(200);not null"`
	Kondisi          string    `json:"kondisi" gorm:"column:kondisi;type:varchar(50);not null"`
	TanggalPengadaan string    `json:"tanggal_pengadaan" gorm:"column:tanggal_pengadaan;type:date;not null"`
	HargaSatuan      float64   `json:"harga_satuan" gorm:"column:harga_satuan;type:decimal(15,2);not null;check:harga_satuan >= 0"`
	Status           string    `json:"status" gorm:"column:status;type:varchar(50);default:'tersedia'"`
	Keterangan       string    `json:"keterangan" gorm:"column:keterangan;type:text"`
	CreatedAt        time.Time `json:"created_at" gorm:"column:created_at;autoCreateTime"`
}

// TableName overrides the default table name
func (Barang) TableName() string {
	return "barang"
}
