import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import get from './config';

class Filter_Matkul_Ruangan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //read
            kodematkul: '',
            nullkodematkul: true,
            kelas: '',
            data: [],
            dataasisten: [],
            datamahasiswa: [],
            datakosong: true,
            daftar: false,
            jam_masuk: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],

            //create
            haric: '',
            jamc: '',
            durasic: '',
            koderuanganc: '',
            namamatkulc: '',
            alamatc: '',

            //status add
            pesan: '',
            datasalah: false,
            databenar: false,
        };
        this.getAlamatFilter = this.getAlamatFilter.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitDaftar = this.handleSubmitDaftar.bind(this);
        this.handleSubmitFirst = this.handleSubmitFirst.bind(this);
    }

    getData(kodematkul, kelas) {
        fetch(get.readruanganmatkul, {
            method: 'post',
            headers: {
                "Authorization": sessionStorage.name,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                kodematkul: kodematkul,
                kelas: kelas
            })
        })
            .then(response => response.json())
            .then(response => {
                //berhasil dapet data
                if (response.status === 1) {
                    //mahasiswa
                    if (response.count === 0) {
                        this.setState({
                            datakosong: false,
                            data: []
                        })
                    }
                    else {
                        this.setState({
                            datakosong: false,
                            data: response.hasil
                        })
                    }
                }
                else if (response.status === 2) {
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

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmitDaftar(e) {
        e.preventDefault();
        const { haric, jamc, durasic, koderuanganc, kodematkul, kelas } = this.state;

        fetch(get.createfilterruangan, {
            method: 'post',
            headers: {
                "x-access-token": sessionStorage.name,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                hari: haric,
                jam: jamc,
                durasi: durasic,
                koderuangan: koderuanganc,
                kodematkul: kodematkul,
                kelas: kelas,
                filter: 'kodematkul'
            })
        })
            .then(response => response.json())
            .then(response => {
                //berhasil add data
                if (response.status === 1) {
                    this.setState({ databenar: true })
                    this.setState({ datasalah: false })
                    this.setState({ pesan: response.pesan })
                    setTimeout(this.getData(kodematkul, kelas), 1000)
                }
                //tidak berhasil add data
                else if (response.status === 0) {
                    this.setState({ databenar: false })
                    this.setState({ datasalah: true })
                    this.setState({ pesan: response.pesan })
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

    handleSubmitFirst(e) {
        e.preventDefault();
        const { kodematkul, kelas } = this.state;
        this.getData(kodematkul, kelas)
        this.setState({ nullkodematkul: false })
        this.getNameMatkulFilter()
    }

    getNameMatkulFilter() {
        const { kodematkul } = this.state
        fetch(get.readmatkul, {
            method: 'post',
            headers: {
                "x-access-token": sessionStorage.name,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sortby: "kodematkul",
                ascdsc: "asc",
                search: kodematkul,
                limit: "1",
                page: "1",
            })
        })
            .then(response => response.json())
            .then(response => {
                //berhasil dapet data
                if ((response.status === 1) && (response.count >= 1)) {
                    this.setState({ namamatkulc: response.hasil[0].namamatkul })
                }
                else if ((response.status === 1) && (response.count !== 1)) {
                    this.setState({ namamatkulc: '' })
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

    deleteData(a, b, c, d, e) {

        var yes = window.confirm("Apakah anda yakin ingin menghapus Kode Mata Kuliah: " + d + " Kelas: " + e + " pada Ruangan: " + c + " pada Hari: " + this.getHari(a) + " Jam: " + this.getJam(b) + "?");
        if (yes === true) {
            fetch(get.deletefilterruangan, {
                method: 'post',
                headers: {
                    "Authorization": sessionStorage.name,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    hari: a,
                    jam: b,
                    koderuangan: c,
                    kodematkul: d,
                    kelas: e,
                })
            })
                .then(response => response.json())
                .then(response => {
                    setTimeout(this.getData(d, e), 1000)
                })
                .catch(error => {
                    sessionStorage.removeItem("name")
                    window.location.reload()
                })
        }
    }

    getDataMatkulHari(a, b, hari) {
        const { kodematkul, kelas } = this.state
        var out
        if (b.length > 0) {
            for (var k = 0; k < b.length; k++) {
                if (b[k].hari === hari) {
                    if ((b[k].jam + b[k].durasi - 1 >= a) && (a >= b[k].jam)) {
                        out = (<div>
                            <span style={{ fontWeight: '1000' }}>{b[k].koderuangan}</span>
                            <br></br>
                            <span>{b[k].alamat}</span>
                            <br></br>
                            <button className="backgroundmerah" onClick={() => { this.deleteData(hari, b[k].jam, b[k].koderuangan, kodematkul, kelas) }}>
                                Hapus
                            </button>
                        </div>)
                        break
                    }
                    else {
                        out = (<div>
                            <button className="backgroundbiru" onClick={() => this.showDaftar(hari, a)} >
                                Tambah
                            </button>
                        </div>)
                    }
                }
                else {
                    out = (<div>
                        <button className="backgroundbiru" onClick={() => this.showDaftar(hari, a)} >
                            Tambah
                        </button>
                    </div>)
                }
            }
        }
        else {
            out = (<div>
                <button className="backgroundbiru" onClick={() => this.showDaftar(hari, a)} >
                    Tambah
            </button>
            </div>)
        }
        return out
    }

    getAlamatFilter(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
        var lengthnama;

        lengthnama = value.length;
        if (lengthnama >= 4) {
            fetch(get.readruangan, {
                method: 'post',
                headers: {
                    "x-access-token": sessionStorage.name,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sortby: "koderuangan",
                    ascdsc: "asc",
                    search: value,
                    limit: "1",
                    page: "1",
                })
            })
                .then(response => response.json())
                .then(response => {
                    console.log(response)
                    //berhasil dapet data
                    if ((response.status === 1) && (response.count == 1)) {
                        this.setState({ alamatc: response.hasil[0].alamat })
                    }
                    else if ((response.status === 1) && (response.count != 1)) {
                        this.setState({ alamatc: '' })
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
            this.setState({ alamatc: '' })
        }
    }

    getHari(a) {
        if (a === 1) {
            var hari = "Senin"
        }
        else if (a === 2) {
            hari = "Selasa"
        }
        else if (a === 3) {
            hari = "Rabu"
        }
        else if (a === 4) {
            hari = "Kamis"
        }
        else if (a === 5) {
            hari = "Jumat"
        }
        else if (a === 6) {
            hari = "Sabtu"
        }
        else if (a === 7) {
            hari = "Minggu"
        }
        return hari
    }

    getJam(a) {
        if (a > 9) {
            var jam = (a + ":00")
        }
        else {
            jam = ("0" + a + ":00")
        }
        return jam
    }


    Back() {
        this.setState({
            nullkodematkul: true,
        })
    }

    showDaftar(a, b) {
        this.setState({
            daftar: true,
            haric: a,
            jamc: b
        })
    }

    hideDaftar() {
        this.setState({
            daftar: false,
            datasalah: false,
            databenar: false,
            alamatc: ''
        })
    }

    render() {
        const state = this.state
        var aksidata

        if (state.daftar === true) {
            aksidata = "show"
        }
        else {
            aksidata = "hide"
        }
        var i = 1;


        function jam(a, b) {
            if (a > 9) {
                return (a + ":00 - " + b + ":00")
            }
            else {
                return ("0" + a + ":00 - 0" + b + ":00")
            }
        }


        if (state.nullkodematkul) {
            return (
                <div className="kotakpenggunamatakuliah">
                    <form onSubmit={this.handleSubmitFirst}>
                        <span className="texttebal">Kode Matakuliah</span>
                        <input name="kodematkul" onChange={this.handleChange} type="text" className="inputpenggunamatkul" placeholder="Kode Matkul" required />
                        <span className="texttebal">Kelas</span>
                        <input name="kelas" onChange={this.handleChange} type="text" className="inputpenggunamatkul" placeholder="Kelas Matkul" required />
                        <input className="buttonpenggunamatkul" type="submit" value="Cari" />
                    </form>
                </div>
            )
        }
        else {
            return (
                <div>
                    {state.daftar &&
                        <div>
                            <div className="kotakfilter2">
                                <form className="kotakforminputlogpintu" onSubmit={this.handleSubmitDaftar}>
                                    {
                                        state.databenar &&
                                        <span className="texthijau">{state.pesan}</span>
                                    }
                                    {
                                        state.datasalah &&
                                        <span className="textmerah">{state.pesan}</span>
                                    }

                                    <div className="kotakdaftarmatkulruanganhari">
                                        <label><b>Hari</b> </label> <br></br>
                                        <input onChange={this.handleChange} className="inputformlogpintujurusan" type="text" value={this.getHari(state.haric)} required ></input>
                                    </div>

                                    <div className="kotakdaftarmatkulruanganjam">
                                        <label><b>Jam</b> </label> <br></br>
                                        <input onChange={this.handleChange} className="inputformlogpintujurusan" type="text" value={this.getJam(state.jamc)} required ></input>
                                    </div>

                                    <div className="kotakdaftarmatkulruangandurasi">
                                        <label><b>Durasi</b> </label> <br></br>
                                        <select name="durasic" onChange={this.handleChange} className="inputformlogpintujurusan" required>
                                            <option> </option>
                                            <option key={i++} value={1}>1 Jam</option>
                                            <option key={i++} value={2}>2 Jam</option>
                                            <option key={i++} value={3}>3 Jam</option>
                                            <option key={i++} value={4}>4 Jam</option>
                                            <option key={i++} value={5}>5 Jam</option>
                                            <option key={i++} value={6}>6 Jam</option>
                                            <option key={i++} value={7}>7 Jam</option>
                                            <option key={i++} value={8}>8 Jam</option>
                                            <option key={i++} value={9}>9 Jam</option>
                                            <option key={i++} value={10}>10 Jam</option>
                                            <option key={i++} value={11}>11 Jam</option>
                                            <option key={i++} value={12}>12 Jam</option>
                                        </select>
                                    </div>

                                    <div className="kotakdaftarmatkulruangankoderuangan">
                                        <label><b>Kode Ruangan</b> </label> <br></br>
                                        <input name="koderuanganc" onChange={this.getAlamatFilter} className="inputformlogpintujurusan" type="text" placeholder="Kode Ruangan..." required ></input>
                                    </div>

                                    <div className="kotakdaftarmatkulruanganalamat">
                                        <label><b>Alamat</b> </label> <br></br>
                                        <input value={state.alamatc} onChange={this.handleChange} className="inputformlogpintujurusan" type="text" placeholder="Alamat..." required ></input>
                                    </div>

                                    <div className="kotaksubmitpenggunadaftar">
                                        <input className="submitformlogpintu" type="submit" value="Add"></input>
                                    </div>

                                    <div className="kotakcancelpenggunadaftar">
                                        <a onClick={() => this.hideDaftar()}> <span className="cancelformpengguna">Cancel</span></a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    }

                    {(state.daftar === false) &&
                        <div className="kotakbackmatkul">
                            <a onClick={() => this.Back()}>
                                <div className="backmatkul">
                                    <i className="fa fa-arrow-left"></i>
                                    <span><b>&nbsp;&nbsp;Kembali</b></span>
                                </div>
                            </a>
                        </div>
                    }
                    <div style={{ marginTop: '20px' }} />
                    <div id={aksidata} className="kotakdata">
                        <div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td><b>Kode</b></td>
                                        <td><b>&nbsp;&nbsp;&nbsp;&nbsp;: {state.kodematkul}</b></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>Nama</b></td>
                                        <td><b>&nbsp;&nbsp;&nbsp;&nbsp;: {state.namamatkulc}</b></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>Kelas</b></td>
                                        <td><b>&nbsp;&nbsp;&nbsp;&nbsp;: {state.kelas}</b></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <br></br>
                        <div className="isitabel">
                            <table className="tableruangan">
                                <thead className="theadlog">
                                    <tr>
                                        <th className="keteranganhari">Jam\Hari</th>
                                        <th className="keteranganhari">Senin</th>
                                        <th className="keteranganhari">Selasa</th>
                                        <th className="keteranganhari">Rabu</th>
                                        <th className="keteranganhari">Kamis</th>
                                        <th className="keteranganhari">Jumat</th>
                                        <th className="keteranganhari">Sabtu</th>
                                        <th className="keteranganhari">Minggu</th>
                                    </tr>
                                </thead>
                                <tbody className="tbodylog">
                                    {state.datakosong === false &&
                                        state.jam_masuk.map(isidata => (
                                            <tr key={i++} className="tabletinggi">
                                                <td className="tablewarnamerah">{jam(isidata, isidata + 1)}</td>
                                                <td>{this.getDataMatkulHari(isidata, state.data, 1)}</td>
                                                <td>{this.getDataMatkulHari(isidata, state.data, 2)}</td>
                                                <td>{this.getDataMatkulHari(isidata, state.data, 3)}</td>
                                                <td>{this.getDataMatkulHari(isidata, state.data, 4)}</td>
                                                <td>{this.getDataMatkulHari(isidata, state.data, 5)}</td>
                                                <td>{this.getDataMatkulHari(isidata, state.data, 6)}</td>
                                                <td>{this.getDataMatkulHari(isidata, state.data, 7)}</td>
                                            </tr>
                                        ))}
                                    {state.datafilterkosong === true &&
                                        <tr key={i++} className="tabletinggi">
                                            <td colSpan="8">Ruangan tidak ditemukan</td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default withRouter(Filter_Matkul_Ruangan);