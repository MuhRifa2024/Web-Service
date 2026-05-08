const data = require('./data.json');

// tampilkan semua data
console.log(data);

// ambil data tertentu
console.log(data[0].nama); // Andi

// loop data
data.forEach(item => {
  console.log(item.nama);
});
