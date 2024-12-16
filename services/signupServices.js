const db = require('../src/config/firebase');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET; 
///const { storeUserDetails } = require('./signupServices'); // Pastikan ini mengarah ke file yang benar

//jadi secara teknikal mungkin seperti ini 

//1. saat verifyIMEI pengguna memasukan IMEI dan jika IMEI ada didalam firebase maka akan lanjut ke tahap 2
//2. pengguna diminta untuk memasukan email lalu send otp 
//3. pengguna akan memasukan otp dan jika benar, maka email di store kedalam firebase
//4.  pengguna akan diminta untuk memasukan detail seperti Nama kendaraan, plate number dan password , confirmed password. 

const verifyIMEI = async (imei) => {
    const imeiRef = db.ref(`users/${imei}`);
    const snapshot = await imeiRef.once('value');
    if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.active && userData.emailVerified) {
            return { success: false, message: 'Gagal, IMEI sudah aktif dan terverifikasi.' };
        } else {
            const token = jwt.sign({ imei }, secretKey, { expiresIn: '24h' });
            return { success: true, message: 'IMEI terdaftar.', token };
        }
    } else {
        return { success: false, message: 'IMEI tidak terdaftar.' };
    }
};

const sendOTP = async (imei, email) => {

    const otp = Math.floor(100000 + Math.random() * 900000).toString();  // 6 digit OTP
    // Membuat referensi ke database
    const usersRef = db.ref(`users`);

    // Mencari entri dengan email yang sama
    const query = usersRef.orderByChild('email').equalTo(email).once('value');
    const snapshot = await query;

    if (snapshot.exists()) {
        // Jika ada entri dengan email yang sama, kirimkan error
        return { success: false, message: 'Email sudah digunakan, silakan gunakan email lain. ' };
    } else {
        // Jika tidak ada, lanjutkan proses
        const userRef = db.ref(`users/${imei}`);
        await userRef.update({
            email: email,  // Menyimpan email baru
            otp: otp,
            otpExpires: Date.now() + 150000  // 2 menit kedaluwarsa
        });

        // Mengatur timeout untuk menghapus data jika storeUserDetails tidak dipanggil dalam 5 menit
        setTimeout(async () => {
            const ref = db.ref(`users/${imei}`);
            const snap = await ref.once('value');
            const userData = snap.val();
            // Hanya menghapus data jika storeUserDetails belum dipanggil (cek jika active masih false)
            if (!userData.active) {
                await ref.update({
                    email: null,
                    otp: null,
                    otpExpires: null,
                    emailVerified : null
                });
            }
            else if (!userData.emailVerified){
                await ref.update ({
                    email: null,
                    otp: null,
                    otpExpires: null,
                });
            }
        }, 300000); // 5 menit
        
        // Konfigurasi nodemailer untuk mengirim email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            }
        });

        

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Your OTP for Verification',
            text: `Your OTP is: ${otp}`
        };

        try {
            await transporter.sendMail(mailOptions);
            return { success: true, message: 'OTP has been sent to your email.' };
        } catch (error) {
            console.error('Failed to send OTP:', error);
            return { success: false, message: 'Failed to send OTP.', error: error.toString() };
        }
    }
};

   
const verifyOTP = async (imei, otpEntered) => {
    const userRef = db.ref(`users/${imei}`);
    const snapshot = await userRef.once('value');
    const { otp, otpExpires } = snapshot.val();

    if (Date.now() > otpExpires) {
        return { success: false, message: 'OTP has expired.' };
    }

    if (otp === otpEntered) {
        await userRef.update({ emailVerified: true }); // Mark email as verified
        return { success: true, message: 'OTP is correct. Email verified.' };
    } else {
        return { success: false, message: 'Incorrect OTP.' };
    }
};

const bcrypt = require('bcrypt');

const storeUserDetails = async (imei, vehicleName, plateNumber, password, confirmPassword) => {
    const userRef = db.ref(`users/${imei}`);

    // Cek apakah password dan confirmPassword cocok
    if (password !== confirmPassword) {
        return { success: false, message: 'Passwords do not match.' };
    }

    // Hash password sebelum menyimpan ke database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update data pengguna dengan password yang sudah di-hash
    await userRef.update({
        vehicleName: vehicleName,
        plateNumber: plateNumber,
        password: hashedPassword, // Menyimpan password yang sudah di-hash
        active: true,
        otp: null,
        otpExpires: null // Membersihkan field otp yang tidak lagi diperlukan
    });

    return { success: true, message: 'User details updated successfully.' };
};


module.exports = {
    verifyIMEI,
    sendOTP,
    verifyOTP,
    storeUserDetails
};
