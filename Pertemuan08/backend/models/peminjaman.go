package models

import "time"

// Peminjaman represents a borrowing record
type Peminjaman struct {
	IDPeminjaman   int       `json:"id_peminjaman" gorm:"column:id_peminjaman;primaryKey;autoIncrement"`
	KodeBarang     string    `json:"kode_barang" gorm:"column:kode_barang;type:varchar(50);not null"`
	NamaPeminjam   string    `json:"nama_peminjam" gorm:"column:nama_peminjam;type:varchar(200);not null"`
	Departemen     string    `json:"departemen" gorm:"column:departemen;type:varchar(100);not null"`
	TanggalPinjam  string    `json:"tanggal_pinjam" gorm:"column:tanggal_pinjam;type:date;not null"`
	TanggalKembali *string   `json:"tanggal_kembali" gorm:"column:tanggal_kembali;type:date"`
	JumlahPinjam   int       `json:"jumlah_pinjam" gorm:"column:jumlah_pinjam;type:integer;not null"`
	StatusPinjam   string    `json:"status_pinjam" gorm:"column:status_pinjam;type:varchar(50);default:'dipinjam'"`
	CreatedAt      time.Time `json:"created_at" gorm:"column:created_at;autoCreateTime"`
	// Joined field (not a DB column)
	NamaBarang string `json:"nama_barang,omitempty" gorm:"-"`
}

// TableName overrides the default table name
func (Peminjaman) TableName() string {
	return "peminjaman"
}

// PeminjamanInput is used for create/update request body parsing
type PeminjamanInput struct {
	KodeBarang     string  `json:"kode_barang"`
	NamaPeminjam   string  `json:"nama_peminjam"`
	Departemen     string  `json:"departemen"`
	TanggalPinjam  string  `json:"tanggal_pinjam"`
	TanggalKembali *string `json:"tanggal_kembali"`
	JumlahPinjam   int     `json:"jumlah_pinjam"`
	StatusPinjam   string  `json:"status_pinjam"`
}
