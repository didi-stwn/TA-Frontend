import React, { Component } from 'react';
import Pdf from "react-to-pdf"
import ReactExport from "react-data-export";
import { withRouter } from 'react-router-dom';
import get from './config';

const ref = React.createRef();
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

var dataset_excel = [];

class Laporan_Mahasiswa extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_mahasiswa: [],
            data_pengajar: [],
            data_matkul: [],
            nim_form: '',
            nim: '',
            nama_form: '',
            nama: '',
            startDate: '',
            endDate: '',
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
                if ((response.status === 1) && (response.log_pengajar.length !== 0) && (response.matkul.length !== 0)) {
                    this.getTanggalPengajar(response.log_pengajar)
                    this.setState({
                        find_pressed: true,
                        nama: nama_form,
                        nim: nim_form,
                        datakosong: false,
                        data_mahasiswa: response.log_mahasiswa,
                        data_matkul: response.matkul,
                    })
                }
                else if ((response.status === 1) && ((response.log_pengajar.length === 0) || (response.matkul.length === 0))) {
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

        dataset_excel = []
    }

    getTanggalPengajar(data) {
        var output = [];
        output.push(data[0])
        var kodematkul = data[0].kodematkul
        var kelas = data[0].kelas
        var date = (new Date(data[0].waktu)).toLocaleDateString()
        var jam;

        if ((new Date(data[0].waktu)).getMinutes() > 40) {
            jam = (new Date(data[0].waktu)).getHours() + 1
        }
        else {
            jam = (new Date(data[0].waktu)).getHours()
        }

        var kodematkul_next, kelas_next, date_next, jam_next;

        for (var i = 1; i < data.length; i++) {
            kodematkul_next = data[i].kodematkul
            kelas_next = data[i].kelas
            date_next = (new Date(data[i].waktu)).toLocaleDateString()
            jam_next = (new Date(data[i].waktu)).getHours()
            if ((data[i].keterangan === "Hadir") || (data[i].keterangan === "Izin") || (data[i].keterangan === "Sakit")) {
                if ((kodematkul_next === kodematkul) && (kelas_next === kelas) && (date_next === date) && ((jam_next === jam - 1) || (jam_next === jam))) {
                }
                else {
                    output.push(data[i])
                    kodematkul = data[i].kodematkul
                    kelas = data[i].kelas
                    date = (new Date(data[i].waktu)).toLocaleDateString()

                    if ((new Date(data[i].waktu)).getMinutes() > 40) {
                        jam = (new Date(data[i].waktu)).getHours() + 1
                    }
                    else {
                        jam = (new Date(data[i].waktu)).getHours()
                    }
                }

            }
        }
        this.setState({
            data_pengajar: output
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

    getDataTable(matkul, datapengajar, datamahasiswa, key) {
        //matkul : namamatkul, kodematkul, kelas, jumlah pertemuan perminggu
        //datapengajar : kodematkul, kelas, status, keterangan, waktu
        //datamahasiswa : kodematkul, kelas, waktu.
        //col : 
        // 1. Hadir
        // 2.Izin
        // 3.Sakit
        // 4.Alfa
        // 5.Persentase

        var hadir = 0;
        var sakit = 0;
        var izin = 0;
        var alfa = 0;
        var percent = 0;
        var style_sakit = "kehadiranaman"
        var style_izin = "kehadiranaman"
        var style_alfa = "kehadiranaman"
        var style_percent = "kehadiranaman"
        var count_sakit = 0;
        var count_izin = 0;
        var count_alfa = 0;
        var max_bermasalah = 4 * matkul.count

        var kodematkul_pengajar, kelas_pengajar, date_pengajar, kodematkul_pengajar_next, kelas_pengajar_next, date_pengajar_next
        var kodematkul_mahasiswa, kelas_mahasiswa, date_mahasiswa, jam_mahasiswa, min_jam_mahasiswa, max_jam_mahasiswa


        for (var i = 0; i < datapengajar.length; i++) {//datapengajar : kodematkul, kelas, status, keterangan, waktu
            kodematkul_pengajar = datapengajar[i].kodematkul
            kelas_pengajar = datapengajar[i].kelas

            if ((kodematkul_pengajar === matkul.kodematkul) && (kelas_pengajar === matkul.kelas)) {
                date_pengajar = (new Date(datapengajar[i].waktu)).toLocaleDateString()

                if ((new Date(datapengajar[i].waktu)).getMinutes() > 40) {
                    min_jam_mahasiswa = (new Date(datapengajar[i].waktu)).getHours()
                }
                else {
                    min_jam_mahasiswa = (new Date(datapengajar[i].waktu)).getHours() - 1
                }

                if (i === datapengajar.length - 1) {
                    max_jam_mahasiswa = 23;
                }
                else {
                    //deteksi jam max mahasiswa absen
                    kodematkul_pengajar_next = datapengajar[i + 1].kodematkul
                    kelas_pengajar_next = datapengajar[i + 1].kelas
                    date_pengajar_next = (new Date(datapengajar[i + 1].waktu)).toLocaleDateString()

                    if ((kodematkul_pengajar_next === kodematkul_pengajar) && (kelas_pengajar_next === kelas_pengajar)) {

                        if (date_pengajar === date_pengajar_next) {
                            if ((new Date(datapengajar[i + 1].waktu)).getMinutes() > 40) {
                                max_jam_mahasiswa = (new Date(datapengajar[i + 1].waktu)).getHours()
                            }
                            else {
                                max_jam_mahasiswa = (new Date(datapengajar[i + 1].waktu)).getHours() - 1
                            }
                        }
                        else {
                            max_jam_mahasiswa = 23
                        }
                    }
                    else {
                        max_jam_mahasiswa = 23
                    }
                }

                for (var j = 0; j < datamahasiswa.length; j++) { //datamahasiswa : kodematkul, kelas, waktu.

                    kodematkul_mahasiswa = datamahasiswa[j].kodematkul
                    kelas_mahasiswa = datamahasiswa[j].kelas
                    date_mahasiswa = (new Date(datamahasiswa[j].waktu)).toLocaleDateString()
                    jam_mahasiswa = (new Date(datamahasiswa[j].waktu)).getHours()

                    if ((kodematkul_mahasiswa === kodematkul_pengajar) && (kelas_mahasiswa === kelas_pengajar) && (date_mahasiswa === date_pengajar) && (jam_mahasiswa >= min_jam_mahasiswa) && (jam_mahasiswa <= max_jam_mahasiswa)) {
                        if (datamahasiswa[j].keterangan === "Hadir") {
                            hadir = hadir + 1

                            if (count_alfa < max_bermasalah) {
                                count_alfa = 0
                            }
                            if (count_izin < max_bermasalah) {
                                count_izin = 0
                            }
                            if (count_sakit < max_bermasalah) {
                                count_sakit = 0
                            }

                            break;
                        }
                        else if (datamahasiswa[j].keterangan === "Sakit") {
                            sakit = sakit + 1
                            count_sakit = count_sakit + 1
                            break;
                        }
                        else if (datamahasiswa[j].keterangan === "Izin") {
                            izin = izin + 1
                            count_izin = count_izin + 1
                            break;
                        }
                    }
                }
                if (j === datamahasiswa.length) {
                    alfa = alfa + 1
                    count_alfa = count_alfa + 1
                }
            }
        }

        // if (count_alfa >= max_bermasalah) {
        //     style_alfa = "kehadiranbermasalah"
        // }
        // if (count_izin >= max_bermasalah) {
        //     style_izin = "kehadiranbermasalah"
        // }
        // if (count_sakit >= max_bermasalah) {
        //     style_sakit = "kehadiranbermasalah"
        // }

        var count_tidak_hadir

        count_tidak_hadir = sakit + izin + alfa

        if (count_tidak_hadir + hadir === 0) {
            percent = 0
        }
        else {
            percent = 100 * hadir / (count_tidak_hadir + hadir)
        }
        // if (percent < 50) {
        //     style_percent = "kehadiranbermasalah"
        // }

        var data_excel = []
        data_excel.push(key)
        data_excel.push(matkul.namamatkul)
        data_excel.push(matkul.kodematkul)
        data_excel.push(matkul.kelas)
        data_excel.push(hadir)
        data_excel.push(izin)
        data_excel.push(sakit)
        data_excel.push(alfa)
        data_excel.push(percent.toFixed(2))

        dataset_excel.push(data_excel)

        return (
            <tr key={key} className="tabellaporanbody">
                <td className="laporanno">{key}</td>
                <td className="laporanmasuk">{matkul.namamatkul}</td>
                <td className="laporanhari">{matkul.kodematkul}</td>
                <td className="laporanno">{matkul.kelas}</td>
                <td className="laporanno">{hadir}</td>
                <td className={style_izin}>{izin}</td>
                <td className={style_sakit}>{sakit}</td>
                <td className={style_alfa}>{alfa}</td>
                <td className={style_percent}>{percent.toFixed(2)} %</td>
            </tr>
        )
    }

    render() {
        const state = this.state

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

        dataset_excel.splice(0, state.data_matkul.length)

        //console.log(dataset_excel)

        const dataXcl = [
            {
                columns: [
                    { title: "", width: { wpx: 60 } },
                    { title: "", width: { wpx: 200 } },
                    { title: "", width: { wpx: 120 } },
                    { title: "", width: { wpx: 50 } },
                    { title: "", width: { wpx: 50 } },
                    { title: "", width: { wpx: 50 } },
                    { title: "", width: { wpx: 50 } },
                    { title: "", width: { wpx: 100 } },
                    { title: "", width: { wpx: 150 } },
                ],

                data: [
                    ["NIM", state.nim],
                    ["Nama", state.nama],
                    [" "],
                    [" ", " ", " ", " ", " ", " ", " ", "Pencetak", "ADMIN"],
                    // [" "," "," ","Pencetak",sessionStorage.message ],
                    ["Periode", PeriodeCetak(state.startDate, state.endDate), " ", " ", " ", " ", " ", "Tanggal Cetak", sekarang(new Date())],
                ]
            },

            {
                ySteps: 1,
                columns: ["No", "Nama Mata Kuliah", "Kode Mata Kuliah", "Kelas", "Hadir", "Izin", "Sakit", "Alfa", "Persentase Kehadiran"],
                data: dataset_excel
            }
        ]

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

                        <div className="floatright">
                            <div className="kotaksubmitlaporan">
                                <input className="submitformlogpintu2" type="submit" value="Find"></input>
                            </div>
                            {
                                (state.datakosong === true) &&
                                <button className="buttonlikea" style={{ width: "100%", height: "100%" }}>
                                    <div className="kotakprintpdflaporan">
                                        <div className="printformlaporan">
                                            <i className="fa fa-print"> <span> Print to PDF</span></i>
                                        </div>
                                    </div>
                                </button>
                            }
                            {
                                (state.datakosong === false) &&
                                <Pdf targetRef={ref} filename={"TA026-" + state.nim}>
                                    {({ toPdf }) =>
                                        <button className="buttonlikea" onClick={toPdf} style={{ width: "100%", height: "100%" }}>
                                            <div className="kotakprintpdflaporan">
                                                <div className="printformlaporan">
                                                    <i className="fa fa-print"> <span> Print to PDF</span></i>
                                                </div>
                                            </div>
                                        </button>
                                    }
                                </Pdf>
                            }

                            {
                                (state.datakosong === true) &&

                                <button className="buttonlikea">
                                    <div className="kotakprintxcllaporan">
                                        <div className="printformlaporan">
                                            <i className="fa fa-print"> <span> Print to Excel</span></i>
                                        </div>
                                    </div>
                                </button>
                            }

                            {
                                (state.datakosong === false) &&
                                <ExcelFile filename={"TA026-" + state.nim} element={
                                    <button className="buttonlikea">
                                        <div className="kotakprintxcllaporan">
                                            <div className="printformlaporan">
                                                <i className="fa fa-print"> <span> Print to Excel</span></i>
                                            </div>
                                        </div>
                                    </button>}>
                                    <ExcelSheet dataSet={dataXcl} name={"Xirka" + state.nim} />
                                </ExcelFile>
                            }
                        </div>
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
                                                    this.getDataTable(isidata, state.data_pengajar, state.data_mahasiswa, i++)
                                                ))}
                                            </tbody>
                                        }
                                        {
                                            (state.datakosong === true) &&
                                            <tbody>
                                                <tr className="tabellaporanbody">
                                                    <td colSpan="9">Data tidak ditemukan</td>
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

export default withRouter(Laporan_Mahasiswa);