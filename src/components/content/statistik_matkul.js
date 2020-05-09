import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Pie } from 'react-chartjs-2';
import get from './config';


//var data_pengajar_kelas= []
// var data_mahasiswa_kelas = []
var data_all = []

class StatistikMatkul extends Component {
    // spek : 
    // dapat melihat statistik kehadiran kode matkul tersebut secara keseluruhan
    // dapat melihat statistik kehadiran pada semua kelas pada matkul tersebut
    // menampilkan nama matkul, jumlah mahasiswa
    // setelah coba di css, di coba buat ukuran windownya diperkecil, buat biar halaman webnya responsive
    constructor(props) {
        super(props);
        this.state = {
            kodematkul: '',
            startDate: '',
            endDate: '',
            namamatkul: '-',
            data_matkul: [],
            //data_pengajar: [],
            data_mahasiswa: [],
            pertemuan: [],
            datakosong: true,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
                    if ((response.status === 1) && (response.log_pengajar.length !== 0)) {
                        this.getDataKelas(response.log_mahasiswa, response.log_pengajar, datamatkul[i].count)
                        this.setState({
                            datakosong: false,
                            data_mahasiswa: response.log_mahasiswa,
                        })
                    }
                    else if ((response.status === 1) && (response.log_pengajar.length === 0)) {
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
        }
    }

    getDataKelas(mahasiswa, pengajar, total) {
        var data_mahasiswa_1d = []
        var count_alfa = 0
        var count_hadir = 0
        var count_izin = 0
        var count_sakit = 0
        var pertemuan = 0
        var kelas = ''
        for (var i = 0; i < mahasiswa.length; i++) {
            kelas = mahasiswa[i].kelas
            if (mahasiswa[i].keterangan === "Hadir") {
                count_hadir++;
            }
            else if (mahasiswa[i].keterangan === "Izin") {
                count_izin++;
            }
            else if (mahasiswa[i].keterangan === "Sakit") {
                count_sakit++;
            }
        }
        pertemuan = pengajar.length
        count_alfa = pertemuan * total - (count_hadir + count_izin + count_sakit)

        data_mahasiswa_1d.push(kelas)
        data_mahasiswa_1d.push(count_hadir)
        data_mahasiswa_1d.push(count_izin)
        data_mahasiswa_1d.push(count_sakit)
        data_mahasiswa_1d.push(count_alfa)
        data_mahasiswa_1d.push(pertemuan)
        data_all.push(data_mahasiswa_1d)
    }


    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }


    handleSubmit(e) {
        e.preventDefault();
        const { kodematkul } = this.state
        // console.log(kodematkul)
        // console.log(startDate)
        // console.log(endDate)
        // http request buat get data
        // buat backend sendiri
        // buat backend untuk semua kondisi (kodematkul ada atau engga, startdate ada atau engga, enddate ada atau engga)

        fetch(get.readstatistikmatkul + "/" + kodematkul, {
            method: 'post',
            headers: {
                "x-access-token": sessionStorage.name,
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(response => {
                if ((response.status === 1) && (response.hasil.length !== 0)) {
                    this.getLog(response.hasil)
                    this.setState({
                        datakosong: false,
                        data_matkul: response.hasil,
                        namamatkul: response.hasil[0].namamatkul,
                    })
                    // for (var i=0; i<this.data_matkul.length; i++){
                    //     this.getLog(this.data_matkul, this.data_matkul[i].kelas)
                    //     this.data_pengajar_kelas.push(this.data_pengajar)
                    //     this.data_mahasiswa_kelas.push(this.data_mahasiswa)
                    // }

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



        // data_mahasiswa_kelas = []
        data_all = []
        // terus ini gue nyoba pake state. awalnya tadi itu array global. tapi ga ngerti juga declarenya kalo array 2d gimana
        // this.setState({
        //     hadir: data_hadir,
        //     sakit: data_sakit,
        //     izin: data_izin,
        //     alfa: data_alfa,
        //     pertemuan: data_pertemuan
        // })

    }



    outgraph(d) {
        const { datakosong, kodematkul, namamatkul } = this.state
        if (datakosong) {
            return (
                <div>
                </div>
            )
        }
        else {
            var count_alfa = 0
            var count_hadir = 0
            var count_izin = 0
            var count_sakit = 0
            var hadir_pie = [0, 0, 0, 0]
            const ket = ['Hadir', 'Sakit', 'Izin', 'Alfa']

            for (var i = 0; i < d[0].length; i++) {
                count_hadir += d[0][i]
                count_sakit += d[1][i]
                count_izin += d[2][i]
                count_hadir += d[3][i]
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
                            'red',
                            'blue',
                            'yellow',
                            'green'
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
                    display: true,
                    text: 'Kehadiran pada Mata Kuliah ' + kodematkul + ' - ' + namamatkul
                }
            }
            return (
                <div style={{ padding: "20px" }}>
                    <Pie
                        data={data}
                        width={200}
                        options={options}
                    />
                </div>

            )
        }

    }





    render() {

        var inc = 0;
        const { datakosong } = this.state
        //var widthgraph = 240 + 'px';
        // for (var i =0; i<data_matkul.length; i++){
        //     this.getDataKelas()
        // }

        console.log(data_all)
        return (
            <div>
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
                        <div className="kotaksubmitstatistik">
                            <input className="submitformstatistik" type="submit" value="Filter"></input>
                        </div>
                    </form>
                </div>
                <div className="paddingtop30px2"></div>
                {/* <div className="scrollx">
                    <div className="texttengah" style={{ width: widthgraph }}>
                        {this.outgraph(data_all)}        
                    </div>
                </div> */}

                <div className="kotakdata" >
                    <div className="texttengah">
                        <div className="isitabel" style={{ minWidth: "600px" }}>
                            <table className="tablefakultas">
                                <thead className="theadlog">
                                    <tr>
                                        <th className="kelas" >Kelas</th>
                                        <th className="kelas">Hadir</th>
                                        <th className="kelas">Sakit</th>
                                        <th className="kelas" >Izin</th>
                                        <th className="kelas" >Alfa</th>
                                        <th className="kelas" >Jumlah Pertemuan</th>
                                    </tr>
                                </thead>
                                {(datakosong === false) &&
                                    <tbody className="tbodylog">
                                        {data_all.map(isidata => (
                                            <tr key={inc++}>
                                                <td>{isidata[0]}</td>
                                                <td>{isidata[1]}</td>
                                                <td>{isidata[2]}</td>
                                                <td>{isidata[3]}</td>
                                                <td>{isidata[4]}</td>
                                                <td>{isidata[5]}</td>
                                            </tr>
                                        ))}
                                    </tbody>}
                                {(datakosong === true) &&
                                    <tbody className="tbodylog">
                                        <tr>
                                            <td colSpan="8">Data tidak ditemukan</td>
                                        </tr>
                                    </tbody>}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(StatistikMatkul);