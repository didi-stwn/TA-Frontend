const url = "http://localhost:3000"
const s = {
    //gettoken
    login: url + "/login",
    refreshtoken: url + "/refresh",

    //log
    readlog: url + "/log/read",
    readstatistiklog: url + "/log/statistik",
    readlogpengajar: url + "/log/pengajar",
    createlog: url + "/log/create",
    deletelog: url + "/log/delete",

    //fingerprint
    checkdevice: url + "/fingerprint/check_device",
    readfinger: url + "/fingerprint/read",
    createfinger: url + "/fingerprint/create",
    deletefinger: url + "/fingerprint/delete",

    //pengguna
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

// import React from "react";
// import ReactExport from "react-data-export";
// import { withRouter } from 'react-router-dom';
// import get from './config';

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
// const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

// class Laporan extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             data: [],
//             sortby: 'fakultas',
//             ascdsc: 'asc',
//             search: '',
//             page: 1,
//             limit: 20
//         };
//     }

//     componentDidMount() {
//         const { sortby, ascdsc, search, limit, page } = this.state
//         fetch(get.readpengguna, {
//             method: 'post',
//             headers: {
//                 "x-access-token": sessionStorage.name,
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 sortby: sortby,
//                 ascdsc: ascdsc,
//                 search: search,
//                 limit: limit,
//                 page: page,
//             })
//         })
//             .then(response => response.json())
//             .then(response => {
//                 //berhasil dapet data
//                 if ((response.status === 1) && (response.count !== 0)) {
//                     this.setState({ data: response.hasil })
//                     this.setState({ datakosong: false })
//                 }
//                 else if ((response.status === 1) && (response.count === 0)) {
//                     this.setState({ datakosong: true })
//                 }
//                 //ga dapet token
//                 else if ((response.status !== 1) && (response.status !== 0)) {
//                     sessionStorage.removeItem("name")
//                     window.location.reload()
//                 }
//             })
//             .catch(error => {
//                 sessionStorage.removeItem("name")
//                 window.location.reload()
//             })
//     }

//     render() {
//         console.log(this.state.data)
//         const dataSet1 = this.state.data.map(isi => {
//             return {
//                 fakultas: isi.fakultas,
//                 jurusan: isi.jurusan,
//                 nim: isi.nim,
//                 nama: isi.nama
//             }
//         })
//         console.log(dataSet1)
//         return (
//             <ExcelFile element={<button>Download Data</button>}>
//                 <ExcelSheet data={dataSet1} name="Employees">
//                     <ExcelColumn label="Fakultas" value="fakultas" />
//                     <ExcelColumn label="Jurusan" value="jurusan" />
//                     <ExcelColumn label="NIM" value="nim" />
//                     <ExcelColumn label="Nama" value="nama" />
//                 </ExcelSheet>
//             </ExcelFile>
//         );
//     }
// }

// export default withRouter(Laporan);
