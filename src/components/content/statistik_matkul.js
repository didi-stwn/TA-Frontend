import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Pie, Line } from 'react-chartjs-2';
import get from './config';

var data_pertemuan = []
var data_pertemuan_tidak_hadir = []
var data_all = []

class StatistikMatkul extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kodematkul: 'Masukkan Kode Mata Kuliah',
            startDate: '',
            endDate: '',
            namamatkul: '-',
            data_matkul: [],
            find_pressed: false,
            jadwalmatkul: [],
            datakosong: true,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillUnmount() {
        data_pertemuan = []
        data_pertemuan_tidak_hadir = []
        data_all = []
    }

    getLog(datamatkul) {
        const { startDate, endDate } = this.state
        for (let i = 0; i < datamatkul.length; i++) {
            fetch(get.readlogmatkul + "/" + datamatkul[i].kodematkul + "/" + datamatkul[i].kelas, {
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
                    if ((response.status === 1) && (response.jadwal.length !== 0)) {
                        this.getDataKelas(response.log_mahasiswa, response.log_pengajar, datamatkul[i].count, datamatkul[i].kelas, response.jadwal, response.jadwaltambahan, response.data_mahasiswa)
                        this.setState({
                            datakosong: false,
                            jadwalmatkul: response.jadwal
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
    }

    getDataKelas(mahasiswa, pengajar, total, kelas, jadwal, jadwaltambahan, datamahasiswa) {
        var data_all_1d = []
        var data_pertemuan_1d = []
        var data_pertemuan_2d = []
        var count_alfa = 0
        var count_hadir = 0
        var count_izin = 0
        var count_sakit = 0
        var count_telat = 0
        var pertemuan = 0
        var hadir, sakit, izin, alfa, telat
        var datepengajar, datepengajarnext, datemahasiswa
        var date = []
        const dummy = "2000-01-01T00:00:00.000Z"
        var hari_masuk
        var isDetected = false
        var datadurasi = []
        var durasi = 0

        data_pertemuan_1d.push(kelas)
        data_pertemuan_1d.push(0) //pertemuan
        data_pertemuan_1d.push(0) //waktu
        data_pertemuan_1d.push(0) //hadir
        data_pertemuan_1d.push(0) //telat
        data_pertemuan_1d.push(0) //sakit
        data_pertemuan_1d.push(0) //izin
        data_pertemuan_1d.push(0) //alfa
        data_pertemuan_2d.push(data_pertemuan_1d)

        if ((pengajar.length !== 0) && (mahasiswa.length !== 0)) {
            //filter jumlah pertemuan kelas
            datepengajar = new Date(dummy)

            for (var k = 0; k < pengajar.length; k++) {
                if ((pengajar[k].keterangan === "Hadir") || (pengajar[k].keterangan === "Sakit") || (pengajar[k].keterangan === "Izin")) {
                    datepengajarnext = new Date(pengajar[k].waktu)
                    if (datepengajarnext.getMinutes() > 40) {
                        datepengajarnext.setHours(datepengajarnext.getHours() + 1, 0, 0)
                    }
                    else {
                        datepengajarnext.setHours(datepengajarnext.getHours(), 0, 0)
                    }
                    durasi = 0
                    for (var m = 0; m < jadwaltambahan.length; m++) {
                        if (jadwaltambahan[m].hari === 7) {
                            hari_masuk = 0
                        }
                        else {
                            hari_masuk = jadwaltambahan[m].hari
                        }
                        if ((datepengajarnext.toDateString() === (new Date(jadwaltambahan[m].waktu)).toDateString()) && (datepengajarnext.getDay() === hari_masuk) && (datepengajarnext.getHours() - jadwaltambahan[m].jam < jadwaltambahan[m].durasi)) {
                            durasi = jadwaltambahan[m].durasi
                            datepengajarnext.setHours(jadwaltambahan[m].jam, 0, 0)
                            isDetected = true
                            break;
                        }
                    }
                    if (isDetected === false) {
                        for (var l = 0; l < jadwal.length; l++) {
                            if (jadwal[l].hari === 7) {
                                hari_masuk = 0
                            }
                            else {
                                hari_masuk = jadwal[l].hari
                            }
                            if ((datepengajarnext.getDay() === hari_masuk) && (datepengajarnext.getHours() - jadwal[l].jam < jadwal[l].durasi)) {
                                durasi = jadwal[l].durasi
                                datepengajarnext.setHours(jadwal[l].jam, 0, 0)
                                break;
                            }
                        }
                    }
                    else {
                        isDetected = false
                    }

                    if (datepengajarnext.getTime() !== datepengajar.getTime()) {
                        if (durasi !== 0) {
                            pertemuan++
                            date.push(datepengajarnext)
                            datadurasi.push(durasi)
                        }
                    }
                    datepengajar = datepengajarnext
                }

            }

            data_pertemuan_2d = []
            var data_log_mahasiswa = mahasiswa
            var counter_hadir = 0
            var data_mahasiswa_hadir = []
            var data_mahasiswa_tidak_hadir = []
            var data_pertemuan_tidak_hadir_1d = []
            for (var j = 0; j < date.length; j++) {
                data_pertemuan_1d = []
                data_pertemuan_1d.push(kelas)
                data_pertemuan_1d.push(j + 1)
                data_pertemuan_1d.push(date[j])
                counter_hadir = 0
                hadir = 0
                izin = 0
                sakit = 0
                alfa = 0
                telat = 0
                data_mahasiswa_hadir = []
                data_mahasiswa_tidak_hadir = []
                for (var i = 0; i < data_log_mahasiswa.length; i++) {
                    datemahasiswa = new Date(data_log_mahasiswa[i].waktu)
                    if ((Math.abs(datemahasiswa.getTime() - date[j].getTime())) / 60000 < (datadurasi[j] * 60)) {
                        data_mahasiswa_hadir.push(data_log_mahasiswa[i].nim)
                        counter_hadir++
                        if (data_log_mahasiswa[i].keterangan === "Hadir") {
                            count_hadir++
                            hadir++
                            var temp = new Date(date[j])
                            temp.setMinutes(15)
                            if (datemahasiswa > temp) {
                                count_telat++
                                telat++
                                data_pertemuan_tidak_hadir_1d = []
                                data_pertemuan_tidak_hadir_1d.push(kelas)
                                data_pertemuan_tidak_hadir_1d.push(j + 1)
                                data_pertemuan_tidak_hadir_1d.push(data_log_mahasiswa[i].waktu)
                                data_pertemuan_tidak_hadir_1d.push(data_log_mahasiswa[i].nim)
                                data_pertemuan_tidak_hadir_1d.push(data_log_mahasiswa[i].nama)
                                data_pertemuan_tidak_hadir_1d.push("✔")//telat
                                data_pertemuan_tidak_hadir_1d.push("")//izin
                                data_pertemuan_tidak_hadir_1d.push("")//sakit
                                data_pertemuan_tidak_hadir_1d.push("")//alfa
                                data_pertemuan_tidak_hadir.push(data_pertemuan_tidak_hadir_1d)
                            }
                        }
                        else if (data_log_mahasiswa[i].keterangan === "Izin") {
                            count_izin++
                            izin++
                            data_pertemuan_tidak_hadir_1d = []
                            data_pertemuan_tidak_hadir_1d.push(kelas)
                            data_pertemuan_tidak_hadir_1d.push(j + 1)
                            data_pertemuan_tidak_hadir_1d.push(data_log_mahasiswa[i].waktu)
                            data_pertemuan_tidak_hadir_1d.push(data_log_mahasiswa[i].nim)
                            data_pertemuan_tidak_hadir_1d.push(data_log_mahasiswa[i].nama)
                            data_pertemuan_tidak_hadir_1d.push("")//telat
                            data_pertemuan_tidak_hadir_1d.push("✔")//izin
                            data_pertemuan_tidak_hadir_1d.push("")//sakit
                            data_pertemuan_tidak_hadir_1d.push("")//alfa
                            data_pertemuan_tidak_hadir.push(data_pertemuan_tidak_hadir_1d)
                        }
                        else if (data_log_mahasiswa[i].keterangan === "Sakit") {
                            count_sakit++;
                            sakit++
                            data_pertemuan_tidak_hadir_1d = []
                            data_pertemuan_tidak_hadir_1d.push(kelas)
                            data_pertemuan_tidak_hadir_1d.push(j + 1)
                            data_pertemuan_tidak_hadir_1d.push(data_log_mahasiswa[i].waktu)
                            data_pertemuan_tidak_hadir_1d.push(data_log_mahasiswa[i].nim)
                            data_pertemuan_tidak_hadir_1d.push(data_log_mahasiswa[i].nama)
                            data_pertemuan_tidak_hadir_1d.push("")//telat
                            data_pertemuan_tidak_hadir_1d.push("")//izin
                            data_pertemuan_tidak_hadir_1d.push("✔")//sakit
                            data_pertemuan_tidak_hadir_1d.push("")//alfa
                            data_pertemuan_tidak_hadir.push(data_pertemuan_tidak_hadir_1d)
                        }
                    }
                    else if (((Math.abs(datemahasiswa.getTime() - date[j].getTime())) / 60000 > 60) && (counter_hadir === 0)) {
                        // data_log_mahasiswa.splice(0, 1)
                    }
                    else {
                        data_log_mahasiswa.splice(0, counter_hadir)
                        break;
                    }
                }
                for (m = 0; m < datamahasiswa.length; m++) {
                    for (var n = 0; n < data_mahasiswa_hadir.length; n++) {
                        if (data_mahasiswa_hadir[n] === datamahasiswa[m].nim) {
                            break;
                        }
                        else {
                        }
                    }
                    if (n === data_mahasiswa_hadir.length) {
                        data_mahasiswa_tidak_hadir.push(datamahasiswa[m].nim)
                        data_pertemuan_tidak_hadir_1d = []
                        data_pertemuan_tidak_hadir_1d.push(kelas)
                        data_pertemuan_tidak_hadir_1d.push(j + 1)
                        data_pertemuan_tidak_hadir_1d.push("-")
                        data_pertemuan_tidak_hadir_1d.push(datamahasiswa[m].nim)
                        data_pertemuan_tidak_hadir_1d.push(datamahasiswa[m].nama)
                        data_pertemuan_tidak_hadir_1d.push("")//telat
                        data_pertemuan_tidak_hadir_1d.push("")//izin
                        data_pertemuan_tidak_hadir_1d.push("")//sakit
                        data_pertemuan_tidak_hadir_1d.push("✔")//alfa
                        data_pertemuan_tidak_hadir.push(data_pertemuan_tidak_hadir_1d)
                    }
                }
                alfa = data_mahasiswa_tidak_hadir.length
                data_pertemuan_1d.push(hadir)
                data_pertemuan_1d.push(telat)
                data_pertemuan_1d.push(sakit)
                data_pertemuan_1d.push(izin)
                data_pertemuan_1d.push(alfa)
                data_pertemuan_2d.push(data_pertemuan_1d)
            }
        }
        data_pertemuan.push(data_pertemuan_2d)
        count_alfa = pertemuan * total - (count_hadir + count_izin + count_sakit)

        data_all_1d.push(kelas)
        data_all_1d.push(count_hadir)
        data_all_1d.push(count_telat)
        data_all_1d.push(count_sakit)
        data_all_1d.push(count_izin)
        data_all_1d.push(count_alfa)
        data_all_1d.push(pertemuan)
        data_all.push(data_all_1d)
    }


    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }


    handleSubmit(e) {
        e.preventDefault();
        const { kodematkul } = this.state
        fetch(get.readstatistikmatkul + "/" + kodematkul, {
            method: 'post',
            headers: {
                "x-access-token": sessionStorage.name,
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(response => {
                this.setState({ find_pressed: true })
                if ((response.status === 1) && (response.hasil.length !== 0)) {
                    this.getLog(response.hasil)
                    this.setState({
                        datakosong: false,
                        data_matkul: response.hasil,
                        namamatkul: response.hasil[0].namamatkul,
                    })
                }
                else if ((response.status === 1) && (response.hasil.length === 0)) {
                    this.setState({
                        datakosong: true
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
        data_pertemuan = []
        data_pertemuan_tidak_hadir = []
        data_all = []
    }

    outgraph(d) {
        const { datakosong } = this.state
        if (datakosong === false) {
            var count_alfa = 0
            var count_hadir = 0
            var count_izin = 0
            var count_sakit = 0
            var hadir_pie = [0, 0, 0, 0]
            const ket = ['Hadir', 'Sakit', 'Izin', 'Alfa']

            for (var i = 0; i < d.length; i++) {
                count_hadir += d[i][1]
                count_sakit += d[i][3]
                count_izin += d[i][4]
                count_alfa += d[i][5]
            }


            hadir_pie[0] = count_hadir
            hadir_pie[1] = count_sakit
            hadir_pie[2] = count_izin
            hadir_pie[3] = count_alfa

            const data = {
                labels: ket,
                datasets: [
                    {
                        data: hadir_pie,
                        backgroundColor: [
                            'blue',
                            'green',
                            'yellow',
                            'red'
                        ],
                    },
                ],
            };
            const options = {
                maintainAspectRatio: false,
                responsive: false,
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 10
                    }
                },
                title: {
                    fontsize: 60,
                    display: true,
                    text: 'Statistik Kehadiran'
                }
            }
            return (
                <div>
                    <div style={{ paddingRight: "20px" }}>
                        <Pie
                            data={data}
                            width={300}
                            height={300}
                            options={options}
                        />
                    </div>
                </div>
            )
        }

    }

    tablePertemuan(d, data_kehadiran_mahasiswa) {
        var data_mahasiswa_telat_izin_sakit_alfa = []
        var i = 0

        for (i = 0; i < data_kehadiran_mahasiswa.length; i++) {
            if (d[0][0] === data_kehadiran_mahasiswa[i][0]) {
                data_mahasiswa_telat_izin_sakit_alfa.push(data_kehadiran_mahasiswa[i])
            }
        }
        data_mahasiswa_telat_izin_sakit_alfa.sort(function (a, b) {
            return a[3] - b[3];
        })
        data_mahasiswa_telat_izin_sakit_alfa.sort(function (a, b) {
            return a[1] - b[1];
        })
        i = 0
        function waktu(t) {
            if (t === "-") {
                return "-"
            }
            else {
                var tahun, bulan, tanggal, jam, menit, tgl, j, m, date, d, detik;
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
                j = date.getHours()
                if (j <= 9) {
                    jam = "0" + String(j)
                }
                else {
                    jam = String(j)
                }
                m = date.getMinutes()
                if (m <= 9) {
                    menit = "0" + String(m)
                }
                else {
                    menit = String(m)
                }
                d = date.getSeconds()
                if (d <= 9) {
                    detik = "0" + String(d)
                }
                else {
                    detik = String(d)
                }
                return bulan + " " + tanggal + ", " + tahun + " " + jam + ":" + menit + ":" + detik
            }
        }

        var labelxpertemuan = []
        var hadir = []
        var telat = []
        var izin = []
        var sakit = []
        var alfa = []
        for (var j = 0; j < d.length; j++) {
            labelxpertemuan.push(d[j][1])
            hadir.push(d[j][3])
            telat.push(d[j][4])
            izin.push(d[j][5])
            sakit.push(d[j][6])
            alfa.push(d[j][7])
        }
        const DataPertemuan = {
            labels: labelxpertemuan,
            datasets: [
                {
                    label: 'Hadir',
                    fill: false,
                    lineTension: 0.1,
                    borderColor: 'rgba(0,255,0)',
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: hadir
                },
                {
                    label: 'Telat',
                    fill: false,
                    lineTension: 0.1,
                    borderColor: 'rgba(255,128,0)',
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: telat
                },
                {
                    label: 'Izin',
                    fill: false,
                    lineTension: 0.1,
                    borderColor: 'rgba(0,0,255)',
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: izin
                },
                {
                    label: 'Sakit',
                    fill: false,
                    lineTension: 0.1,
                    borderColor: 'rgba(255,255,0)',
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: sakit
                },
                {
                    label: 'Tidak Hadir',
                    fill: false,
                    lineTension: 0.1,
                    borderColor: 'rgba(255,0,0)',
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: alfa
                },
            ]
        };

        const OptionPertemuan = {
            maintainAspectRatio: false,
            responsive: false,
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 10
                }
            },
            title: {
                display: true,
                text: 'Data Kehadiran Tiap Pertemuan'
            },
        }

        return (
            <div className="kotakdata" id={d[0][0]} >
                <div className="scrollx">
                    <div style={{ textAlign: "center", display: "block" }}>
                        <a href="#inputform"><u>Back to top</u></a>
                        <h5>Kelas {d[0][0]}</h5>
                    </div>
                    <div className="texttengah" style={{ minWidth: "900px" }}>
                        <Line
                            data={DataPertemuan}
                            width={900}
                            height={250}
                            options={OptionPertemuan}
                        />
                    </div>
                    <div className="paddingtop30px2"></div>
                    <div className="isitabel" style={{ minWidth: "900px", maxHeight: "400px", overflowY: "scroll" }}>
                        <table className="tablelaporan">
                            <thead className="theadlog">
                                <tr>
                                    <th className="laporanmasuk"> Pertemuan ke- </th>
                                    <th className="laporanhari"> Waktu </th>
                                    <th className="laporantotal"> NIM </th>
                                    <th className="laporantotal"> Nama </th>
                                    <th className="laporansakit"> Telat </th>
                                    <th className="laporansakit"> Sakit </th>
                                    <th className="laporansakit"> Izin </th>
                                    <th className="laporansakit"> Alfa </th>
                                </tr>
                            </thead>
                            {(data_mahasiswa_telat_izin_sakit_alfa.length !== 0) &&
                                <tbody className="tbodylog">
                                    {data_mahasiswa_telat_izin_sakit_alfa.map(isidata => (
                                        <tr key={i++}>
                                            <td>{isidata[1]}</td>
                                            <td>{waktu(isidata[2])}</td>
                                            <td>{isidata[3]}</td>
                                            <td>{isidata[4]}</td>
                                            <td>{isidata[5]}</td>
                                            <td>{isidata[6]}</td>
                                            <td>{isidata[7]}</td>
                                            <td>{isidata[8]}</td>
                                        </tr>
                                    ))}
                                </tbody>}
                            {(data_mahasiswa_telat_izin_sakit_alfa.length === 0) &&
                                <tbody className="tbodylog">
                                    <tr>
                                        <td colSpan="8">Data tidak ditemukan</td>
                                    </tr>
                                </tbody>}
                        </table>
                    </div>
                    <div className="paddingtop30px2"></div>
                </div>
            </div>
        )

    }



    render() {

        var inc = 0;
        const state = this.state
        // var date1 = new Date()
        // var date2 = new Date(new Date(date1.toDateString()).setHours(7))
        // console.log(date1)
        // console.log(date2)
        //var widthgraph = 240 + 'px';

        data_all.sort((a, b) =>
            a[0].localeCompare(b[0])
        )
        data_pertemuan.sort((a, b) =>
            a[0][0].localeCompare(b[0][0])
        )

        function PeriodeStatistik(start, end) {
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
        return (
            <div >
                <div className="kotakfilter3">
                    <form className="kotakforminputlogpintu" onSubmit={this.handleSubmit}>
                        <div className="filterdatastatistik">
                            <label><b>Kode Mata Kuliah</b> </label> <br></br>
                            <input name="kodematkul" onChange={this.handleChange} className="inputfiltertanggalawallog" type="text" required ></input>
                        </div>
                        <div className="filtertanggalawalstatistik">
                            <label><b>Tanggal Awal</b> </label> <br></br>
                            <input name="startDate" onChange={this.handleChange} className="inputfiltertanggalawallog" type="date" required ></input>
                        </div>
                        <div className="filtertanggalakhirstatistik">
                            <label><b>Tanggal Akhir</b> </label> <br></br>
                            <input name="endDate" onChange={this.handleChange} className="inputfiltertanggalawallog" type="date" required ></input>
                        </div>
                        <div className="kotaksubmitstatistik2">
                            <input className="submitformstatistik" type="submit" value="Filter"></input>
                        </div>
                    </form>
                </div>
                <div className="paddingtop30px2"></div>


                <div className="kotakdata" >
                    <div>
                        <span><b>Kode Mata Kuliah &ensp;&ensp;&emsp;: {state.kodematkul}</b></span>
                        <br></br>
                        <span><b>Nama Mata Kuliah &ensp;&ensp;&ensp; : {state.namamatkul}</b></span>
                        <br></br>
                        <span><b>Periode &ensp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;: {PeriodeStatistik(state.startDate, state.endDate) || '-'}</b></span>
                        <br></br>
                    </div>
                    <div className="paddingtop30px2"></div>
                    {
                        state.datakosong &&
                        <div style={{ textAlign: "center", display: "block" }}>
                            <h5>Data tidak ditemukan</h5>
                        </div>
                    }
                    {
                        state.datakosong === false &&
                        <div id="inputform" className="scrollx">
                            <div className="texttengah" style={{ minWidth: "900px", overflowX: "auto" }}>
                                {this.outgraph(data_all)}
                                <div className="isitabel" style={{ width: "100%" }}>
                                    <table className="tablefakultas">
                                        <thead className="theadlog">
                                            <tr>
                                                <th className="kelas" style={{ cursor: "default" }}>Kelas</th>
                                                <th className="kelas" style={{ cursor: "default" }}>Jumlah Pertemuan</th>
                                                <th className="kelas" style={{ cursor: "default" }}>Hadir</th>
                                                <th className="kelas" style={{ cursor: "default" }}>Telat</th>
                                                <th className="kelas" style={{ cursor: "default" }}>Sakit</th>
                                                <th className="kelas" style={{ cursor: "default" }}>Izin</th>
                                                <th className="kelas" style={{ cursor: "default" }}>Alfa</th>
                                                <th className="keterangan" style={{ cursor: "default" }}>Show Detail</th>
                                            </tr>
                                        </thead>
                                        {(state.datakosong === false) &&
                                            <tbody className="tbodylog">
                                                {data_all.map(isidata => (
                                                    <tr key={inc++}>
                                                        <td>{isidata[0]}</td>
                                                        <td>{isidata[6]}</td>
                                                        <td>{isidata[1]}</td>
                                                        <td>{isidata[2]}</td>
                                                        <td>{isidata[3]}</td>
                                                        <td>{isidata[4]}</td>
                                                        <td>{isidata[5]}</td>
                                                        <td><a href={"#" + isidata[0]}> <u>Show Detail</u> </a></td>
                                                    </tr>
                                                ))}
                                            </tbody>}
                                        {(state.datakosong === true) &&
                                            <tbody className="tbodylog">
                                                <tr>
                                                    <td colSpan="8">Data tidak ditemukan</td>
                                                </tr>
                                            </tbody>}
                                    </table>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                {
                    (state.datakosong === false) && (data_pertemuan.length !== 0) &&
                    <div>
                        {data_pertemuan.map(isidata => (
                            <div key={inc++} className="texttengah">
                                {this.tablePertemuan(isidata, data_pertemuan_tidak_hadir)}
                            </div>
                        ))}
                    </div>
                }
            </div>
        )
    }
}

export default withRouter(StatistikMatkul);