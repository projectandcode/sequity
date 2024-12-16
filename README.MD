Penjelasan Setiap Folder
/config
Tempat untuk menyimpan pengaturan aplikasi seperti koneksi database atau pengaturan environment.

/controllers
Berisi logika untuk menangani request dan response. Sebagai contoh, userController.js akan memiliki fungsi seperti registerUser, loginUser, dll.

/models
Berisi definisi schema database jika menggunakan ORM seperti Sequelize atau Mongoose.

/routes
Mengatur endpoint aplikasi. Biasanya setiap file mewakili resource seperti userRoutes.js atau productRoutes.js.

/middlewares
Berisi middleware seperti otentikasi (JWT), validasi input, atau error handler.

/services
Tempatkan logika aplikasi yang bersifat modular dan reusable, seperti fungsi untuk mengirim email atau memproses pembayaran.

/utils
Kumpulan helper dan utility yang sering digunakan.

/tests
Folder untuk pengujian kode, bisa menggunakan framework seperti Jest atau Mocha.

/public
Folder untuk file statis yang akan diakses oleh klien, seperti gambar atau CSS.