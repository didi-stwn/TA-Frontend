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
    readstatistikruangan: url + "/log/statistik_ruangan",
    deleteduplicatelog: url + "/log/delete_duplicate_log",

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
    readmatkultambahanbyruangan: url + "/matkul/tambahan/ruangan/read/",
    readmatkultambahanbymatkul: url + "/matkul/tambahan/matkul/read/",
    creatematkultambahan: url + "/matkul/tambahan/create/" ,
    deletematkultambahan: url + "/matkul/tambahan/delete/",

    //device
    readdevice: url + "/device/read",
    createdevice: url + "/device/create",
    updatedevice: url + "/device/update",
    deletedevice: url + "/device/delete"
}

module.exports = s


// "start": "HTTPS=true SSL_CRT_FILE=./SSL.crt SSL_KEY_FILE=./SSL.key PORT=1234 react-scripts start",


// "-----BEGIN CERTIFICATE-----\n" \
// "MIIEDzCCAvegAwIBAgIUSUYuPzJUd6C8yVtf5b6Qp4oiJzUwDQYJKoZIhvcNAQEL\n" \
// "BQAwgZYxCzAJBgNVBAYTAklEMRMwEQYDVQQIDApKQVdBIEJBUkFUMRAwDgYDVQQH\n" \
// "DAdCQU5EVU5HMREwDwYDVQQKDAhUQUJTRU5TSTELMAkGA1UECwwCVEExGTAXBgNV\n" \
// "BAMMEHd3dy50YWJzZW5zaS5jb20xJTAjBgkqhkiG9w0BCQEWFmRpZGkuc3R3bi4x\n" \
// "NkBnbWFpbC5jb20wHhcNMjAwNjA0MTQxOTU1WhcNMjEwNjA0MTQxOTU1WjCBljEL\n" \
// "MAkGA1UEBhMCSUQxEzARBgNVBAgMCkpBV0EgQkFSQVQxEDAOBgNVBAcMB0JBTkRV\n" \
// "TkcxETAPBgNVBAoMCFRBQlNFTlNJMQswCQYDVQQLDAJUQTEZMBcGA1UEAwwQd3d3\n" \
// "LnRhYnNlbnNpLmNvbTElMCMGCSqGSIb3DQEJARYWZGlkaS5zdHduLjE2QGdtYWls\n" \
// "LmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMynk1s8550OPd9W\n" \
// "9J4DTQwd7ksnpsqDf0PXKIA0FgjMwcNJBhm3p+mvvI16AfkTMU8sB1eDKvCpuvDu\n" \
// "f6FklzN7QNUXc9aywSiKSuuf5cu+CEzTqNb/EqulLzDJXev2ZdaZydoi3llRB45K\n" \
// "qg/vRsGYUmZmlJfwoUWICXr/TylsEOvKLeN19j5s+Nvf0QQabZvqDpa6BwowCVzj\n" \
// "zGbBVG+OrtauALkUKSBg+yrGxQMxuK6lWZ336O2jIkf2KtaH4uLu2QjbheEcu6SQ\n" \
// "2DYjkODw8eSnK8QbGbPU5kGeXR5wRSI0VQIU09EhSd875aFEJQHW+Bu2vx+4AhJk\n" \
// "ReIXioMCAwEAAaNTMFEwHQYDVR0OBBYEFOI1fxBQaMj2oemvzzjZBZhQPGS5MB8G\n" \
// "A1UdIwQYMBaAFOI1fxBQaMj2oemvzzjZBZhQPGS5MA8GA1UdEwEB/wQFMAMBAf8w\n" \
// "DQYJKoZIhvcNAQELBQADggEBAHofW4SSNfxxbcXnbLZ+WL7LFEL+e/U785NNOEZZ\n" \
// "xtArxLAyi6SYLwSl5brYDsYYqIJbKpN5pvkELmtySuXFBsu16d4S9jbKi1RBRJaI\n" \
// "jBmMZqfSQNozD8UEKQZxrEFvULNQaUv1XvtV0LxN5f0g8qad8vDLlWSZl0EmyhoM\n" \
// "UxGLKlP/Ot9jqKgdzOT2ErtgzIwWV0OZG3WsTx2/OKNn23jezgmR0bT5R3unHNnE\n" \
// "kWdmYBbqMYn99CrfGa7B/K2lRsBg5wQZynGHsla508oPJywf2imVczpCoyxPz8yv\n" \
// "GEeYpl6RNObucMA7IbWz7Xc5p8FWzCXXOLKNv5KuFxza2nI=\n" \
// "-----END CERTIFICATE-----\n" ;