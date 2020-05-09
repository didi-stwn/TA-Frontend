const url = "http://localhost:3000"
const s = {
    //gettoken
    login: url + "/login",
    refreshtoken: url + "/refresh",

    //log
    readlog: url + "/log/read",
    readstatistiklog: url + "/log/statistik",
    readlogmatkul: url + "/log/logmatkul",
    readstatistikmatkul: url + "/log/statistikmatkul",
    readstatistikall: url + "/log/statistik_all",
    readlogpengajar: url + "/log/pengajar",
    readsolvemahasiswa: url + "/log/solve_mahasiswa/read",
    createsolvemahasiswa: url + "/log/solve_mahasiswa/create",
    deletesolvemahasiswa: url + "/log/solve_mahasiswa/delete",
    readkonfigurasimahasiswa: url + "/log/konfigurasi_mahasiswa/read",
    createkonfigurasimahasiswa: url + "/log/konfigurasi_mahasiswa/create",
    updatekonfigurasimahasiswa: url + "/log/konfigurasi_mahasiswa/edit",
    deletekonfigurasimahasiswa: url + "/log/konfigurasi_mahasiswa/delete",
    createlog: url + "/log/create",
    deletelog: url + "/log/delete",

    //fingerprint
    checkdevice: url + "/fingerprint/check_device",
    readfinger: url + "/fingerprint/read",
    createfinger: url + "/fingerprint/create",
    deletefinger: url + "/fingerprint/delete",

    //pengguna
    readallpengguna: url + "/pengguna/read_all",
    readpengguna: url + "/pengguna/read",
    createpengguna: url + "/pengguna/create",
    updatepengguna: url + "/pengguna/update",
    deletepengguna: url + "/pengguna/delete",

    //filterpengguna
    readfilterpengguna: url + "/filterpengguna/read",
    createfilterpengguna: url + "/filterpengguna/create",
    deletefilterpengguna: url + "/filterpengguna/delete",

    //dosen
    readdosen: url + "/dosen/read",
    createdosen: url + "/dosen/create",
    updatedosen: url + "/dosen/update",
    deletedosen: url + "/dosen/delete",

    //filterdosen
    readfilterdosen: url + "/filterdosen/read",
    createfilterdosen: url + "/filterdosen/create",
    deletefilterdosen: url + "/filterdosen/delete",

    //ruangan
    readruangan: url + "/ruangan/read",
    createruangan: url + "/ruangan/create",
    updateruangan: url + "/ruangan/update",
    updatedeviceruangan: url + "/ruangan/update_device",
    deleteruangan: url + "/ruangan/delete",

    //filterruangan
    readfilterruangan: url + "/filterruangan/read",
    createfilterruangan: url + "/filterruangan/create",
    deletefilterruangan: url + "/filterruangan/delete",

    //fakultasjurusan
    readfakultasjurusan: url + "/fakultasjurusan/read",
    createfakultasjurusan: url + "/fakultasjurusan/create",
    updatefakultasjurusan: url + "/fakultasjurusan/update",
    deletefakultasjurusan: url + "/fakultasjurusan/delete",

    //matkul
    readpenggunamatkul: url + "/matkul/read/pengguna",
    readruanganmatkul: url + "/matkul/read/ruangan",
    readmatkul: url + "/matkul/read",
    creatematkul: url + "/matkul/create",
    updatematkul: url + "/matkul/update",
    deletematkul: url + "/matkul/delete",

    //device
    readdevice: url + "/device/read",
    createdevice: url + "/device/create",
    updatedevice: url + "/device/update",
    deletedevice: url + "/device/delete"
}

module.exports = s
