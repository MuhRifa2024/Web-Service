const jsonFromServer = '{"nama":"John","umur":30,"kota":"Bandung"}';

console.log(jsonFromServer);

const userObject = JSON.parse(jsonFromServer);
console.log("Nama Mahasiswa:", userObject.nama);