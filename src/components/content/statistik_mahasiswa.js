import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import get from './config';


var data_matkul_bermasalah = []
var data_matkul_aman = []
var data_statistik_all = []

class StatistikMahasiswa extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_mahasiswa: [],
            data_pengajar: [],
            data_matkul: [],
            data_statistik_solve: [],
            data_statistik_bermasalah: [],
            nim_form: '',
            nim: 'Masukkan NIM',
            nama: '-',
            startDate: '',
            endDate: '',
            konfigurasi: 0,
            konfigurasiall: 0,
            find_pressed: false,
            datasalah: false,
            datakosong: true,
            isLoading: false,
            counter_loading: 0,
            lengthMahasiswa: 0,
            showStatistikAll: false,
            showStatistikbyNIM: true,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillUnmount() {
        data_matkul_bermasalah = []
        data_matkul_aman = []
        data_statistik_all = []
    }

    getDataPenggunaAll() {
        data_statistik_all = []
        fetch(get.readallpengguna, {
            method: 'post',
            headers: {
                "x-access-token": sessionStorage.name,
                "Content-Type": "application/json"
            },
        })
            .then(response => response.json())
            .then(response => {
                if ((response.status === 1) && (response.hasil.count !== 0)) {
                    this.setState({ lengthMahasiswa: response.hasil.length })
                    this.requestStatistikAll(response.hasil)
                    this.getDataMahasiswaSolve()
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

    requestStatistikAll(mahasiswa) {
        for (let i = 0; i < mahasiswa.length; i++) {
            fetch(get.readstatistikall + "/" + mahasiswa[i].nim, {
                method: 'post',
                headers: {
                    "x-access-token": sessionStorage.name,
                    "Content-Type": "application/json"
                },
            })
                .then(response => response.json())
                .then(response => {

                    this.setState({
                        counter_loading: i,
                        isLoading: false,
                    })
                    //berhasil dapet data
                    if ((response.status === 1) && (response.log_pengajar.length !== 0) && (response.matkul.length !== 0)) {
                        this.getDataStatistikAll(response.matkul, response.log_pengajar, response.log_mahasiswa, mahasiswa[i].fakultas, mahasiswa[i].jurusan, mahasiswa[i].nim, mahasiswa[i].nama)

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

    getDataStatistikAll(matkul, pengajar, mahasiswa, fakultas, jurusan, nim, nama) {
        const { konfigurasiall } = this.state
        //mendapatkan tanggal pengajar agar tidak tumpuk
        var filter_tanggal_pengajar = [];
        filter_tanggal_pengajar.push(pengajar[0])
        var filter_kodematkul_pengajar = pengajar[0].kodematkul
        var filter_kelas_pengajar = pengajar[0].kelas
        var filter_date_pengajar = (new Date(pengajar[0].waktu)).toLocaleDateString()
        var filter_jam_pengajar;

        if ((new Date(pengajar[0].waktu)).getMinutes() > 40) {
            filter_jam_pengajar = (new Date(pengajar[0].waktu)).getHours() + 1
        }
        else {
            filter_jam_pengajar = (new Date(pengajar[0].waktu)).getHours()
        }

        var filter_kodematkul_next_pengajar, filter_kelas_next_pengajar, filter_date_next_pengajar, filter_jam_next_pengajar;
        for (var i = 1; i < pengajar.length; i++) {
            filter_kodematkul_next_pengajar = pengajar[i].kodematkul
            filter_kelas_next_pengajar = pengajar[i].kelas
            filter_date_next_pengajar = (new Date(pengajar[i].waktu)).toLocaleDateString()
            filter_jam_next_pengajar = (new Date(pengajar[i].waktu)).getHours()
            if ((pengajar[i].keterangan === "Hadir") || (pengajar[i].keterangan === "Izin") || (pengajar[i].keterangan === "Sakit")) {
                if ((filter_kodematkul_next_pengajar === filter_kodematkul_pengajar) && (filter_kelas_next_pengajar === filter_kelas_pengajar) && (filter_date_next_pengajar === filter_date_pengajar) && ((filter_jam_next_pengajar === filter_jam_pengajar - 1) || (filter_jam_next_pengajar === filter_jam_pengajar))) {
                }
                else {
                    filter_tanggal_pengajar.push(pengajar[i])
                    filter_kodematkul_pengajar = pengajar[i].kodematkul
                    filter_kelas_pengajar = pengajar[i].kelas
                    filter_date_pengajar = (new Date(pengajar[i].waktu)).toLocaleDateString()

                    if ((new Date(pengajar[i].waktu)).getMinutes() > 40) {
                        filter_jam_pengajar = (new Date(pengajar[i].waktu)).getHours() + 1
                    }
                    else {
                        filter_jam_pengajar = (new Date(pengajar[i].waktu)).getHours()
                    }
                }

            }
        }

        // console.log(filter_tanggal_pengajar)

        var oldmatkul = matkul[0].kodematkul
        var oldkelas = matkul[0].kelas
        var log_bermasalah_1d = []
        var count_hadir_table = 0
        var count_izin_table = 0
        var count_sakit_table = 0
        var count_alfa_table = 0
        var count_alfa_bermasalah = 0
        var count_izin_bermasalah = 0
        var count_sakit_bermasalah = 0

        var kodematkul_pengajar, kelas_pengajar, date_pengajar, kodematkul_pengajar_next, kelas_pengajar_next, date_pengajar_next
        var kodematkul_mahasiswa, kelas_mahasiswa, date_mahasiswa, jam_mahasiswa, min_jam_mahasiswa, max_jam_mahasiswa

        var count_matkul = 0
        var kodematkul_now = matkul[count_matkul].kodematkul
        var kelas_now = matkul[count_matkul].kelas
        var count_now = konfigurasiall * parseInt(matkul[count_matkul].count)

        for (i = 0; i < filter_tanggal_pengajar.length; i++) {
            kodematkul_pengajar = filter_tanggal_pengajar[i].kodematkul
            kelas_pengajar = filter_tanggal_pengajar[i].kelas

            if ((kodematkul_now !== kodematkul_pengajar) || (kelas_now !== kelas_pengajar)) {
                count_matkul = count_matkul + 1
                if (count_matkul > matkul.length - 1) {
                    count_matkul = count_matkul - 1
                }
                kodematkul_now = matkul[count_matkul].kodematkul
                kelas_now = matkul[count_matkul].kelas
                count_now = konfigurasiall * parseInt(matkul[count_matkul].count)
            }

            if ((kodematkul_now === kodematkul_pengajar) && (kelas_now === kelas_pengajar)) {


                date_pengajar = (new Date(filter_tanggal_pengajar[i].waktu)).toLocaleDateString()

                if ((new Date(filter_tanggal_pengajar[i].waktu)).getMinutes() > 40) {
                    min_jam_mahasiswa = (new Date(filter_tanggal_pengajar[i].waktu)).getHours()
                }
                else {
                    min_jam_mahasiswa = (new Date(filter_tanggal_pengajar[i].waktu)).getHours() - 1
                }

                if (i === filter_tanggal_pengajar.length - 1) {
                    var a = i
                    max_jam_mahasiswa = 23;
                }
                else {
                    a = i + 1
                    kodematkul_pengajar_next = filter_tanggal_pengajar[i + 1].kodematkul
                    kelas_pengajar_next = filter_tanggal_pengajar[i + 1].kelas
                    date_pengajar_next = (new Date(filter_tanggal_pengajar[i + 1].waktu)).toLocaleDateString()

                    if ((kodematkul_pengajar_next === kodematkul_pengajar) && (kelas_pengajar_next === kelas_pengajar)) {
                        if (date_pengajar === date_pengajar_next) {
                            if ((new Date(filter_tanggal_pengajar[i + 1].waktu)).getMinutes() > 40) {
                                max_jam_mahasiswa = (new Date(filter_tanggal_pengajar[i + 1].waktu)).getHours()
                            }
                            else {
                                max_jam_mahasiswa = (new Date(filter_tanggal_pengajar[i + 1].waktu)).getHours() - 1
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

                for (var j = 0; j < mahasiswa.length; j++) {

                    kodematkul_mahasiswa = mahasiswa[j].kodematkul
                    kelas_mahasiswa = mahasiswa[j].kelas
                    date_mahasiswa = (new Date(mahasiswa[j].waktu)).toLocaleDateString()
                    jam_mahasiswa = (new Date(mahasiswa[j].waktu)).getHours()

                    if ((kodematkul_mahasiswa === kodematkul_pengajar) && (kelas_mahasiswa === kelas_pengajar) && (date_mahasiswa === date_pengajar) && (jam_mahasiswa >= min_jam_mahasiswa) && (jam_mahasiswa <= max_jam_mahasiswa)) {
                        if (mahasiswa[j].keterangan === "Hadir") {
                            count_hadir_table = count_hadir_table + 1

                            if (count_sakit_bermasalah < count_now) {
                                count_sakit_bermasalah = 0
                            }
                            if (count_izin_bermasalah < count_now) {
                                count_izin_bermasalah = 0
                            }
                            if (count_alfa_bermasalah < count_now) {
                                count_alfa_bermasalah = 0
                            }
                            break;
                        }
                        else if (mahasiswa[j].keterangan === "Sakit") {
                            count_sakit_bermasalah = count_sakit_bermasalah + 1
                            count_sakit_table = count_sakit_table + 1
                            break;
                        }
                        else if (mahasiswa[j].keterangan === "Izin") {
                            count_izin_bermasalah = count_izin_bermasalah + 1
                            count_izin_table = count_izin_table + 1
                            break;
                        }
                    }
                }
                if (j === mahasiswa.length) {
                    count_alfa_bermasalah = count_alfa_bermasalah + 1
                    count_alfa_table = count_alfa_table + 1
                }

                // deteksi mahasiswa bermasalah
                var check_bermasalah = 0
                if (((filter_tanggal_pengajar[a].kodematkul !== oldmatkul) || (filter_tanggal_pengajar[a].kelas !== oldkelas)) || (i === filter_tanggal_pengajar.length - 1)) {
                    if (count_alfa_bermasalah >= count_now) {
                        check_bermasalah = 1
                    }
                    else if (count_izin_bermasalah >= count_now) {
                        check_bermasalah = 2
                    }
                    else if (count_sakit_bermasalah >= count_now) {
                        check_bermasalah = 3
                    }
                    else {
                        check_bermasalah = 0
                    }

                    if (check_bermasalah !== 0) {
                        log_bermasalah_1d.push(fakultas)
                        log_bermasalah_1d.push(jurusan)
                        log_bermasalah_1d.push(nim)
                        log_bermasalah_1d.push(nama)
                        log_bermasalah_1d.push(oldmatkul)
                        log_bermasalah_1d.push(oldkelas)
                        log_bermasalah_1d.push(matkul[count_matkul].namamatkul)
                        log_bermasalah_1d.push(count_hadir_table)
                        log_bermasalah_1d.push(count_izin_table)
                        log_bermasalah_1d.push(count_sakit_table)
                        log_bermasalah_1d.push(count_alfa_table)
                        log_bermasalah_1d.push(check_bermasalah)

                        data_statistik_all.push(log_bermasalah_1d)
                    }

                    log_bermasalah_1d = []
                    oldmatkul = filter_tanggal_pengajar[a].kodematkul
                    oldkelas = filter_tanggal_pengajar[a].kelas
                    count_hadir_table = 0
                    count_izin_table = 0
                    count_sakit_table = 0
                    count_alfa_table = 0
                    count_sakit_bermasalah = 0
                    count_izin_bermasalah = 0
                    count_alfa_bermasalah = 0
                }
            }
        }
    }

    getDataMahasiswaSolve() {
        var bermasalah = []
        var solve = []
        fetch(get.readsolvemahasiswa, {
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
                    for (var i = 0; i < data_statistik_all.length; i++) {
                        for (var j = 0; j < response.hasil.length; j++) {
                            if ((data_statistik_all[i][2] === response.hasil[j].nim) && (data_statistik_all[i][4] === response.hasil[j].kodematkul) && (data_statistik_all[i][5] === response.hasil[j].kelas)) {
                                solve.push(data_statistik_all[i])
                                break;
                            }
                        }
                        if (j === response.hasil.length) {
                            bermasalah.push(data_statistik_all[i])
                        }
                    }
                    this.setState({
                        data_statistik_solve: solve,
                        data_statistik_bermasalah: bermasalah
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

    createSolveMahasiswa(nim, kodematkul, kelas) {
        fetch(get.createsolvemahasiswa, {
            method: 'post',
            headers: {
                "x-access-token": sessionStorage.name,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nim: nim,
                kodematkul: kodematkul,
                kelas: kelas
            })
        })
            .then(response => response.json())
            .then(response => {
                //berhasil add data
                if (response.status === 1) {
                    setTimeout(this.getDataMahasiswaSolve(), 1000)
                }
                //tidak berhasil add data
                else if (response.status === 0) {
                }
                //ga ada token
                else {
                    sessionStorage.removeItem("name")
                    window.location.reload()
                }
            })
            .catch(error => {
                sessionStorage.removeItem("name")
                window.location.reload()
            })
    }

    deleteSolveMahasiswa(nim, kodematkul, kelas) {
        fetch(get.deletesolvemahasiswa, {
            method: 'post',
            headers: {
                "x-access-token": sessionStorage.name,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nim: nim,
                kodematkul: kodematkul,
                kelas: kelas
            })
        })
            .then(response => response.json())
            .then(response => {
                //berhasil add data
                if (response.status === 1) {
                    setTimeout(this.getDataMahasiswaSolve(), 1000)
                }
                //tidak berhasil add data
                else if (response.status === 0) {
                }
                //ga ada token
                else {
                    sessionStorage.removeItem("name")
                    window.location.reload()
                }
            })
            .catch(error => {
                sessionStorage.removeItem("name")
                window.location.reload()
            })
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        this.setState({
            showStatistikbyNIM: true,
            showStatistikAll: false
        })
        e.preventDefault();
        const { nim_form, startDate, endDate } = this.state
        fetch(get.readpengguna, {
            method: 'post',
            headers: {
                "x-access-token": sessionStorage.name,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sortby: "nim",
                ascdsc: "asc",
                search: nim_form,
                limit: "1",
                page: "1",
            })
        })
            .then(response => response.json())
            .then(response => {
                //berhasil dapet data
                if ((response.status === 1) && (response.count === 1)) {
                    this.setState({
                        nama: response.hasil[0].nama,
                        nim: nim_form,
                        find_pressed: true,
                    })
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
                                    datakosong: false,
                                    data_mahasiswa: response.log_mahasiswa,
                                    data_matkul: response.matkul,
                                })
                            }
                            else if ((response.status === 1) && ((response.log_pengajar.length === 0) || (response.matkul.length === 0))) {
                                this.setState({
                                    datakosong: true,
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
                else if ((response.status === 1) && (response.count !== 1)) {
                    this.setState({
                        nama: "Nama tidak ditemukan",
                        nim: nim_form,
                        datakosong: true,
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
        data_matkul_bermasalah = []
        data_matkul_aman = []
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

    graphfirst(matkul, pengajar, mahasiswa) {
        //matkul : namamatkul, kodematkul, kelas, jumlah pertemuan perminggu
        //datapengajar : kodematkul, kelas, status, keterangan, waktu
        //datamahasiswa : waktu, nama, koderuangan, kodematkul, kelas, keterangan
        const { datakosong, konfigurasi } = this.state
        if (datakosong) {
            return (
                <div>
                </div>
            )
        }
        else {
            var oldmatkul = matkul[0].kodematkul
            var oldkelas = matkul[0].kelas
            var log_bermasalah_1d = []
            var log_bermasalah_2d = []
            var count_hadir_table = 0
            var count_izin_table = 0
            var count_sakit_table = 0
            var count_alfa_table = 0
            var count_alfa_bermasalah = 0
            var count_izin_bermasalah = 0
            var count_sakit_bermasalah = 0

            var labelxminggu = [""]
            var hadir = [0]
            var count_hadir = 0
            var izin = [0]
            var count_izin = 0
            var sakit = [0]
            var count_sakit = 0
            var alfa = [0]
            var count_alfa = 0
            var telat = [0]
            var hadir_pie = [0, 0, 0, 0]
            var telat_pie = [0, 0]

            var tanggal_awal = new Date(pengajar[0].waktu)
            var tanggal_akhir = new Date(pengajar[0].waktu)
            for (var k = 0; k < pengajar.length; k++) {
                if (tanggal_awal > (new Date(pengajar[k].waktu))) {
                    tanggal_awal = new Date(pengajar[k].waktu)
                }
                if (tanggal_akhir < (new Date(pengajar[k].waktu))) {
                    tanggal_akhir = new Date(pengajar[k].waktu)
                }
            }
            var next_week = new Date(tanggal_awal.setDate(tanggal_awal.getDate() + 6))
            var date_week = []
            var count_minggu = 1
            date_week.push(next_week)
            labelxminggu.push("Minggu-" + (count_minggu))
            hadir.push(0)
            izin.push(0)
            sakit.push(0)
            alfa.push(0)
            telat.push(0)
            while (next_week < tanggal_akhir) {
                count_minggu = count_minggu + 1
                labelxminggu.push("Minggu-" + count_minggu)
                hadir.push(0)
                izin.push(0)
                sakit.push(0)
                alfa.push(0)
                telat.push(0)
                tanggal_awal = new Date(tanggal_awal.setDate(tanggal_awal.getDate() + 1))
                next_week = new Date(tanggal_awal.setDate(tanggal_awal.getDate() + 6))
                date_week.push(next_week)
            }

            var tanggal_pengajar_now

            var kodematkul_pengajar, kelas_pengajar, date_pengajar, kodematkul_pengajar_next, kelas_pengajar_next, date_pengajar_next
            var kodematkul_mahasiswa, kelas_mahasiswa, date_mahasiswa, jam_mahasiswa, min_jam_mahasiswa, max_jam_mahasiswa

            var count_matkul = 0
            var kodematkul_now = matkul[count_matkul].kodematkul
            var kelas_now = matkul[count_matkul].kelas
            var count_now = konfigurasi * parseInt(matkul[count_matkul].count)

            for (var i = 0; i < pengajar.length; i++) {
                tanggal_pengajar_now = new Date(pengajar[i].waktu)
                kodematkul_pengajar = pengajar[i].kodematkul
                kelas_pengajar = pengajar[i].kelas

                for (k = 0; k < date_week.length; k++) {
                    if (tanggal_pengajar_now < date_week[k]) {
                        count_minggu = k + 1
                        break;
                    }
                }

                if ((kodematkul_now !== kodematkul_pengajar) || (kelas_now !== kelas_pengajar)) {
                    count_matkul = count_matkul + 1
                    if (count_matkul > matkul.length - 1) {
                        count_matkul = count_matkul - 1
                    }
                    kodematkul_now = matkul[count_matkul].kodematkul
                    kelas_now = matkul[count_matkul].kelas
                    count_now = konfigurasi * parseInt(matkul[count_matkul].count)
                }

                if ((kodematkul_now === kodematkul_pengajar) && (kelas_now === kelas_pengajar)) {


                    date_pengajar = (new Date(pengajar[i].waktu)).toLocaleDateString()

                    if ((new Date(pengajar[i].waktu)).getMinutes() > 40) {
                        min_jam_mahasiswa = (new Date(pengajar[i].waktu)).getHours()
                    }
                    else {
                        min_jam_mahasiswa = (new Date(pengajar[i].waktu)).getHours() - 1
                    }

                    if (i === pengajar.length - 1) {
                        var a = i
                        max_jam_mahasiswa = 23;
                    }
                    else {
                        a = i + 1
                        kodematkul_pengajar_next = pengajar[i + 1].kodematkul
                        kelas_pengajar_next = pengajar[i + 1].kelas
                        date_pengajar_next = (new Date(pengajar[i + 1].waktu)).toLocaleDateString()

                        if ((kodematkul_pengajar_next === kodematkul_pengajar) && (kelas_pengajar_next === kelas_pengajar)) {
                            if (date_pengajar === date_pengajar_next) {
                                if ((new Date(pengajar[i + 1].waktu)).getMinutes() > 40) {
                                    max_jam_mahasiswa = (new Date(pengajar[i + 1].waktu)).getHours()
                                }
                                else {
                                    max_jam_mahasiswa = (new Date(pengajar[i + 1].waktu)).getHours() - 1
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

                    for (var j = 0; j < mahasiswa.length; j++) {

                        kodematkul_mahasiswa = mahasiswa[j].kodematkul
                        kelas_mahasiswa = mahasiswa[j].kelas
                        date_mahasiswa = (new Date(mahasiswa[j].waktu)).toLocaleDateString()
                        jam_mahasiswa = (new Date(mahasiswa[j].waktu)).getHours()

                        if ((kodematkul_mahasiswa === kodematkul_pengajar) && (kelas_mahasiswa === kelas_pengajar) && (date_mahasiswa === date_pengajar) && (jam_mahasiswa >= min_jam_mahasiswa) && (jam_mahasiswa <= max_jam_mahasiswa)) {
                            if (mahasiswa[j].keterangan === "Hadir") {
                                hadir[count_minggu] = hadir[count_minggu] + 1
                                count_hadir = count_hadir + 1
                                count_hadir_table = count_hadir_table + 1
                                var menit_mahasiswa = (new Date(mahasiswa[j].waktu)).getMinutes()
                                if ((jam_mahasiswa > min_jam_mahasiswa + 1) || ((jam_mahasiswa === min_jam_mahasiswa + 1) && (menit_mahasiswa >= 15))) {
                                    telat_pie[0] = telat_pie[0] + 1
                                    telat[count_minggu] = telat[count_minggu] + 1
                                }
                                else {
                                    telat_pie[1] = telat_pie[1] + 1
                                }

                                if (count_sakit_bermasalah < count_now) {
                                    count_sakit_bermasalah = 0
                                }
                                if (count_izin_bermasalah < count_now) {
                                    count_izin_bermasalah = 0
                                }
                                if (count_alfa_bermasalah < count_now) {
                                    count_alfa_bermasalah = 0
                                }
                                break;
                            }
                            else if (mahasiswa[j].keterangan === "Sakit") {
                                sakit[count_minggu] = sakit[count_minggu] + 1
                                count_sakit = count_sakit + 1
                                count_sakit_bermasalah = count_sakit_bermasalah + 1
                                count_sakit_table = count_sakit_table + 1
                                break;
                            }
                            else if (mahasiswa[j].keterangan === "Izin") {
                                izin[count_minggu] = izin[count_minggu] + 1
                                count_izin = count_izin + 1
                                count_izin_bermasalah = count_izin_bermasalah + 1
                                count_izin_table = count_izin_table + 1
                                break;
                            }
                        }
                    }
                    if (j === mahasiswa.length) {
                        alfa[count_minggu] = alfa[count_minggu] + 1
                        count_alfa = count_alfa + 1
                        count_alfa_bermasalah = count_alfa_bermasalah + 1
                        count_alfa_table = count_alfa_table + 1
                    }

                    //deteksi mahasiswa bermasalah
                    var check_bermasalah = 0
                    if (((pengajar[a].kodematkul !== oldmatkul) || (pengajar[a].kelas !== oldkelas)) || (i === pengajar.length - 1)) {
                        if (count_alfa_bermasalah >= count_now) {
                            check_bermasalah = 1
                        }
                        else if (count_izin_bermasalah >= count_now) {
                            check_bermasalah = 2
                        }
                        else if (count_sakit_bermasalah >= count_now) {
                            check_bermasalah = 3
                        }
                        else {
                            check_bermasalah = 0
                        }
                        log_bermasalah_1d.push(oldmatkul)
                        log_bermasalah_1d.push(oldkelas)
                        log_bermasalah_1d.push(matkul[count_matkul].namamatkul)
                        log_bermasalah_1d.push(count_hadir_table)
                        log_bermasalah_1d.push(count_izin_table)
                        log_bermasalah_1d.push(count_sakit_table)
                        log_bermasalah_1d.push(count_alfa_table)
                        log_bermasalah_1d.push(check_bermasalah)

                        log_bermasalah_2d.push(log_bermasalah_1d)

                        log_bermasalah_1d = []
                        oldmatkul = pengajar[a].kodematkul
                        oldkelas = pengajar[a].kelas
                        count_hadir_table = 0
                        count_izin_table = 0
                        count_sakit_table = 0
                        count_alfa_table = 0
                        count_sakit_bermasalah = 0
                        count_izin_bermasalah = 0
                        count_alfa_bermasalah = 0
                    }
                }
            }

            //memasukkan data yg bermasalah dan aman ke var global
            data_matkul_bermasalah = []
            data_matkul_aman = []
            for (i = 0; i < matkul.length; i++) {//namamatkul, kodematkul, kelas, jumlah pertemuan perminggu
                for (j = 0; j < log_bermasalah_2d.length; j++) {
                    if ((matkul[i].kodematkul === log_bermasalah_2d[j][0]) && (matkul[i].kelas === log_bermasalah_2d[j][1]) && (log_bermasalah_2d[j][7] > 0)) {
                        data_matkul_bermasalah.push(matkul[i])
                        break;
                    }
                }
                if (j === log_bermasalah_2d.length) {
                    data_matkul_aman.push(matkul[i])
                }
            }

            hadir_pie[0] = count_hadir
            hadir_pie[1] = count_izin
            hadir_pie[2] = count_sakit
            hadir_pie[3] = count_alfa

            const DataMinggu = {
                labels: labelxminggu,
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
                    {
                        label: 'Telat',
                        fill: false,
                        lineTension: 0.1,
                        borderColor: 'rgba(255,128,0)',
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: telat
                    },
                ]
            };
            const OptionMinggu = {
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
                    text: 'Data Kehadiran Tiap Minggu'
                },
            }

            const DataHadir = {
                labels: ['Hadir', 'Izin', 'Sakit', 'Tidak Hadir'],
                datasets: [
                    {
                        data: hadir_pie,
                        backgroundColor: [
                            'rgba(0,255,0)',
                            'rgba(0,0,255)',
                            'rgba(255,255,0)',
                            'rgba(255,0,0)'
                        ],
                    },
                ],
            };
            const OptionHadir = {
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
                    text: 'Data Kehadiran'
                }
            }

            const DataTelat = {
                labels: ['Terlambat', 'Tepat Waktu'],
                datasets: [
                    {
                        data: telat_pie,
                        backgroundColor: [
                            'red',
                            'blue',
                        ],
                    },
                ],
            };
            const OptionTelat = {
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
                    text: 'Data Keterlambatan'
                }
            }
            var p = 0
            return (
                <div>
                    <div className="texttengah">
                        <Pie
                            data={DataHadir}
                            width={300}
                            height={250}
                            options={OptionHadir}
                        />
                        <div style={{ padding: "20px" }}></div>
                        <Pie
                            data={DataTelat}
                            width={300}
                            height={250}
                            options={OptionTelat}
                        />
                    </div>
                    <div className="paddingtop30px2"></div>
                    <div>
                        <Line
                            data={DataMinggu}
                            width={900}
                            height={250}
                            options={OptionMinggu}
                        />
                    </div>
                    <div className="paddingtop30px2"></div>
                    <div className="isitabel">
                        <table className="tablefakultas">
                            <thead className="theadlog">
                                <tr>
                                    <th className="namamatkul" style={{ cursor: "default" }}>Nama Matakuliah</th>
                                    <th className="kodematkul" style={{ cursor: "default" }}>Kode</th>
                                    <th className="kelas" style={{ cursor: "default" }}>Kelas</th>
                                    <th className="kelas" style={{ cursor: "default" }}>Hadir</th>
                                    <th className="kelas" style={{ cursor: "default" }}>Izin</th>
                                    <th className="kelas" style={{ cursor: "default" }}>Sakit</th>
                                    <th className="kelas" style={{ cursor: "default" }}>Alfa</th>
                                    <th className="keterangan" style={{ cursor: "default" }}>Detail</th>
                                </tr>
                            </thead>
                            {
                                (log_bermasalah_2d.length !== 0) &&
                                <tbody className="tbodylog">
                                    {log_bermasalah_2d.map(isidata => (
                                        ((isidata[7] === 0) &&
                                            <tr key={p++}>
                                                <td>{isidata[2]}</td>
                                                <td>{isidata[0]}</td>
                                                <td>{isidata[1]}</td>
                                                <td>{isidata[3]}</td>
                                                <td>{isidata[4]}</td>
                                                <td>{isidata[5]}</td>
                                                <td>{isidata[6]}</td>
                                                <td><a href={"#" + isidata[0] + isidata[1]}><u>Show Detail</u></a></td>
                                            </tr>)

                                        || ((isidata[7] === 1) &&
                                            <tr key={p++}>
                                                <td>{isidata[2]}</td>
                                                <td>{isidata[0]}</td>
                                                <td>{isidata[1]}</td>
                                                <td>{isidata[3]}</td>
                                                <td>{isidata[4]}</td>
                                                <td>{isidata[5]}</td>
                                                <td className="kehadiranbermasalah" style={{ border: "none" }}>{isidata[6]}</td>
                                                <td><a href={"#" + isidata[0] + isidata[1]}><u>Show Detail</u></a></td>
                                            </tr>)

                                        || ((isidata[7] === 2) &&
                                            <tr key={p++}>
                                                <td>{isidata[2]}</td>
                                                <td>{isidata[0]}</td>
                                                <td>{isidata[1]}</td>
                                                <td>{isidata[3]}</td>
                                                <td className="kehadiranbermasalah" style={{ border: "none" }}>{isidata[4]}</td>
                                                <td>{isidata[5]}</td>
                                                <td>{isidata[6]}</td>
                                                <td><a href={"#" + isidata[0] + isidata[1]}><u>Show Detail</u></a></td>
                                            </tr>)

                                        || ((isidata[7] === 3) &&
                                            <tr key={p++}>
                                                <td>{isidata[2]}</td>
                                                <td>{isidata[0]}</td>
                                                <td>{isidata[1]}</td>
                                                <td>{isidata[3]}</td>
                                                <td>{isidata[4]}</td>
                                                <td className="kehadiranbermasalah" style={{ border: "none" }}>{isidata[5]}</td>
                                                <td>{isidata[6]}</td>
                                                <td><a href={"#" + isidata[0] + isidata[1]}><u>Show Detail</u></a></td>
                                            </tr>)
                                    ))}
                                </tbody>
                            }
                        </table>
                    </div>
                </div >
            )
        }
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

    getDataPerMatkul(matkul, pengajar, mahasiswa, isBermasalah) {
        var count_hadir = 0
        var count_izin = 0
        var count_sakit = 0
        var count_alfa = 0
        var hadir_pie = [0, 0, 0, 0]
        var telat_pie = [0, 0]

        var output_1d = []
        var output_2d = []
        var counter_pertemuan = 0
        var waktu_table, koderuangan_table, hadir_table, izin_table, sakit_table, alfa_table

        var kodematkul_pengajar, kelas_pengajar, date_pengajar, kodematkul_pengajar_next, kelas_pengajar_next, date_pengajar_next
        var kodematkul_mahasiswa, kelas_mahasiswa, date_mahasiswa, jam_mahasiswa, min_jam_mahasiswa, max_jam_mahasiswa


        for (var i = 0; i < pengajar.length; i++) {//pengajar : kodematkul, kelas, status, keterangan, waktu
            kodematkul_pengajar = pengajar[i].kodematkul
            kelas_pengajar = pengajar[i].kelas

            if ((kodematkul_pengajar === matkul.kodematkul) && (kelas_pengajar === matkul.kelas)) {
                counter_pertemuan = counter_pertemuan + 1
                date_pengajar = (new Date(pengajar[i].waktu)).toLocaleDateString()

                if ((new Date(pengajar[i].waktu)).getMinutes() > 40) {
                    min_jam_mahasiswa = (new Date(pengajar[i].waktu)).getHours()
                }
                else {
                    min_jam_mahasiswa = (new Date(pengajar[i].waktu)).getHours() - 1
                }

                if (i === pengajar.length - 1) {
                    max_jam_mahasiswa = 23;
                }
                else {
                    kodematkul_pengajar_next = pengajar[i + 1].kodematkul
                    kelas_pengajar_next = pengajar[i + 1].kelas
                    date_pengajar_next = (new Date(pengajar[i + 1].waktu)).toLocaleDateString()

                    if ((kodematkul_pengajar_next === kodematkul_pengajar) && (kelas_pengajar_next === kelas_pengajar)) {

                        if (date_pengajar === date_pengajar_next) {
                            if ((new Date(pengajar[i + 1].waktu)).getMinutes() > 40) {
                                max_jam_mahasiswa = (new Date(pengajar[i + 1].waktu)).getHours()
                            }
                            else {
                                max_jam_mahasiswa = (new Date(pengajar[i + 1].waktu)).getHours() - 1
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

                for (var j = 0; j < mahasiswa.length; j++) { //mahasiswa : kodematkul, kelas, waktu.

                    kodematkul_mahasiswa = mahasiswa[j].kodematkul
                    kelas_mahasiswa = mahasiswa[j].kelas
                    date_mahasiswa = (new Date(mahasiswa[j].waktu)).toLocaleDateString()
                    jam_mahasiswa = (new Date(mahasiswa[j].waktu)).getHours()

                    if ((kodematkul_mahasiswa === kodematkul_pengajar) && (kelas_mahasiswa === kelas_pengajar) && (date_mahasiswa === date_pengajar) && (jam_mahasiswa >= min_jam_mahasiswa) && (jam_mahasiswa <= max_jam_mahasiswa)) {
                        if (mahasiswa[j].keterangan === "Hadir") {
                            count_hadir = count_hadir + 1
                            hadir_table = "✔"
                            izin_table = ""
                            sakit_table = ""
                            alfa_table = ""
                            var menit_mahasiswa = (new Date(mahasiswa[j].waktu)).getMinutes()
                            if ((jam_mahasiswa > min_jam_mahasiswa + 1) || ((jam_mahasiswa === min_jam_mahasiswa + 1) && (menit_mahasiswa >= 15))) {
                                telat_pie[0] = telat_pie[0] + 1
                            }
                            else {
                                telat_pie[1] = telat_pie[1] + 1
                            }
                            break;
                        }
                        else if (mahasiswa[j].keterangan === "Sakit") {
                            count_sakit = count_sakit + 1
                            hadir_table = ""
                            izin_table = ""
                            sakit_table = "✔"
                            alfa_table = ""
                            break;
                        }
                        else if (mahasiswa[j].keterangan === "Izin") {
                            count_izin = count_izin + 1
                            hadir_table = ""
                            izin_table = "✔"
                            sakit_table = ""
                            alfa_table = ""
                            break;
                        }
                    }
                }
                if (j === mahasiswa.length) {
                    count_alfa = count_alfa + 1
                    hadir_table = ""
                    izin_table = ""
                    sakit_table = ""
                    alfa_table = "✔"
                }

                waktu_table = this.waktu(new Date(pengajar[i].waktu))
                koderuangan_table = pengajar[i].koderuangan

                output_1d.push(counter_pertemuan)
                output_1d.push(waktu_table)
                output_1d.push(koderuangan_table)
                output_1d.push(hadir_table)
                output_1d.push(izin_table)
                output_1d.push(sakit_table)
                output_1d.push(alfa_table)

                output_2d.push(output_1d)
            }
            output_1d = []
        }

        hadir_pie[0] = count_hadir
        hadir_pie[1] = count_izin
        hadir_pie[2] = count_sakit
        hadir_pie[3] = count_alfa

        const DataHadir = {
            labels: ['Hadir', 'Izin', 'Sakit', 'Tidak Hadir'],
            datasets: [
                {
                    data: hadir_pie,
                    backgroundColor: [
                        'rgba(0,255,0)',
                        'rgba(0,0,255)',
                        'rgba(255,255,0)',
                        'rgba(255,0,0)'
                    ],
                },
            ],
        };
        const OptionHadir = {
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
                text: 'Data Kehadiran'
            }
        }

        const DataTelat = {
            labels: ['Terlambat', 'Tepat Waktu'],
            datasets: [
                {
                    data: telat_pie,
                    backgroundColor: [
                        'red',
                        'blue',
                    ],
                },
            ],
        };
        const OptionTelat = {
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
                text: 'Data Keterlambatan'
            }
        }
        var p = 0
        // var filter_log = ""
        // if (isBermasalah === 1) {
        //     filter_log = "rgb(250, 0, 0)"
        // }
        // else {
        //     filter_log = "rgb(0, 0, 100)"
        // }
        return (
            <div>
                <div className="texttengah">
                    <Pie
                        data={DataHadir}
                        width={300}
                        height={250}
                        options={OptionHadir}
                    />
                    <div style={{ padding: "20px" }}></div>
                    <Pie
                        data={DataTelat}
                        width={300}
                        height={250}
                        options={OptionTelat}
                    />
                </div>
                <div className="paddingtop30px2"></div>
                <div className="isitabel" style={{ maxHeight: "400px", overflowY: "scroll" }}>
                    <table className="tablelaporan">
                        <thead className="theadlog">
                            <tr>
                                <th className="laporanmasuk"> Pertemuan ke- </th>
                                <th className="laporanhari"> Waktu </th>
                                <th className="laporanmasuk"> Kode Ruangan </th>
                                <th className="laporansakit"> Hadir </th>
                                <th className="laporansakit"> Izin </th>
                                <th className="laporansakit"> Sakit </th>
                                <th className="laporansakit"> Alfa </th>
                            </tr>
                        </thead>
                        <tbody className="tbodylog">
                            {output_2d.map(isidata => (
                                <tr key={p++}>
                                    <td>{isidata[0]}</td>
                                    <td>{isidata[1]}</td>
                                    <td>{isidata[2]}</td>
                                    <td>{isidata[3]}</td>
                                    <td>{isidata[4]}</td>
                                    <td>{isidata[5]}</td>
                                    <td>{isidata[6]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    showAllStatistik() {
        this.setState({
            showStatistikAll: true,
            showStatistikbyNIM: false
        })
    }

    render() {
        // console.log(data_matkul_aman)
        // console.log(data_matkul_bermasalah)

        data_matkul_aman.splice(0, data_matkul_aman.length)
        data_matkul_bermasalah.splice(0, data_matkul_bermasalah.length)
        const state = this.state
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

        // var widthgraph = 600 * loop.length + 'px';
        state.data_statistik_solve.sort(function (a, b) {
            return a[2] - b[2];
        })
        state.data_statistik_bermasalah.sort(function (a, b) {
            return a[2] - b[2];
        })

        var loadingNow = true
        if ((state.counter_loading - state.lengthMahasiswa) > -20) {
            loadingNow = false
        }
        var inc = 0
        return (
            <div>
                <div className="kotakfilter3">
                    <form className="kotakforminputlogpintu" onSubmit={this.handleSubmit}>
                        <div className="kotakinputlaporannimstatistik">
                            <label><b>NIM</b> </label> <br></br>
                            <input name="nim_form" onChange={this.handleChange} className="inputformlaporannim" type="text" required></input>
                        </div>
                        <div className="kotakinputlaporannamastatistik">
                            <label><b>Min absen (minggu)</b> </label> <br></br>
                            <input name="konfigurasi" onChange={this.handleChange} className="inputformlaporannim" type="number" required ></input>
                        </div>
                        <div className="kotakinputlaporanstartstatistik">
                            <label><b>Tanggal Awal</b> </label> <br></br>
                            <input name="startDate" onChange={this.handleChange} className="inputformlaporannim" type="date" required ></input>
                        </div>
                        <div className="kotakinputlaporanendstatistik">
                            <label><b>Tanggal Akhir</b> </label> <br></br>
                            <input name="endDate" onChange={this.handleChange} className="inputformlaporannim" type="date" required ></input>
                        </div>

                        <div className="kotaksubmitpenggunadaftar">
                            <input className="submitformlogpintu" type="submit" value="Cari"></input>
                        </div>
                    </form>

                    <div className="kotakcancelpenggunadaftar2">
                        <button className="buttonlikea" onClick={() => this.showAllStatistik()}> <span className="cancelformpengguna">Show All</span></button>
                    </div>
                </div>
                <div className="paddingtop30px2"></div>
                {
                    (state.isLoading === false) && state.showStatistikAll &&
                    <div className="kotakdata">
                        <div className="texttengah">
                            <label><b>Min absen (minggu)</b> </label> <br></br>
                            <select name="konfigurasiall" onChange={this.handleChange} className="inputfilterruangan" style={{ marginLeft: "20px" }}>
                                <option> </option>
                                <option key={inc++} value={1}>1 Minggu</option>
                                <option key={inc++} value={2}>2 Minggu</option>
                                <option key={inc++} value={3}>3 Minggu</option>
                                <option key={inc++} value={4}>4 Minggu</option>
                                <option key={inc++} value={5}>5 Minggu</option>
                                <option key={inc++} value={6}>6 Minggu</option>
                                <option key={inc++} value={7}>7 Minggu</option>
                                <option key={inc++} value={8}>8 Minggu</option>
                                <option key={inc++} value={9}>9 Minggu</option>
                                <option key={inc++} value={10}>10 Minggu</option>
                                <option key={inc++} value={11}>11 Minggu</option>
                                <option key={inc++} value={12}>12 Minggu</option>
                            </select>
                            <button className="submitstatistikall" onClick={() => this.getDataPenggunaAll()}> Show All</button>
                        </div>
                        <div className="paddingtop30px2"></div>
                        {
                            loadingNow &&
                            <div style={{ display: 'block', textAlign: 'center' }}>
                                <h5>Daftar Mahasiswa Bermasalah&ensp;<i className="fa fa-gear fa-spin" style={{ height: '20px' }} ></i> </h5>
                            </div>
                        }
                        {
                            loadingNow === false &&
                            <div style={{ display: 'block', textAlign: 'center' }}>
                                <h5>Daftar Mahasiswa Bermasalah</h5>
                            </div>
                        }
                        <div className="isitabel">
                            <table className="tablelog">
                                <thead className="theadlog">
                                    <tr>
                                        <th className="fakultas" style={{ cursor: "default" }}>Fakultas</th>
                                        <th className="jurusan" style={{ cursor: "default" }}>Jurusan</th>
                                        <th className="nim" style={{ cursor: "default" }}>NIM</th>
                                        <th className="nama" style={{ cursor: "default" }}>Nama</th>
                                        <th className="namamatkul" style={{ cursor: "default" }}>Mata Kuliah</th>
                                        <th className="kodematkul" style={{ cursor: "default" }}>Kode</th>
                                        <th className="kelas" style={{ cursor: "default" }}>Kelas</th>
                                        <th className="kelas" style={{ cursor: "default" }}>Hadir</th>
                                        <th className="kelas" style={{ cursor: "default" }}>Izin</th>
                                        <th className="kelas" style={{ cursor: "default" }}>Sakit</th>
                                        <th className="kelas" style={{ cursor: "default" }}>Alfa</th>
                                        <th className="kelas" style={{ cursor: "default" }}>Keterangan</th>
                                    </tr>
                                </thead>
                                {((state.data_statistik_solve.length !== 0) || (state.data_statistik_bermasalah.length !== 0)) &&
                                    <tbody className="tbodylog">
                                        {
                                            state.data_statistik_bermasalah.length !== 0 &&
                                            state.data_statistik_bermasalah.map(isidata => (
                                                ((isidata[11] === 1) &&
                                                    <tr key={inc++}>
                                                        <td>{isidata[0]}</td>
                                                        <td>{isidata[1]}</td>
                                                        <td>{isidata[2]}</td>
                                                        <td>{isidata[3]}</td>
                                                        <td>{isidata[6]}</td>
                                                        <td>{isidata[4]}</td>
                                                        <td>{isidata[5]}</td>
                                                        <td>{isidata[7]}</td>
                                                        <td>{isidata[8]}</td>
                                                        <td>{isidata[9]}</td>
                                                        <td className="kehadiranbermasalah" style={{ border: "none" }}>{isidata[10]}</td>
                                                        <td>
                                                            <button className="backgroundmerah" onClick={() => this.createSolveMahasiswa(isidata[2], isidata[4], isidata[5])} >
                                                                Solve
                                                            </button>
                                                        </td>
                                                    </tr>)

                                                || ((isidata[11] === 2) &&
                                                    <tr key={inc++}>
                                                        <td>{isidata[0]}</td>
                                                        <td>{isidata[1]}</td>
                                                        <td>{isidata[2]}</td>
                                                        <td>{isidata[3]}</td>
                                                        <td>{isidata[6]}</td>
                                                        <td>{isidata[4]}</td>
                                                        <td>{isidata[5]}</td>
                                                        <td>{isidata[7]}</td>
                                                        <td className="kehadiranbermasalah" style={{ border: "none" }}>{isidata[8]}</td>
                                                        <td>{isidata[9]}</td>
                                                        <td>{isidata[10]}</td>
                                                        <td>
                                                            <button className="backgroundmerah" onClick={() => this.createSolveMahasiswa(isidata[2], isidata[4], isidata[5])} >
                                                                Solve
                                                            </button>
                                                        </td>
                                                    </tr>)

                                                || ((isidata[11] === 3) &&
                                                    <tr key={inc++}>
                                                        <td>{isidata[0]}</td>
                                                        <td>{isidata[1]}</td>
                                                        <td>{isidata[2]}</td>
                                                        <td>{isidata[3]}</td>
                                                        <td>{isidata[6]}</td>
                                                        <td>{isidata[4]}</td>
                                                        <td>{isidata[5]}</td>
                                                        <td>{isidata[7]}</td>
                                                        <td>{isidata[8]}</td>
                                                        <td className="kehadiranbermasalah" style={{ border: "none" }}>{isidata[9]}</td>
                                                        <td>{isidata[10]}</td>
                                                        <td>
                                                            <button className="backgroundmerah" onClick={() => this.createSolveMahasiswa(isidata[2], isidata[4], isidata[5])} >
                                                                Solve
                                                            </button>
                                                        </td>
                                                    </tr>)
                                            ))}
                                        {state.data_statistik_solve.length !== 0 &&
                                            state.data_statistik_solve.map(isidata => (
                                                ((isidata[11] === 1) &&
                                                    <tr key={inc++}>
                                                        <td>{isidata[0]}</td>
                                                        <td>{isidata[1]}</td>
                                                        <td>{isidata[2]}</td>
                                                        <td>{isidata[3]}</td>
                                                        <td>{isidata[6]}</td>
                                                        <td>{isidata[4]}</td>
                                                        <td>{isidata[5]}</td>
                                                        <td>{isidata[7]}</td>
                                                        <td>{isidata[8]}</td>
                                                        <td>{isidata[9]}</td>
                                                        <td className="kehadiranbermasalah" style={{ border: "none" }}>{isidata[10]}</td>
                                                        <td>
                                                            <button className="backgroundhijau" onClick={() => this.deleteSolveMahasiswa(isidata[2], isidata[4], isidata[5])} >
                                                                Solved
                                                            </button>
                                                        </td>
                                                    </tr>)

                                                || ((isidata[11] === 2) &&
                                                    <tr key={inc++}>
                                                        <td>{isidata[0]}</td>
                                                        <td>{isidata[1]}</td>
                                                        <td>{isidata[2]}</td>
                                                        <td>{isidata[3]}</td>
                                                        <td>{isidata[6]}</td>
                                                        <td>{isidata[4]}</td>
                                                        <td>{isidata[5]}</td>
                                                        <td>{isidata[7]}</td>
                                                        <td className="kehadiranbermasalah" style={{ border: "none" }}>{isidata[8]}</td>
                                                        <td>{isidata[9]}</td>
                                                        <td>{isidata[10]}</td>
                                                        <td>
                                                            <button className="backgroundhijau" onClick={() => this.deleteSolveMahasiswa(isidata[2], isidata[4], isidata[5])} >
                                                                Solved
                                                            </button>
                                                        </td>
                                                    </tr>)

                                                || ((isidata[11] === 3) &&
                                                    <tr key={inc++}>
                                                        <td>{isidata[0]}</td>
                                                        <td>{isidata[1]}</td>
                                                        <td>{isidata[2]}</td>
                                                        <td>{isidata[3]}</td>
                                                        <td>{isidata[6]}</td>
                                                        <td>{isidata[4]}</td>
                                                        <td>{isidata[5]}</td>
                                                        <td>{isidata[7]}</td>
                                                        <td>{isidata[8]}</td>
                                                        <td className="kehadiranbermasalah" style={{ border: "none" }}>{isidata[9]}</td>
                                                        <td>{isidata[10]}</td>
                                                        <td>
                                                            <button className="backgroundhijau" onClick={() => this.deleteSolveMahasiswa(isidata[2], isidata[4], isidata[5])} >
                                                                Solved
                                                            </button>
                                                        </td>
                                                    </tr>)
                                            ))}
                                    </tbody>
                                }
                                {((state.data_statistik_solve.length === 0) && (state.data_statistik_bermasalah.length === 0)) &&
                                    <tbody className="tbodylog">
                                        <tr>
                                            <td colSpan="13">Data tidak ditemukan</td>
                                        </tr>
                                    </tbody>}
                            </table>
                        </div>
                    </div>
                }
                {
                    (state.isLoading === false) && state.showStatistikbyNIM &&
                    <div id="inputform">
                        <div className="kotakdata">
                            <div>
                                <span><b>NIM &ensp;&ensp;&emsp;: {state.nim}</b></span>
                                <br></br>
                                <span><b>Nama &emsp; : {state.nama}</b></span>
                                <br></br>
                                <span><b>Periode &ensp;: {PeriodeStatistik(state.startDate, state.endDate) || '-'}</b></span>
                                <br></br>
                            </div>
                            <div className="paddingtop30px2"></div>
                            {
                                state.datakosong &&
                                <div style={{ textAlign: "center", display: "block" }}>
                                    <h5>
                                        Data tidak ditemukan
                                    </h5>
                                </div>
                            }
                            {
                                state.datakosong === false &&
                                <div className="scrollx">
                                    <div className="texttengah" style={{ minWidth: "900px" }}>
                                        {this.graphfirst(state.data_matkul, state.data_pengajar, state.data_mahasiswa)}
                                    </div>
                                </div>
                            }
                        </div>
                        {
                            (state.datakosong === false) && (data_matkul_bermasalah.length !== 0) &&
                            data_matkul_bermasalah.map(isidata => (
                                <div key={inc++} className="kotakdata2" id={isidata.kodematkul + "" + isidata.kelas}>
                                    <div className="scrollx">
                                        <div style={{ minWidth: "800px" }}>
                                            <div style={{ textAlign: "center", display: "block" }}>
                                                <a href="#inputform"><u>Back to top</u></a>
                                                <h5>{isidata.kodematkul} - {isidata.kelas}</h5>
                                            </div>
                                            <div>
                                                {this.getDataPerMatkul(isidata, state.data_pengajar, state.data_mahasiswa, 1)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                        {
                            (state.datakosong === false) && (data_matkul_aman.length !== 0) &&

                            data_matkul_aman.map(isidata => (
                                <div key={inc++} className="kotakdata" id={isidata.kodematkul + "" + isidata.kelas}>
                                    <div className="scrollx">
                                        <div style={{ minWidth: "800px" }}>
                                            <div style={{ textAlign: "center", display: "block" }}>
                                                <a href="#inputform"><u>Back to top</u></a>
                                                <h5>{isidata.kodematkul} - {isidata.kelas}</h5>
                                            </div>
                                            <div>
                                                {this.getDataPerMatkul(isidata, state.data_pengajar, state.data_mahasiswa, 0)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                }
            </div>

        )
    }
}

export default withRouter(StatistikMahasiswa);



    // getDataStatistikAll(matkul, pengajar, mahasiswa) {
    // console.log("1")
    // data_statistik_all = []
    // //mendapatkan tanggal pengajar agar tidak tumpuk
    // var filter_tanggal_pengajar = [];
    // filter_tanggal_pengajar.push(pengajar[0])
    // var filter_kodematkul_pengajar = pengajar[0].kodematkul
    // var filter_kelas_pengajar = pengajar[0].kelas
    // var filter_date_pengajar = (new Date(pengajar[0].waktu)).toLocaleDateString()
    // var filter_jam_pengajar;

    // if ((new Date(pengajar[0].waktu)).getMinutes() > 40) {
    //     filter_jam_pengajar = (new Date(pengajar[0].waktu)).getHours() + 1
    // }
    // else {
    //     filter_jam_pengajar = (new Date(pengajar[0].waktu)).getHours()
    // }

    // var filter_kodematkul_next_pengajar, filter_kelas_next_pengajar, filter_date_next_pengajar, filter_jam_next_pengajar;

    // for (var i = 1; i < pengajar.length; i++) {
    //     console.log("2")
    //     filter_kodematkul_next_pengajar = pengajar[i].kodematkul
    //     filter_kelas_next_pengajar = pengajar[i].kelas
    //     filter_date_next_pengajar = (new Date(pengajar[i].waktu)).toLocaleDateString()
    //     filter_jam_next_pengajar = (new Date(pengajar[i].waktu)).getHours()
    //     if ((pengajar[i].keterangan === "Hadir") || (pengajar[i].keterangan === "Izin") || (pengajar[i].keterangan === "Sakit")) {
    //         if ((filter_kodematkul_next_pengajar === filter_kodematkul_pengajar) && (filter_kelas_next_pengajar === filter_kelas_pengajar) && (filter_date_next_pengajar === filter_date_pengajar) && ((filter_jam_next_pengajar === filter_jam_pengajar - 1) || (filter_jam_next_pengajar === filter_jam_pengajar))) {
    //         }
    //         else {
    //             filter_tanggal_pengajar.push(pengajar[i])
    //             filter_kodematkul_pengajar = pengajar[i].kodematkul
    //             filter_kelas_pengajar = pengajar[i].kelas
    //             filter_date_pengajar = (new Date(pengajar[i].waktu)).toLocaleDateString()

    //             if ((new Date(pengajar[i].waktu)).getMinutes() > 40) {
    //                 filter_jam_pengajar = (new Date(pengajar[i].waktu)).getHours() + 1
    //             }
    //             else {
    //                 filter_jam_pengajar = (new Date(pengajar[i].waktu)).getHours()
    //             }
    //         }

    //     }
    // }
    // console.log("3")

    // var matkul_now, kelas_now, nim_now, namamatkul_now, fakultas_now, jurusan_now, nama_now
    // var max_tidak_hadir

    // var matkul_pengajar_now, kelas_pengajar_now, date_pengajar_now, matkul_pengajar_next, kelas_pengajar_next, date_pengajar_next
    // var min_jam_mahasiswa, max_jam_mahasiswa

    // var hadir = 0;
    // var sakit = 0;
    // var izin = 0;
    // var alfa = 0;
    // var count_sakit = 0;
    // var count_izin = 0;
    // var count_alfa = 0;

    // var output_1d = []

    // for (i = 0; i < matkul.length; i++) {
    //     console.log("4")
    //     matkul_now = matkul[i].kodematkul
    //     kelas_now = matkul[i].kelas
    //     namamatkul_now = matkul[i].namamatkul
    //     fakultas_now = matkul[i].fakultas
    //     jurusan_now = matkul[i].jurusan
    //     nama_now = matkul[i].nama
    //     nim_now = matkul[i].nim
    //     max_tidak_hadir = 4 * parseInt(matkul[i].count)

    //     for (var j = 0; j < filter_tanggal_pengajar.length; j++) {
    //         console.log("5")
    //         matkul_pengajar_now = filter_tanggal_pengajar[j].kodematkul
    //         kelas_pengajar_now = filter_tanggal_pengajar[j].kelas

    //         if ((matkul_now === matkul_pengajar_now) && (kelas_now === kelas_pengajar_now)) {
    //             date_pengajar_now = (new Date(filter_tanggal_pengajar[i].waktu)).toLocaleDateString()

    //             if ((new Date(filter_tanggal_pengajar[i].waktu)).getMinutes() > 40) {
    //                 min_jam_mahasiswa = (new Date(filter_tanggal_pengajar[i].waktu)).getHours()
    //             }
    //             else {
    //                 min_jam_mahasiswa = (new Date(filter_tanggal_pengajar[i].waktu)).getHours() - 1
    //             }

    //             if (j === filter_tanggal_pengajar.length - 1) {
    //                 max_jam_mahasiswa = 23;
    //             }
    //             else {
    //                 //deteksi jam max mahasiswa absen
    //                 matkul_pengajar_next = filter_tanggal_pengajar[i + 1].kodematkul
    //                 kelas_pengajar_next = filter_tanggal_pengajar[i + 1].kelas
    //                 date_pengajar_next = (new Date(filter_tanggal_pengajar[i + 1].waktu)).toLocaleDateString()

    //                 if ((matkul_pengajar_next === matkul_pengajar_now) && (kelas_pengajar_next === kelas_pengajar_now)) {
    //                     if (date_pengajar_now === date_pengajar_next) {
    //                         if ((new Date(filter_tanggal_pengajar[i + 1].waktu)).getMinutes() > 40) {
    //                             max_jam_mahasiswa = (new Date(filter_tanggal_pengajar[i + 1].waktu)).getHours()
    //                         }
    //                         else {
    //                             max_jam_mahasiswa = (new Date(filter_tanggal_pengajar[i + 1].waktu)).getHours() - 1
    //                         }
    //                     }
    //                     else {
    //                         max_jam_mahasiswa = 23
    //                     }
    //                 }
    //                 else {
    //                     max_jam_mahasiswa = 23
    //                 }
    //             }

    //             var nim_mahasiswa, kodematkul_mahasiswa, kelas_mahasiswa, date_mahasiswa, jam_mahasiswa
    //             for (var k = 0; k < mahasiswa.length; k++) {
    //                 console.log("6")
    //                 nim_mahasiswa = mahasiswa[k].nim
    //                 kodematkul_mahasiswa = mahasiswa[k].kodematkul
    //                 kelas_mahasiswa = mahasiswa[k].kelas
    //                 date_mahasiswa = (new Date(mahasiswa[k].waktu)).toLocaleDateString()
    //                 jam_mahasiswa = (new Date(mahasiswa[k].waktu)).getHours()

    //                 if ((nim_mahasiswa === nim_now) && (kodematkul_mahasiswa === matkul_pengajar_now) && (kelas_mahasiswa === kelas_pengajar_now) && (date_mahasiswa === date_pengajar_now) && (jam_mahasiswa >= min_jam_mahasiswa) && (jam_mahasiswa <= max_jam_mahasiswa)) {
    //                     if (mahasiswa[k].keterangan === "Hadir") {
    //                         hadir = hadir + 1

    //                         if (count_alfa < max_tidak_hadir) {
    //                             count_alfa = 0
    //                         }
    //                         if (count_izin < max_tidak_hadir) {
    //                             count_izin = 0
    //                         }
    //                         if (count_sakit < max_tidak_hadir) {
    //                             count_sakit = 0
    //                         }

    //                         break;
    //                     }
    //                     else if (mahasiswa[k].keterangan === "Sakit") {
    //                         sakit = sakit + 1
    //                         count_sakit = count_sakit + 1
    //                         break;
    //                     }
    //                     else if (mahasiswa[k].keterangan === "Izin") {
    //                         izin = izin + 1
    //                         count_izin = count_izin + 1
    //                         break;
    //                     }
    //                 }
    //             }
    //             if (k === mahasiswa.length) {
    //                 alfa = alfa + 1
    //                 count_alfa = count_alfa + 1
    //             }
    //         }
    //     }

    //     if (count_alfa >= max_tidak_hadir) {
    //         output_1d.push(fakultas_now)
    //         output_1d.push(jurusan_now)
    //         output_1d.push(nim_now)
    //         output_1d.push(nama_now)
    //         output_1d.push(namamatkul_now)
    //         output_1d.push(matkul_now)
    //         output_1d.push(kelas_now)
    //         output_1d.push(hadir)
    //         output_1d.push(izin)
    //         output_1d.push(sakit)
    //         output_1d.push(alfa)
    //         output_1d.push(1)
    //         data_statistik_all.push(output_1d)
    //     }
    //     if (count_izin >= max_tidak_hadir) {
    //         output_1d.push(fakultas_now)
    //         output_1d.push(jurusan_now)
    //         output_1d.push(nim_now)
    //         output_1d.push(nama_now)
    //         output_1d.push(namamatkul_now)
    //         output_1d.push(matkul_now)
    //         output_1d.push(kelas_now)
    //         output_1d.push(hadir)
    //         output_1d.push(izin)
    //         output_1d.push(sakit)
    //         output_1d.push(alfa)
    //         output_1d.push(2)
    //         data_statistik_all.push(output_1d)
    //     }
    //     if (count_sakit >= max_tidak_hadir) {
    //         output_1d.push(fakultas_now)
    //         output_1d.push(jurusan_now)
    //         output_1d.push(nim_now)
    //         output_1d.push(nama_now)
    //         output_1d.push(namamatkul_now)
    //         output_1d.push(matkul_now)
    //         output_1d.push(kelas_now)
    //         output_1d.push(hadir)
    //         output_1d.push(izin)
    //         output_1d.push(sakit)
    //         output_1d.push(alfa)
    //         output_1d.push(3)
    //         data_statistik_all.push(output_1d)
    //     }
    //     output_1d = []
    //     hadir = 0;
    //     sakit = 0;
    //     izin = 0;
    //     alfa = 0;
    //     count_sakit = 0;
    //     count_izin = 0;
    //     count_alfa = 0;
    // }
    // }
