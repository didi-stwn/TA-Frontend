const url = "http://localhost:3000"
const s ={
    //gettoken
    login: url+"/login",
    refreshtoken: url+"/refresh",

    //log
    readlog: url+"/log/read",
    createlog: url+"/log/create",
    deletelog: url+"/log/delete",

    //fingerprint
    readfinger: url+"/fingerprint/read",
    createfinger: url+"/fingerprint/create",
    deletefinger: url+"/fingerprint/delete",

    //pengguna
    readpengguna: url+"/pengguna/read",
    createpengguna: url+"/pengguna/create",
    updatepengguna: url+"/pengguna/update",
    deletepengguna: url+"/pengguna/delete",
    
    //filterpengguna
    readfilterpengguna: url+"/filterpengguna/read",
    createfilterpengguna: url+"/filterpengguna/create",
    deletefilterpengguna: url+"/filterpengguna/delete",
    
    //ruangan
    readruangan: url+"/ruangan/read",
    createruangan: url+"/ruangan/create",
    updateruangan: url+"/ruangan/update",
    deleteruangan: url+"/ruangan/delete",
    
    //filterruangan
    readfilterruangan: url+"/filterruangan/read",
    createfilterruangan: url+"/filterruangan/create",
    deletefilterruangan: url+"/filterruangan/delete",
    
    //fakultasjurusan
    readfakultasjurusan: url+"/fakultasjurusan/read",
    createfakultasjurusan: url+"/fakultasjurusan/create",
    updatefakultasjurusan: url+"/fakultasjurusan/update",
    deletefakultasjurusan: url+"/fakultasjurusan/delete",
    
    //matkul
    readmatkul: url+"/matkul/read",
    creatematkul: url+"/matkul/create",
    updatematkul: url+"/matkul/update",
    deletematkul: url+"/matkul/delete",
    
    //device
    readdevice: url+"/device/read",
    createdevice: url+"/device/create",
    updatedevice: url+"/device/update",
    deletedevice: url+"/device/delete"
}

module.exports=s
