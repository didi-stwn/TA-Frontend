import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import get from './config';

class StatistikRuangan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            koderuangan_form: '',
            koderuangan: 'Masukkan Kode Ruangan',
            alamatruangan: '-',
            startDate: '',
            endDate: '',
            //all
            data_all: [0, 0],
            data_all_telat_waktu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            data_all_tidaktelat_waktu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //senin
            data_senin: [0, 0],
            data_senin_telat_waktu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            data_senin_tidaktelat_waktu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //selasa
            data_selasa: [0, 0],
            data_selasa_telat_waktu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            data_selasa_tidaktelat_waktu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //rabu
            data_rabu: [0, 0],
            data_rabu_telat_waktu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            data_rabu_tidaktelat_waktu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //kamis
            data_kamis: [0, 0],
            data_kamis_telat_waktu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            data_kamis_tidaktelat_waktu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //jumat
            data_jumat: [0, 0],
            data_jumat_telat_waktu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            data_jumat_tidaktelat_waktu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //sabtu
            data_sabtu: [0, 0],
            data_sabtu_telat_waktu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            data_sabtu_tidaktelat_waktu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //minggu
            data_minggu: [0, 0],
            data_minggu_telat_waktu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            data_minggu_tidaktelat_waktu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //jadwal
            data_jadwal: [],
            data_kelastambahan: [],
            datakosong: true,
            jam_masuk: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
            hari: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitDaftar = this.handleSubmitDaftar.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }


    handleSubmitDaftar(e) {
        e.preventDefault();
        const { koderuangan_form, startDate, endDate } = this.state;
        this.setState({
            koderuangan: koderuangan_form,
        })
        fetch(get.readruangan, {
            method: 'post',
            headers: {
                "x-access-token": sessionStorage.name,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sortby: "koderuangan",
                ascdsc: "asc",
                search: koderuangan_form,
                limit: "1",
                page: "1",
            })
        })
            .then(response => response.json())
            .then(response => {
                //berhasil dapet data
                if ((response.status === 1) && (response.count !== 0)) {
                    this.setState({
                        alamatruangan: response.hasil[0].alamat,
                        find_pressed: true,
                    })
                    fetch(get.readstatistikruangan, {
                        method: 'post',
                        headers: {
                            "x-access-token": sessionStorage.name,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            koderuangan: koderuangan_form,
                            startDate: startDate,
                            endDate: endDate,
                        })
                    })
                        .then(response => response.json())
                        .then(response => { //status, log, jadwal_ruangan, jadwal_matkultambahan
                            //data kosong
                            if ((response.status === 1) && (response.log_pengajar.length !== 0)) {
                                this.filterData(response.log, response.log_pengajar, response.jadwal_ruangan, response.jadwal_matkultambahan)
                                this.setState({
                                    datakosong: false,
                                    data_jadwal: response.jadwal_ruangan,
                                    data_kelastambahan: response.jadwal_matkultambahan,
                                });
                            }
                            else if ((response.status === 1) && (response.log_pengajar.length === 0)) {
                                this.setState({
                                    datakosong: true,
                                    alamatruangan: 'Riwayat pengajar tidak ditemukan ',
                                });
                            }
                            else if (response.status === 2) {
                                this.setState({
                                    datakosong: true,
                                    alamatruangan: 'Kode Ruangan tidak ditemukan',
                                });
                            }
                            //ga dapet token
                            else if ((response.status !== 1) && (response.status !== 0) && (response.status !== 2)) {
                                sessionStorage.removeItem("name");
                                window.location.reload();
                            }
                        })
                        .catch(error => {
                            sessionStorage.removeItem("name");
                            window.location.reload();
                        });
                }
                else if ((response.status === 1) && (response.count === 0)) {
                    this.setState({
                        datakosong: true,
                        find_pressed: true,
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

    filterData(input_log, log_pengajar, jadwal_ruangan, jadwal_matkultambahan) {
        var log = input_log
        //filter data pengajar 
        var filter_log_pengajar = [];
        var data_max_jam_kelas = [];
        var data_min_jam_kelas = [];
        var max_jam_kelas
        var min_jam_kelas
        var kodematkul_log_pengajar
        var kelas_log_pengajar
        var date_log_pengajar
        var jadwal_detected = false
        var waktu_matkultambahan
        var hari_masuk //(0-6) minggu ke senin
        var jam_kelas //(jam6-jam22)

        var kodematkul_next, kelas_next, date_next
        var jam_next

        filter_log_pengajar.push(log_pengajar[0])
        kodematkul_log_pengajar = log_pengajar[0].kodematkul
        kelas_log_pengajar = log_pengajar[0].kelas
        date_log_pengajar = new Date(log_pengajar[0].waktu)
        //mengambil jam awal sama jam max
        for (var j = 0; j < jadwal_matkultambahan.length; j++) {//waktu, jam, durasi, kodematkul, kelas
            waktu_matkultambahan = new Date(jadwal_matkultambahan[j].waktu)
            if ((date_log_pengajar.getHours() >= waktu_matkultambahan.getHours()) && (date_log_pengajar.getHours() <= parseInt(jadwal_matkultambahan[j].jam) + parseInt(jadwal_matkultambahan[j].durasi)) && (date_log_pengajar.toDateString() === waktu_matkultambahan.toDateString()) && (kodematkul_log_pengajar === jadwal_matkultambahan[j].kodematkul) && (kelas_log_pengajar === jadwal_matkultambahan[j].kelas)) {
                jadwal_detected = true
                min_jam_kelas = parseInt(jadwal_matkultambahan[j].jam) - 1
                max_jam_kelas = parseInt(jadwal_matkultambahan[j].jam) + parseInt(jadwal_matkultambahan[j].durasi)
                break;
            }
        }
        if (jadwal_detected === false) {
            for (j = 0; j < jadwal_ruangan.length; j++) {//hari, jam, durasi, kodematkul, kelas
                if (parseInt(jadwal_ruangan[j].hari) === 7) {
                    hari_masuk = 0
                }
                else {
                    hari_masuk = parseInt(jadwal_ruangan[j].hari)
                }
                if ((date_log_pengajar.getHours() >= parseInt(jadwal_ruangan[j].jam) - 1) && (date_log_pengajar.getHours() <= parseInt(jadwal_ruangan[j].jam) + parseInt(jadwal_ruangan[j].durasi)) && (date_log_pengajar.getDay() === hari_masuk) && (kodematkul_log_pengajar === jadwal_ruangan[j].kodematkul) && (kelas_log_pengajar === jadwal_ruangan[j].kelas)) {
                    min_jam_kelas = parseInt(jadwal_ruangan[j].jam) - 1
                    max_jam_kelas = parseInt(jadwal_ruangan[j].jam) + parseInt(jadwal_ruangan[j].durasi)
                    break;
                }
            }
        }
        else {
            jadwal_detected = false
        }
        //data awal jam masuk
        data_max_jam_kelas.push(max_jam_kelas)
        data_min_jam_kelas.push(min_jam_kelas)

        for (var i = 1; i < log_pengajar.length; i++) {
            kodematkul_next = log_pengajar[i].kodematkul
            kelas_next = log_pengajar[i].kelas
            date_next = new Date(log_pengajar[i].waktu)
            jam_next = (new Date(log_pengajar[i].waktu)).getHours()

            if ((log_pengajar[i].keterangan === "Hadir") || (log_pengajar[i].keterangan === "Izin") || (log_pengajar[i].keterangan === "Sakit")) {
                if ((kodematkul_next === kodematkul_log_pengajar) && (kelas_next === kelas_log_pengajar) && (date_next.toDateString() === date_log_pengajar.toDateString()) && (jam_next >= min_jam_kelas) && (jam_next <= max_jam_kelas)) {
                }
                else {
                    kodematkul_log_pengajar = log_pengajar[i].kodematkul
                    kelas_log_pengajar = log_pengajar[i].kelas
                    date_log_pengajar = new Date(log_pengajar[i].waktu)

                    for (j = 0; j < jadwal_matkultambahan.length; j++) {//waktu, jam, durasi, kodematkul, kelas
                        waktu_matkultambahan = new Date(jadwal_matkultambahan[j].waktu)
                        if ((date_log_pengajar.getHours() >= waktu_matkultambahan.getHours()) && (date_log_pengajar.getHours() <= parseInt(jadwal_matkultambahan[j].jam) + parseInt(jadwal_matkultambahan[j].durasi)) && (date_log_pengajar.toDateString() === waktu_matkultambahan.toDateString()) && (kodematkul_log_pengajar === jadwal_matkultambahan[j].kodematkul) && (kelas_log_pengajar === jadwal_matkultambahan[j].kelas)) {
                            jadwal_detected = true
                            min_jam_kelas = parseInt(jadwal_matkultambahan[j].jam) - 1
                            max_jam_kelas = parseInt(jadwal_matkultambahan[j].jam) + parseInt(jadwal_matkultambahan[j].durasi)
                            break;
                        }
                    }
                    if (jadwal_detected === false) {
                        for (j = 0; j < jadwal_ruangan.length; j++) {//hari, jam, durasi, kodematkul, kelas
                            if (parseInt(jadwal_ruangan[j].hari) === 7) {
                                hari_masuk = 0
                            }
                            else {
                                hari_masuk = parseInt(jadwal_ruangan[j].hari)
                            }
                            if ((date_log_pengajar.getHours() >= parseInt(jadwal_ruangan[j].jam) - 1) && (date_log_pengajar.getHours() <= parseInt(jadwal_ruangan[j].jam) + parseInt(jadwal_ruangan[j].durasi)) && (date_log_pengajar.getDay() === hari_masuk) && (kodematkul_log_pengajar === jadwal_ruangan[j].kodematkul) && (kelas_log_pengajar === jadwal_ruangan[j].kelas)) {
                                min_jam_kelas = parseInt(jadwal_ruangan[j].jam) - 1
                                max_jam_kelas = parseInt(jadwal_ruangan[j].jam) + parseInt(jadwal_ruangan[j].durasi)
                                break;
                            }
                        }
                    }
                    else {
                        jadwal_detected = false
                    }

                    filter_log_pengajar.push(log_pengajar[i])
                    data_max_jam_kelas.push(max_jam_kelas)
                    data_min_jam_kelas.push(min_jam_kelas)
                }
            }
        }

        //all
        var out_data_all = [0, 0]
        var out_data_all_telat_waktu = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        var out_data_all_tidaktelat_waktu = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        //senin
        var out_data_senin = [0, 0]
        var out_data_senin_telat_waktu = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        var out_data_senin_tidaktelat_waktu = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        //selasa
        var out_data_selasa = [0, 0]
        var out_data_selasa_telat_waktu = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        var out_data_selasa_tidaktelat_waktu = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        //rabu
        var out_data_rabu = [0, 0]
        var out_data_rabu_telat_waktu = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        var out_data_rabu_tidaktelat_waktu = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        //kamis
        var out_data_kamis = [0, 0]
        var out_data_kamis_telat_waktu = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        var out_data_kamis_tidaktelat_waktu = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        //jumat
        var out_data_jumat = [0, 0]
        var out_data_jumat_telat_waktu = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        var out_data_jumat_tidaktelat_waktu = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        //sabtu
        var out_data_sabtu = [0, 0]
        var out_data_sabtu_telat_waktu = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        var out_data_sabtu_tidaktelat_waktu = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        //minggu
        var out_data_minggu = [0, 0]
        var out_data_minggu_telat_waktu = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        var out_data_minggu_tidaktelat_waktu = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        var waktu_log
        var waktu_statistik
        var counter_matkul = 0
        for (var k = 0; k < filter_log_pengajar.length; k++) { //waktu, kelas, kodematkul, keterangan //data_max_jam_kelas //data_min_jam_kelas
            date_log_pengajar = new Date(filter_log_pengajar[k].waktu)
            waktu_statistik = data_min_jam_kelas[k] - 5
            counter_matkul = 0
            for (i = 0; i < log.length; i++) { //waktu, kelas, kodematkul
                waktu_log = new Date(log[i].waktu)
                if ((waktu_log.getHours() >= data_min_jam_kelas[k]) && (waktu_log.getHours() <= data_max_jam_kelas[k]) && (waktu_log.toDateString() === date_log_pengajar.toDateString()) && (log[i].kodematkul === filter_log_pengajar[k].kodematkul) && (log[i].kelas === filter_log_pengajar[k].kelas)) {
                    counter_matkul = counter_matkul + 1
                    jam_kelas = new Date(new Date(waktu_log.toDateString()).setHours(data_min_jam_kelas[k] + 1))
                    hari_masuk = jam_kelas.getDay()
                    if (waktu_log.getTime() - jam_kelas.getTime() > 900000) { // 15 menit, telat
                        out_data_all[0] = out_data_all[0] + 1
                        out_data_all_telat_waktu[waktu_statistik] = out_data_all_telat_waktu[waktu_statistik] + 1
                        if (hari_masuk === 0) { //minggu
                            out_data_minggu[0] = out_data_minggu[0] + 1
                            out_data_minggu_telat_waktu[waktu_statistik] = out_data_minggu_telat_waktu[waktu_statistik] + 1
                        }
                        else if (hari_masuk === 1) { //senin
                            out_data_senin[0] = out_data_senin[0] + 1
                            out_data_senin_telat_waktu[waktu_statistik] = out_data_senin_telat_waktu[waktu_statistik] + 1
                        }
                        else if (hari_masuk === 2) { //selasa
                            out_data_selasa[0] = out_data_selasa[0] + 1
                            out_data_selasa_telat_waktu[waktu_statistik] = out_data_selasa_telat_waktu[waktu_statistik] + 1
                        }
                        else if (hari_masuk === 3) { //rabu
                            out_data_rabu[0] = out_data_rabu[0] + 1
                            out_data_rabu_telat_waktu[waktu_statistik] = out_data_rabu_telat_waktu[waktu_statistik] + 1
                        }
                        else if (hari_masuk === 4) { //kamis
                            out_data_kamis[0] = out_data_kamis[0] + 1
                            out_data_kamis_telat_waktu[waktu_statistik] = out_data_kamis_telat_waktu[waktu_statistik] + 1
                        }
                        else if (hari_masuk === 5) { //jumat
                            out_data_jumat[0] = out_data_jumat[0] + 1
                            out_data_jumat_telat_waktu[waktu_statistik] = out_data_jumat_telat_waktu[waktu_statistik] + 1
                        }
                        else if (hari_masuk === 6) { //sabtu
                            out_data_sabtu[0] = out_data_sabtu[0] + 1
                            out_data_sabtu_telat_waktu[waktu_statistik] = out_data_sabtu_telat_waktu[waktu_statistik] + 1
                        }
                    }
                    else { // ga telat
                        out_data_all[1] = out_data_all[1] + 1
                        out_data_all_tidaktelat_waktu[waktu_statistik] = out_data_all_tidaktelat_waktu[waktu_statistik] + 1
                        if (hari_masuk === 0) { //minggu
                            out_data_minggu[1] = out_data_minggu[1] + 1
                            out_data_minggu_tidaktelat_waktu[waktu_statistik] = out_data_minggu_tidaktelat_waktu[waktu_statistik] + 1
                        }
                        else if (hari_masuk === 1) { //senin
                            out_data_senin[1] = out_data_senin[1] + 1
                            out_data_senin_tidaktelat_waktu[waktu_statistik] = out_data_senin_tidaktelat_waktu[waktu_statistik] + 1
                        }
                        else if (hari_masuk === 2) { //selasa
                            out_data_selasa[1] = out_data_selasa[1] + 1
                            out_data_selasa_tidaktelat_waktu[waktu_statistik] = out_data_selasa_tidaktelat_waktu[waktu_statistik] + 1
                        }
                        else if (hari_masuk === 3) { //rabu
                            out_data_rabu[1] = out_data_rabu[1] + 1
                            out_data_rabu_tidaktelat_waktu[waktu_statistik] = out_data_rabu_tidaktelat_waktu[waktu_statistik] + 1
                        }
                        else if (hari_masuk === 4) { //kamis
                            out_data_kamis[1] = out_data_kamis[1] + 1
                            out_data_kamis_tidaktelat_waktu[waktu_statistik] = out_data_kamis_tidaktelat_waktu[waktu_statistik] + 1
                        }
                        else if (hari_masuk === 5) { //jumat
                            out_data_jumat[1] = out_data_jumat[1] + 1
                            out_data_jumat_tidaktelat_waktu[waktu_statistik] = out_data_jumat_tidaktelat_waktu[waktu_statistik] + 1
                        }
                        else if (hari_masuk === 6) { //sabtu
                            out_data_sabtu[1] = out_data_sabtu[1] + 1
                            out_data_sabtu_tidaktelat_waktu[waktu_statistik] = out_data_sabtu_tidaktelat_waktu[waktu_statistik] + 1
                        }
                    }
                }
                else if ((((Math.abs(waktu_log.getTime() - date_log_pengajar.getTime())) / 60000 > 60)) && (counter_matkul === 0)) {

                }
                else {
                    log.splice(0, counter_matkul - 1)
                    break;
                }
            }
        }

        this.setState({
            //all
            data_all: out_data_all,
            data_all_telat_waktu: out_data_all_telat_waktu,
            data_all_tidaktelat_waktu: out_data_all_tidaktelat_waktu,
            //senin
            data_senin: out_data_senin,
            data_senin_telat_waktu: out_data_senin_telat_waktu,
            data_senin_tidaktelat_waktu: out_data_senin_tidaktelat_waktu,
            //selasa
            data_selasa: out_data_selasa,
            data_selasa_telat_waktu: out_data_selasa_telat_waktu,
            data_selasa_tidaktelat_waktu: out_data_selasa_tidaktelat_waktu,
            //rabu
            data_rabu: out_data_rabu,
            data_rabu_telat_waktu: out_data_rabu_telat_waktu,
            data_rabu_tidaktelat_waktu: out_data_rabu_tidaktelat_waktu,
            //kamis
            data_kamis: out_data_kamis,
            data_kamis_telat_waktu: out_data_kamis_telat_waktu,
            data_kamis_tidaktelat_waktu: out_data_kamis_tidaktelat_waktu,
            //jumat
            data_jumat: out_data_jumat,
            data_jumat_telat_waktu: out_data_jumat_telat_waktu,
            data_jumat_tidaktelat_waktu: out_data_jumat_tidaktelat_waktu,
            //sabtu
            data_sabtu: out_data_sabtu,
            data_sabtu_telat_waktu: out_data_sabtu_telat_waktu,
            data_sabtu_tidaktelat_waktu: out_data_sabtu_tidaktelat_waktu,
            //minggu
            data_minggu: out_data_minggu,
            data_minggu_telat_waktu: out_data_minggu_telat_waktu,
            data_minggu_tidaktelat_waktu: out_data_minggu_tidaktelat_waktu,
        })
    }

    statistikPiePerHari(hari) {
        const { data_senin, data_selasa, data_rabu, data_kamis, data_jumat, data_sabtu, data_minggu } = this.state
        var data_pie = []
        if (hari === 'Senin') {
            data_pie = data_senin
        }
        else if (hari === 'Selasa') {
            data_pie = data_selasa
        }
        else if (hari === 'Rabu') {
            data_pie = data_rabu
        }
        else if (hari === 'Kamis') {
            data_pie = data_kamis
        }
        else if (hari === 'Jumat') {
            data_pie = data_jumat
        }
        else if (hari === 'Sabtu') {
            data_pie = data_sabtu
        }
        else if (hari === 'Minggu') {
            data_pie = data_minggu
        }
        var labelPieHari = ["Telat", "Tidak Telat"];
        const datapie = {
            labels: labelPieHari,
            datasets: [
                {
                    data: data_pie,
                    backgroundColor: [
                        'rgba(255,0,0,0.7)',
                        'rgba(0,255,0,0.7)',
                    ],
                    borderColor: [
                        'rgba(255,0,0,1)',
                        'rgba(0,255,0,1)',
                    ],
                    hoverBackgroundColor: [
                        'rgba(255,0,0,1)',
                        'rgba(0,255,0,1)',
                    ],
                    hoverBorderColor: [
                        'rgba(255,0,0,1)',
                        'rgba(0,255,0,1)',
                    ],
                },
            ],
        };
        const optionpie = {
            maintainAspectRatio: false,
            responsive: false,
            legend: {
                display: false
            },
            title: {
                fontsize: 30,
                display: true,
                text: hari
            }
        }
        return (
            <div>
                <div>
                    <Pie
                        data={datapie}
                        width={160}
                        height={120}
                        options={optionpie}
                    />
                </div>
                <div style={{ marginLeft: '46px' }}>
                    <a href={"#" + hari} style={{ textAlign: 'center', fontSize: '13px' }}> <u>Show Detail</u> </a>
                </div>
            </div>
        )
    }

    dataPerHari(hari) {
        const state = this.state
        var data_telat = []
        var data_tidaktelat = []
        if (hari === 'Senin') {
            data_telat = state.data_senin_telat_waktu
            data_tidaktelat = state.data_senin_tidaktelat_waktu
        }
        else if (hari === 'Selasa') {
            data_telat = state.data_selasa_telat_waktu
            data_tidaktelat = state.data_selasa_tidaktelat_waktu
        }
        else if (hari === 'Rabu') {
            data_telat = state.data_rabu_telat_waktu
            data_tidaktelat = state.data_rabu_tidaktelat_waktu
        }
        else if (hari === 'Kamis') {
            data_telat = state.data_kamis_telat_waktu
            data_tidaktelat = state.data_kamis_tidaktelat_waktu
        }
        else if (hari === 'Jumat') {
            data_telat = state.data_jumat_telat_waktu
            data_tidaktelat = state.data_jumat_tidaktelat_waktu
        }
        else if (hari === 'Sabtu') {
            data_telat = state.data_sabtu_telat_waktu
            data_tidaktelat = state.data_sabtu_tidaktelat_waktu
        }
        else if (hari === 'Minggu') {
            data_telat = state.data_minggu_telat_waktu
            data_tidaktelat = state.data_minggu_tidaktelat_waktu
        }
        var labelPerHari = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];
        const optionBarPerHari = {
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
        const dataBarPerHari = {
            labels: labelPerHari,
            datasets: [
                {
                    label: 'Tidak Terlambat',
                    backgroundColor: 'rgba(0,255,0,0.7)',
                    borderColor: 'rgba(0,255,0,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(0,255,0,1)',
                    hoverBorderColor: 'rgba(0,255,0,1)',
                    data: data_tidaktelat
                },
                {
                    label: 'Terlambat',
                    backgroundColor: 'rgba(255,0,0,0.7)',
                    borderColor: 'rgba(255,0,0,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,0,0,1)',
                    hoverBorderColor: 'rgba(255,0,0,1)',
                    data: data_telat
                },
            ]
        };
        return (
            <div>
                <div className="texttengah">
                    <Bar
                        data={dataBarPerHari}
                        width={1000}
                        height={200}
                        options={optionBarPerHari}
                    />
                </div>
            </div>
        )
    }

    render() {
        const state = this.state
        //grafik awal
        var arrLabel = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];
        const optionBarAll = {
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
        const dataBarAll = {
            labels: arrLabel,
            datasets: [
                {
                    label: 'Tidak Terlambat',
                    backgroundColor: 'rgba(0,255,0,0.7)',
                    borderColor: 'rgba(0,255,0,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(0,255,0,1)',
                    hoverBorderColor: 'rgba(0,255,0,1)',
                    data: state.data_all_tidaktelat_waktu
                },
                {
                    label: 'Terlambat',
                    backgroundColor: 'rgba(255,0,0,0.7)',
                    borderColor: 'rgba(255,0,0,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,0,0,1)',
                    hoverBorderColor: 'rgba(255,0,0,1)',
                    data: state.data_all_telat_waktu
                },
            ]
        };
        var labelPieAll = ["Telat", "Tidak Telat"];
        const dataPieAll = {
            labels: labelPieAll,
            datasets: [
                {
                    data: state.data_all,
                    backgroundColor: [
                        'rgba(255,0,0,0.7)',
                        'rgba(0,255,0,0.7)',
                    ],
                    borderColor: [
                        'rgba(255,0,0,1)',
                        'rgba(0,255,0,1)',
                    ],
                    hoverBackgroundColor: [
                        'rgba(255,0,0,1)',
                        'rgba(0,255,0,1)',
                    ],
                    hoverBorderColor: [
                        'rgba(255,0,0,1)',
                        'rgba(0,255,0,1)',
                    ],
                },
            ],
        };
        const optionPieAll = {
            maintainAspectRatio: false,
            responsive: false,
            legend: {
                display: false
            },
            title: {
                fontsize: 30,
                display: true,
                text: "Data Keterlambatan"
            }
        }
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
        var inc = 0;
        return (
            <div>
                <div className="kotakfilter3">
                    <form className="kotakforminputlogpintu" onSubmit={this.handleSubmitDaftar}>
                        <div className="filterdatastatistik">
                            <label><b>Kode Ruangan</b> </label> <br></br>
                            <input name="koderuangan_form" onChange={this.handleChange} className="inputfiltertanggalawallog" type="text" required ></input>
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
                <div className="paddingtop30px"></div>
                <div id="inputform">
                    <div className="kotakdata">
                        <div>
                            <span><b>Kode Ruangan &ensp;&ensp;&emsp;: {state.koderuangan}</b></span>
                            <br></br>
                            <span><b>Alamat &ensp; &ensp; &emsp; &ensp; &ensp; &ensp;&ensp;: {state.alamatruangan}</b></span>
                            <br></br>
                            <span><b>Periode &emsp; &emsp; &emsp;&emsp;&ensp;: {PeriodeStatistik(state.startDate, state.endDate) || '-'}</b></span>
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
                            <div>
                                <div style={{ overflowX: 'scroll' }}>
                                    <div className="texttengah" style={{ width: '1000px' }}>
                                        <Bar
                                            data={dataBarAll}
                                            width={800}
                                            height={200}
                                            options={optionBarAll}
                                        />
                                        <Pie
                                            data={dataPieAll}
                                            width={200}
                                            height={200}
                                            options={optionPieAll}
                                        />
                                    </div>
                                </div>
                                <div className="paddingtop30px2"></div>
                                <div style={{ overflowX: 'scroll' }}>
                                    <div className="texttengah" style={{ width: '1120px' }}>
                                        {
                                            state.hari.map(isidata => (
                                                <div key={inc++}>
                                                    {this.statistikPiePerHari(isidata)}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div >
                {
                    state.datakosong === false &&
                    state.hari.map(isidata => (
                        <div key={inc++} className="kotakdata" id={isidata}>
                            <div style={{ overflowX: 'scroll' }}>
                                <div style={{ width: '1000px' }}>
                                    <div style={{ textAlign: "center", display: "block" }}>
                                        <a href="#inputform"><u>Back to top</u></a>
                                        <h5>{isidata}</h5>
                                    </div>
                                    <div>
                                        {this.dataPerHari(isidata)}
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))
                }
            </div >
        )
    }
}

export default withRouter(StatistikRuangan);