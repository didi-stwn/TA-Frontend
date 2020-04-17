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

import React, { Component } from 'react';
import Pdf from "react-to-pdf"
import ReactExport from "react-data-export";
import { withRouter } from 'react-router-dom';
import get from './config';


const ref = React.createRef();
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

class Laporan_Pengajar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_mahasiswa: [],
            data_dosen: [],
            data_matkul: [],
            nim_form: '',
            nim: '',
            nama_form: '',
            nama: '',
            startDate: '',
            endDate: '',
            nimuser: '',
            find_pressed: false,
            datasalah: false,
            datakosong: true,
        };
        this.handleChange = this.handleChange.bind(this);
        this.getNameFilter = this.getNameFilter.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        const { nim_form, startDate, endDate, nama_form } = this.state
        fetch(get.readstatistiklog + "/" + nim_form, {
            method: 'post',
            headers: {
                "x-access-token": sessionStorage.name,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                startDate: startDate,
                endDate: endDate
            })
        })
            .then(response => response.json())
            .then(response => {
                //berhasil dapet data
                if ((response.status === 1) && (response.log_dosen.length !== 0) && (response.matkul.length !== 0)) {
                    this.setState({
                        find_pressed: true,
                        nama: nama_form,
                        nim: nim_form,
                        datakosong: false,
                        data_mahasiswa: response.log_mahasiswa,
                        data_dosen: response.log_dosen,
                        data_matkul: response.matkul,
                    })
                }
                else if ((response.status === 1) && ((response.log_dosen.length === 0) || (response.matkul.length === 0))) {
                    this.setState({
                        datakosong: true,
                        find_pressed: true,
                        nama: nama_form,
                        nim: nim_form,
                    })
                }
                //ga dapet token
                else if ((response.status !== 1) && (response.status !== 0)) {
                    sessionStorage.removeItem("name")
                    window.location.reload()
                }
            })
            .catch(error => {
                sessionStorage.removeItem("name")
                window.location.reload()
            })
    }

    getNameFilter(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
        var lengthnama;

        lengthnama = value.length;

        if (lengthnama === 8) {
            fetch(get.readpengguna, {
                method: 'post',
                headers: {
                    "x-access-token": sessionStorage.name,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sortby: "nim",
                    ascdsc: "asc",
                    search: value,
                    limit: "1",
                    page: "1",
                })
            })
                .then(response => response.json())
                .then(response => {
                    //berhasil dapet data
                    if ((response.status === 1) && (response.count === 1)) {
                        this.setState({ nama_form: response.hasil[0].nama })
                    }
                    else if ((response.status === 1) && (response.count !== 1)) {
                        this.setState({ nama_form: '' })
                    }
                    //ga dapet token
                    else if ((response.status !== 1) && (response.status !== 0)) {
                        sessionStorage.removeItem("name")
                        window.location.reload()
                    }
                })
                .catch(error => {
                    sessionStorage.removeItem("name")
                    window.location.reload()
                })
        }

        else {
            this.setState({ nama_form: '' })
        }
    }

    getDataTable(matkul, datadosen, datamahasiswa, col){
        return("hehe")
    }

    render() {
        const state = this.state

        function getDataXcl(a) {
            var data = new Array(a.length);
            for (var i = 0; i < a.length; i++) {
                data[i] = new Array(9)

                data[i][0] = " "
                data[i][1] = " "
                data[i][2] = " "
                data[i][3] = " "
                data[i][4] = " "
                data[i][5] = " "
                data[i][6] = " "
                data[i][7] = " "
                data[i][8] = " "
            }
            return data
        }

        const dataXcl = [
            {
                columns: [" ", " ", " ", " ", " ", " ", " ", " ", " "],
                data: [
                    ["NIM/NIP", " "],
                    ["Nama", " "],
                    ["Nama Ruangan", " "],
                    [" "],
                    [" "],
                    [" ", " ", " ", "Pencetak", "ADMIN"],
                    // [" "," "," ","Pencetak",sessionStorage.message ],
                    ["Periode", " ", " ", "Tanggal Cetak", " ",]
                ]
            },

            {
                ySteps: 2,
                columns: [
                    { title: "No", width: { wpx: 30 } },
                    { title: "Hari, Tanggal", width: { wpx: 120 } },
                    { title: "Jam Masuk", width: { wpx: 100 } },
                    { title: "Jam Keluar", width: { wpx: 100 } },
                    { title: "Total Jam/Hari", width: { wpx: 100 } },
                    { title: "Alfa", width: { wpx: 50 } },
                    { title: "Izin", width: { wpx: 50 } },
                    { title: "Sakit", width: { wpx: 50 } },
                    { title: "Keterangan", width: { wpx: 100 } },
                ],
                data: getDataXcl(1)
            }
        ]

        function PeriodeCetak(start, end) {
            var hasil, awal, akhir, tahunawal, tahunakhir, bulanawal, bulanakhir, tanggalawal, tanggalakhir, tglawal, tglakhir;
            awal = new Date(start);
            akhir = new Date(end);

            tahunawal = String(awal.getFullYear())
            tahunakhir = String(akhir.getFullYear())

            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            bulanawal = months[(awal.getMonth())]
            bulanakhir = months[(akhir.getMonth())]

            tglawal = awal.getDate()
            tglakhir = akhir.getDate()

            if (tglawal <= 9) {
                tanggalawal = "0" + String(tglawal)
            }
            else {
                tanggalawal = String(tglawal)
            }

            if (tglakhir <= 9) {
                tanggalakhir = "0" + String(tglakhir)
            }
            else {
                tanggalakhir = String(tglakhir)
            }

            hasil = tanggalawal + " " + bulanawal + " " + tahunawal + " - " + tanggalakhir + " " + bulanakhir + " " + tahunakhir
            if (state.find_pressed) {
                return (
                    hasil
                )
            }
        }

        function sekarang(a) {
            var hasil, tgl, tanggal, bulan, tahun, j, jam, m, menit;
            tgl = a.getDate();
            if (tgl <= 9) {
                tanggal = "0" + String(tgl)
            }
            else {
                tanggal = String(tgl)
            }
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            bulan = months[(a.getMonth())]
            tahun = a.getFullYear();
            j = a.getHours()
            if (j <= 9) {
                jam = "0" + String(j)
            }
            else {
                jam = String(j)
            }
            m = a.getMinutes()
            if (m <= 9) {
                menit = "0" + String(m)
            }
            else {
                menit = String(m)
            }
            hasil = bulan + " " + tanggal + ", " + tahun + " " + jam + ":" + menit + ":00"
            if (state.find_pressed) {
                return (
                    hasil
                )
            }
        }

        var i = 1
        return (
            <div>
                <div className="kotakfilter2">
                    <form className="kotakforminputlogpintu" onSubmit={this.handleSubmit}>
                        <div className="kotakinputlaporannim">
                            <label> NIM </label> <br></br>
                            <input name="nim_form" onChange={this.getNameFilter} className="inputformlaporannim" type="text" placeholder="NIM..." required></input>
                        </div>

                        <div className="kotakinputlaporannama">
                            <label> Nama </label> <br></br>
                            <input onChange={this.handleChange} className="inputformlaporannim" type="text" placeholder="Nama..." value={state.nama_form || ''} required></input>
                        </div>

                        <div className="kotakinputlaporanstart">
                            <label> Start Date </label> <br></br>
                            <input name="startDate" onChange={this.handleChange} className="inputformlaporannim" type="date" required></input>
                        </div>

                        <div className="kotakinputlaporanend">
                            <label> End Date </label> <br></br>
                            <input name="endDate" onChange={this.handleChange} className="inputformlaporannim" type="date" required></input>
                        </div>
                        {
                            state.datasalah &&
                            <p className="textmerah">*Data tidak ditemukan</p>
                        }
                        {
                            (state.datasalah === false) &&
                            <p className="texthijau">&emsp;</p>
                        }
                        <div className="kotaksubmitlaporan">
                            <input className="submitformlogpintu2" type="submit" value="Find"></input>
                        </div>


                        <Pdf targetRef={ref} filename={"TA026-" + state.nim}>
                            {({ toPdf }) =>
                                <button onClick={toPdf} style={{ width: "100%", height: "100%" }}>
                                    <div className="kotakprintpdflaporan">
                                        <div className="printformlaporan">
                                            <i className="fa fa-print"> <span> Print to PDF</span></i>
                                        </div>
                                    </div>
                                </button>
                            }
                        </Pdf>

                        <ExcelFile filename={"TA026-" + state.nim} element={
                            <button>
                                <div className="kotakprintxcllaporan">
                                    <div className="printformlaporan">
                                        <i className="fa fa-print"> <span> Print to Excel</span></i>
                                    </div>
                                </div>
                            </button>}>
                            <ExcelSheet dataSet={dataXcl} name={"TA026" + state.nim} />
                        </ExcelFile>

                    </form>
                </div>
                <div className="ruangandaftarruangan">
                    <div className="box-footer">
                        <div className="kotakisigrafik">
                            <div className="kotakisigrafik2">
                                <div ref={ref} className="ruangandaftarruangan2">
                                    <table className="tabellaporan">
                                        <tbody>
                                            <tr>
                                                <td style={{ width: '15%' }}>
                                                    <b>NIM</b>
                                                </td>
                                                <td style={{ width: '40%' }}>
                                                    <b>&emsp;:&emsp;{state.nim}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Nama</b>
                                                </td>
                                                <td>
                                                    <b>&emsp;:&emsp;{state.nama}</b>
                                                </td>
                                            </tr>
                                            <tr><td>&emsp;</td></tr>
                                            <tr>
                                                <td>&emsp;</td>
                                                <td>&emsp;</td>
                                                <td style={{ width: '14%' }}><b>Pencetak</b></td>
                                                <td style={{ width: '5%', textAlign: "center" }}><b>:</b></td>
                                                <td><b>ADMIN</b></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Periode</b>
                                                </td>
                                                <td>
                                                    <b>&emsp;:&emsp;{PeriodeCetak(state.startDate, state.endDate)}</b>
                                                </td>
                                                <td style={{ width: '14%' }}>
                                                    <b>Tanggal Cetak</b>
                                                </td>
                                                <td style={{ width: '5%', textAlign: "center" }}>
                                                    <b>:</b>
                                                </td>
                                                <td>
                                                    <b>{sekarang(new Date())}</b>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className="tabellaporan">
                                        <thead>
                                            <tr className="tabellaporantrhead">
                                                <th className="laporanno" > No </th>
                                                <th className="laporanhari"> Nama Mata Kuliah </th>
                                                <th className="laporantotal"> Kode Mata Kuliah </th>
                                                <th className="laporanalfa"> Kelas </th>
                                                <th className="laporanalfa"> Hadir </th>
                                                <th className="laporanizin"> Izin </th>
                                                <th className="laporansakit"> Sakit </th>
                                                <th className="laporansakit"> Alfa </th>
                                                <th className="laporanketerangan"> Persentase Kehadiran </th>
                                            </tr>
                                        </thead>
                                        {
                                            (state.datakosong === false) &&
                                            <tbody>
                                                {state.data_matkul.map(isidata => (
                                                    <tr key={i} className="tabellaporanbody">
                                                        <td className ="laporanno">{i++}</td>
                                                        <td className ="laporanmasuk">{isidata.namamatkul}</td>
                                                        <td className ="laporanhari">{isidata.kodematkul}</td>
                                                        <td className ="laporanno">{isidata.kelas}</td>
                                                        <td className ="laporanno">{this.getDataTable(isidata,state.data_dosen, state.data_mahasiswa, 1)}</td>
                                                        <td className ="laporanno">{this.getDataTable(isidata,state.data_dosen, state.data_mahasiswa, 2)}</td>
                                                        <td className ="laporanno">{this.getDataTable(isidata,state.data_dosen, state.data_mahasiswa, 3)}</td>
                                                        <td className ="laporanno">{this.getDataTable(isidata,state.data_dosen, state.data_mahasiswa, 4)}</td>
                                                        <td className ="laporanno">{this.getDataTable(isidata,state.data_dosen, state.data_mahasiswa, 5)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        }
                                        {
                                            (state.datakosong === true) &&
                                            <tbody>
                                                <tr className="tabellaporanbody">
                                                    <td colSpan="9">Data tidak ditemukasssn</td>
                                                </tr>
                                            </tbody>
                                        }
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }
}

export default withRouter(Laporan_Pengajar);