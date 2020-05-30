import React, { Component } from 'react';
import Pdf from "react-to-pdf"
import ReactExport from "react-data-export";
import { withRouter } from 'react-router-dom';
import get from './config';

var dataset_excel = []
const ref = React.createRef();
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

class Laporan_Pengajar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_pengajar: [],
            data_all_pengajar: [],
            matkul_input: [],
            matkul_form: [],
            matkulkosong: true,
            nim_form: '',
            nim: '',
            nama: '',
            matkul_pilih: '',
            kelas_pilih: '',
            startDate_form: '',
            endDate_form: '',
            startDate: '',
            endDate: '',
            find_pressed: false,
            datasalah: false,
            datakosong: true,
        };
        this.getmatkul = this.getmatkul.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillUnmount(){
        dataset_excel = []
    }

    getmatkul(e) {
        const { value } = e.target
        this.setState({ nim_form: value })
        if (value === '') {
            this.setState({ matkulkosong: true })
        }
        else if (value.length >= 8) {
            fetch(get.readfilterdosen + "/" + value, {
                method: 'post',
                headers: {
                    "x-access-token": sessionStorage.name,
                    "Content-Type": "application/json"
                },
            })
                .then(response => response.json())
                .then(response => {
                    //berhasil dapet data
                    if (response.status === 1) {
                        if (response.count !== 0) {
                            this.setState({
                                matkul_input: response.hasil,
                                matkulkosong: false
                            })
                        }
                        else {
                            this.setState({
                                matkul_input: '',
                                matkulkosong: true
                            })
                        }
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
            this.setState({
                matkul_input: '',
                matkulkosong: true
            })
        }
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        const { nim_form, startDate_form, endDate_form, status_input, matkul_form, matkul_input } = this.state
        fetch(get.readlogpengajar + "/" + nim_form, {
            method: 'post',
            headers: {
                "x-access-token": sessionStorage.name,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status: status_input,
                startDate: startDate_form,
                endDate: endDate_form,
                kodematkul: matkul_input[matkul_form].kodematkul,
                kelas: matkul_input[matkul_form].kelas
            })
        })
            .then(response => response.json())
            .then(response => {
                //berhasil dapet data
                if (response.status === 1) {
                    this.setState({
                        nama: response.nama_pengajar,
                        nim: nim_form,
                        matkul_pilih: matkul_input[matkul_form].kodematkul,
                        kelas_pilih: matkul_input[matkul_form].kelas,
                        startDate: startDate_form,
                        endDate: endDate_form
                    })
                    if (response.log_all_pengajar.length !== 0) {
                        this.setState({
                            find_pressed: true,
                            datakosong: false,
                            data_pengajar: response.log_pengajar,
                            nama: response.nama_pengajar,
                            nim: nim_form
                        })
                        this.getTanggalPengajar(response.log_all_pengajar)
                    }
                    else {
                        this.setState({
                            datakosong: true,
                            find_pressed: true,
                        })
                    }
                }
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
        var date = (new Date(data[0].waktu)).toLocaleDateString()
        var jam;

        if ((new Date(data[0].waktu)).getMinutes() > 40) {
            jam = (new Date(data[0].waktu)).getHours() + 1
        }
        else {
            jam = (new Date(data[0].waktu)).getHours()
        }

        var date_next, jam_next;

        for (var i = 1; i < data.length; i++) {
            date_next = (new Date(data[i].waktu)).toLocaleDateString()
            jam_next = (new Date(data[i].waktu)).getHours()
            if ((data[i].keterangan === "Hadir") || (data[i].keterangan === "Izin") || (data[i].keterangan === "Sakit")) {
                if ((date_next === date) && ((jam_next === jam - 1) || (jam_next === jam))) {
                }
                else {
                    output.push(data[i])
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
            data_all_pengajar: output
        })
    }

    waktu(t) {
        var tahun, bulan, tanggal, jam, tgl, j, m, date;
        date = new Date(t)
        tahun = String(date.getFullYear())
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
        bulan = months[(date.getMonth())]
        tgl = date.getDate()
        if (tgl <= 9) {
            tanggal = "0" + String(tgl)
        }
        else {
            tanggal = String(tgl)
        }

        m = date.getMinutes()

        if (m > 40) {
            j = date.getHours() + 1
        }
        else {
            j = date.getHours()
        }

        if (j <= 9) {
            jam = "0" + String(j)
        }
        else {
            jam = String(j)
        }
        return bulan + " " + tanggal + ", " + tahun + " " + jam + ":00:00"
    }

    getDataTable(dataallpengajar, datapengajar, no) {
        var date_pengajar, jam_pengajar, min_jam_pengajar, max_jam_pengajar
        var date_all_pengajar
        var waktudata, koderuangandata, hadirdata, izindata,sakitdata,alfadata
        date_all_pengajar = (new Date(dataallpengajar.waktu)).toLocaleDateString()

        if ((new Date(dataallpengajar.waktu)).getMinutes() > 40) {
            min_jam_pengajar = (new Date(dataallpengajar.waktu)).getHours()
        }
        else {
            min_jam_pengajar = (new Date(dataallpengajar.waktu)).getHours() - 1
        }

        max_jam_pengajar = min_jam_pengajar + 1

        for (var j = 0; j < datapengajar.length; j++) { //datamahasiswa : kodematkul, kelas, waktu.
            date_pengajar = (new Date(datapengajar[j].waktu)).toLocaleDateString()
            jam_pengajar = (new Date(datapengajar[j].waktu)).getHours()
            if ((date_pengajar === date_all_pengajar) && (jam_pengajar >= min_jam_pengajar) && (jam_pengajar <= max_jam_pengajar)) {
                if (datapengajar[j].keterangan === "Hadir") {
                    waktudata = this.waktu(new Date(dataallpengajar.waktu))
                    koderuangandata = dataallpengajar.koderuangan
                    hadirdata = "✔"
                    izindata = ""
                    sakitdata = ""
                    alfadata = ""
                    break;
                }
                else if (datapengajar[j].keterangan === "Izin") {
                    waktudata = this.waktu(new Date(dataallpengajar.waktu))
                    koderuangandata = dataallpengajar.koderuangan
                    hadirdata = ""
                    izindata = "✔"
                    sakitdata = ""
                    alfadata = ""
                    break;
                }
                else if (datapengajar[j].keterangan === "Sakit") {
                    waktudata = this.waktu(new Date(dataallpengajar.waktu))
                    koderuangandata = dataallpengajar.koderuangan
                    hadirdata = ""
                    izindata = ""
                    sakitdata = "✔"
                    alfadata = ""
                    break;
                }
            }
        }
        if (j === datapengajar.length) {
            waktudata = this.waktu(new Date(dataallpengajar.waktu))
            koderuangandata = dataallpengajar.koderuangan
            hadirdata = ""
            izindata = ""
            sakitdata = ""
            alfadata = "✔"
        }

        var output = []
        output.push(no)
        output.push(waktudata)
        output.push(koderuangandata)
        output.push(hadirdata)
        output.push(izindata)
        output.push(sakitdata)
        output.push(alfadata)

        dataset_excel.push(output)

        return (
            <tr key={no} className="tabellaporanbody">
                <td className="laporanno">{no}</td>
                <td className="laporanno">{waktudata}</td>
                <td className="laporanno">{koderuangandata}</td>
                <td className="laporanno">{hadirdata}</td>
                <td className="laporanno">{izindata}</td>
                <td className="laporanno">{sakitdata}</td>
                <td className="laporanno">{alfadata}</td>
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

        dataset_excel.splice(0, dataset_excel.length)

        var dataXcl = [
            {
                columns: [
                    { title: "", width: { wpx: 120 } },
                    { title: "", width: { wpx: 200 } },
                    { title: "", width: { wpx: 120 } },
                    { title: "", width: { wpx: 50 } },
                    { title: "", width: { wpx: 50 } },
                    { title: "", width: { wpx: 50 } },
                    { title: "", width: { wpx: 50 } },
                ],

                data: [
                    ["NIM/NIP", state.nim],
                    ["Nama", state.nama],
                    ["MataKuliah", state.matkul_pilih + "-" + state.kelas_pilih],
                    [" "],
                    [" ", " ", " ", " ", " ", "Pencetak", "ADMIN"],
                    // [" "," "," ","Pencetak",sessionStorage.message ],
                    ["Periode", PeriodeCetak(state.startDate, state.endDate), " ", " ", " ", "Tanggal Cetak", sekarang(new Date())],
                ]
            },

            {
                ySteps: 1,
                columns: ["Pertemuan Ke-", "Waktu", "Kode Ruangan", "Hadir", "Izin", "Sakit", "Alfa"],
                data: dataset_excel
            }
        ]

        var i = 0
        var l = 1
        return (
            <div>
                <div className="kotakfilter2">
                    <form className="kotakforminputlogpintu" onSubmit={this.handleSubmit}>
                        <div className="kotakinputlaporannim">
                            <label> NIM/NIP </label> <br></br>
                            <input name="nim_form" onChange={this.getmatkul} className="inputformlaporannim" type="text" placeholder="NIM..." required></input>
                        </div>

                        <div className="kotakinputlaporannama2">
                            <label> Mata Kuliah </label> <br></br>
                            <select name="matkul_form" onChange={this.handleChange} className="inputformlaporannim" required>
                                {state.matkulkosong &&
                                    <option> </option>
                                }
                                {(state.matkulkosong === false) &&
                                    <option> </option>
                                }
                                {(state.matkulkosong === false) && state.matkul_input.map(isidata => (
                                    <option key={i} value={i++}>{isidata.kodematkul} - {isidata.kelas}</option>
                                ))}
                            </select>
                        </div>

                        <div className="kotakinputlaporanstart2">
                            <label> Start Date </label> <br></br>
                            <input name="startDate_form" onChange={this.handleChange} className="inputformlaporannim" type="date" required></input>
                        </div>

                        <div className="kotakinputlaporanend">
                            <label> End Date </label> <br></br>
                            <input name="endDate_form" onChange={this.handleChange} className="inputformlaporannim" type="date" required></input>
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
                                    <ExcelSheet dataSet={dataXcl} name={"TA026-" + state.nim} />
                                </ExcelFile>
                            }
                        </div>
                    </form>
                </div>
                <div className="ruangandaftarruangan">
                    <div className="box-footer">
                        <div className="kotakisigrafik">
                            <div className="kotakisigrafik2">
                                <div ref={ref} id="dididi" className="ruangandaftarruangan2">
                                    <table className="tabellaporan">
                                        <tbody>
                                            <tr>
                                                <td style={{ width: '15%' }}>
                                                    <b>NIM/NIP</b>
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
                                            <tr>
                                                <td>
                                                    <b>Mata Kuliah</b>
                                                </td>
                                                <td>
                                                    <b>&emsp;:&emsp;{state.matkul_pilih} - {state.kelas_pilih}</b>
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
                                                <th className="laporanmasuk"> Pertemuan ke- </th>
                                                <th className="laporanhari"> Waktu </th>
                                                <th className="laporanmasuk"> Kode Ruangan </th>
                                                <th className="laporansakit"> Hadir </th>
                                                <th className="laporansakit"> Izin </th>
                                                <th className="laporansakit"> Sakit </th>
                                                <th className="laporansakit"> Alfa </th>
                                            </tr>
                                        </thead>
                                        {
                                            (state.datakosong === false) &&
                                            <tbody>
                                                {state.data_all_pengajar.map(isidata => (
                                                    this.getDataTable(isidata, state.data_pengajar, l++)
                                                ))}
                                            </tbody>
                                        }
                                        {
                                            (state.datakosong === true) &&
                                            <tbody>
                                                <tr className="tabellaporanbody">
                                                    <td colSpan="10">Data tidak ditemukan</td>
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