import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import get from './config';

class Filter_Matkul_Pengguna extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //read
            sortby: 'a.fakultas',
            ascdsc: 'asc',
            search: '',
            limit: 10,
            page: 1,
            rowCount: 0,
            kodematkul: '',
            nullkodematkul: true,
            kelas: '',
            datadosen: [],
            dataasisten: [],
            datamahasiswa: [],
            datakosongpengajar: true,
            datakosongmahasiswa: true,
            daftar: false,

            //create
            statusc: '',
            nimnipc: '',
            namac: '',
            namamatkulc: '',

            //status add
            pesan: '',
            datasalah: false,
            databenar: false,
        };
        this.handleFilter = this.handleFilter.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getNameFilter = this.getNameFilter.bind(this);
        this.handleSubmitDaftar = this.handleSubmitDaftar.bind(this);
        this.handleSubmitFirst = this.handleSubmitFirst.bind(this);
    }

    getData(sortby, ascdsc, search, limit, page, kodematkul, kelas) {
        fetch(get.readpenggunamatkul, {
            method: 'post',
            headers: {
                "x-access-token": sessionStorage.name,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sortby: sortby,
                ascdsc: ascdsc,
                search: search,
                limit: limit,
                page: page,
                kodematkul: kodematkul,
                kelas: kelas
            })
        })
            .then(response => response.json())
            .then(response => {
                //berhasil dapet data
                if (response.status === 1) {
                    //mahasiswa
                    if (response.count_mahasiswa === 0) {
                        this.setState({
                            datakosongmahasiswa: true,
                            rowCount: response.count_mahasiswa
                        })
                    }
                    else {
                        this.setState({
                            datakosongmahasiswa: false,
                            rowCount: response.count_mahasiswa,
                            datamahasiswa: response.hasil_mahasiswa
                        })
                    }
                    //pengajar
                    if (response.count_pengajar === 0) {
                        this.setState({
                            datakosongpengajar: true,
                        })
                    }
                    else {
                        this.setState({
                            datakosongpengajar: false,
                            datadosen: response.hasil_dosen,
                            dataasisten: response.hasil_asisten
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

    handleFilter(e) {
        const { sortby, ascdsc, search, limit, page, kodematkul, kelas } = this.state
        const { name, value } = e.target;
        this.setState({ [name]: value });
        if (name === "search") {
            var searching = value
            var max = limit
        }
        else if (name === "limit") {
            searching = search
            max = value
        }
        this.getData(sortby, ascdsc, searching, max, page, kodematkul, kelas)
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    filter(pagenow, sortbynow, ascdscnow) {
        const { sortby, search, limit, page, kodematkul, kelas } = this.state
        if (pagenow === page) {
            if (sortbynow === sortby) {
                if (ascdscnow === "asc") {
                    ascdscnow = "desc"
                }
                else if (ascdscnow === "desc") {
                    ascdscnow = "asc"
                }
            }
            else {
                ascdscnow = "asc"
            }
        }
        this.setState({ page: pagenow })
        this.setState({ sortby: sortbynow })
        this.setState({ ascdsc: ascdscnow })
        this.getData(sortbynow, ascdscnow, search, limit, pagenow, kodematkul, kelas)
    }

    handleSubmitFirst(e) {
        e.preventDefault();
        const { sortby, ascdsc, search, limit, page, kodematkul, kelas } = this.state;
        this.getData(sortby, ascdsc, search, limit, page, kodematkul, kelas)
        this.setState({ nullkodematkul: false })
        this.getNameMatkulFilter()
    }

    handleSubmitDaftar(e) {
        e.preventDefault();
        const { statusc, nimnipc, namac } = this.state;
        const { sortby, ascdsc, search, limit, page, kodematkul, kelas } = this.state;

        if ((statusc === 'Dosen') || (statusc === 'Asisten')) {
            fetch(get.createfilterdosen, {
                method: 'post',
                headers: {
                    "x-access-token": sessionStorage.name,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nip: nimnipc,
                    nama: namac,
                    kodematkul: kodematkul,
                    kelas: kelas
                })
            })
                .then(response => response.json())
                .then(response => {
                    //berhasil add data
                    if (response.status === 1) {
                        this.setState({ databenar: true })
                        this.setState({ datasalah: false })
                        this.setState({ pesan: response.pesan })
                        setTimeout(this.getData(sortby, ascdsc, search, limit, page, kodematkul, kelas), 1000)
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

        else {
            fetch(get.createfilterpengguna, {
                method: 'post',
                headers: {
                    "x-access-token": sessionStorage.name,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nim: nimnipc,
                    nama: namac,
                    kodematkul: kodematkul,
                    kelas: kelas
                })
            })
                .then(response => response.json())
                .then(response => {
                    //berhasil add data
                    if (response.status === 1) {
                        this.setState({ databenar: true })
                        this.setState({ datasalah: false })
                        this.setState({ pesan: response.pesan })
                        setTimeout(this.getData(sortby, ascdsc, search, limit, page, kodematkul, kelas), 1000)
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
    }

    deletePengguna(a, b, c) {
        const { sortby, ascdsc, search, limit, page, kodematkul, kelas } = this.state;

        var yes = window.confirm("Apakah anda yakin ingin menghapus nim: " + b + ", nama: " + c + "?");
        if (yes === true) {
            if (a === 'Pengajar') {
                fetch(get.deletefilterdosen, {
                    method: 'post',
                    headers: {
                        "Authorization": sessionStorage.name,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nip: b,
                        nama: c,
                        kodematkul: kodematkul,
                        kelas: kelas
                    })
                })
                    .then(response => response.json())
                    .then(response => {
                        setTimeout(this.getData(sortby, ascdsc, search, limit, page, kodematkul, kelas), 1000)
                    })
                    .catch(error => {
                        sessionStorage.removeItem("name")
                        window.location.reload()
                    })
            }
            else {

                fetch(get.deletefilterpengguna, {
                    method: 'post',
                    headers: {
                        "Authorization": sessionStorage.name,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nim: b,
                        nama: c,
                        kodematkul: kodematkul,
                        kelas: kelas
                    })
                })
                    .then(response => response.json())
                    .then(response => {
                        setTimeout(this.getData(sortby, ascdsc, search, limit, page, kodematkul, kelas), 1000)
                    })
                    .catch(error => {
                        sessionStorage.removeItem("name")
                        window.location.reload()
                    })
            }
        }
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

    getNameFilter(e) {
        const { statusc } = this.state;
        const { name, value } = e.target;
        this.setState({ [name]: value });
        var lengthnama;

        lengthnama = value.length;

        if ((statusc === 'Dosen') && (lengthnama === 18)) {
            fetch(get.readdosen, {
                method: 'post',
                headers: {
                    "x-access-token": sessionStorage.name,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sortby: "nip",
                    ascdsc: "asc",
                    search: value,
                    limit: "1",
                    page: "1",
                })
            })
                .then(response => response.json())
                .then(response => {
                    //berhasil dapet data
                    if ((response.status === 1) && (response.count == 1)) {
                        this.setState({ namac: response.hasil[0].nama })
                    }
                    else if ((response.status === 1) && (response.count != 1)) {
                        this.setState({ namac: '' })
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

        else if (((statusc === 'Mahasiswa') || (statusc === 'Asisten')) && (lengthnama === 8)) {
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
                    if ((response.status === 1) && (response.count == 1)) {
                        this.setState({ namac: response.hasil[0].nama })
                    }
                    else if ((response.status === 1) && (response.count != 1)) {
                        this.setState({ namac: '' })
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
            this.setState({ namac: '' })
        }
    }

    Back(){
        this.setState({
            nullkodematkul: true,
        })
    }

    showDaftar() {
        this.setState({ daftar: true })
    }
    hideDaftar() {
        this.setState({ 
            daftar: false,
            namac: '',
            datasalah: false,
            databenar: false
        })
    }
    render() {
        const state = this.state

        //setting tombol berikutnya and sebelumnya
        var maxPage = parseInt(state.rowCount / state.limit);
        if ((state.rowCount % state.limit) !== 0) {
            maxPage = maxPage + 1
        }
        var showNext = false;
        var showPrevious = false;
        // deteksi page pertama
        if (state.page === 1) {
            showPrevious = false;
            if ((state.page === maxPage) || (maxPage === 0)) {
                showNext = false;
            }
            else {
                showNext = true;
            }
        }
        // deteksi page terakhir
        else if ((state.page === maxPage) || (maxPage === 0)) {
            showPrevious = true;
            showNext = false;
        }
        //deteksi page ditengah
        else {
            showPrevious = true;
            showNext = true;
        }

        var aksidata
        if (state.daftar === true) {
            aksidata = "show"
        }
        else {
            aksidata = "hide"
        }
        var i = 1;
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

                                    <div className="inputcreatestatuspenggunamatkul">
                                        <label><b>Status</b> </label> <br></br>
                                        <select name="statusc" onChange={this.handleChange} className="inputcreatepenggunamatkul" placeholder="Status" required>
                                            <option> </option>
                                            <option key={i++} value={'Dosen'}>Dosen</option>
                                            <option key={i++} value={'Asisten'}>Asisten</option>
                                            <option key={i++} value={'Mahasiswa'}>Mahasiswa</option>
                                        </select>
                                    </div>

                                    <div className="inputcreatenimpenggunamatkul">
                                        <label><b>NIM</b> </label> <br></br>
                                        <input name="nimnipc" onChange={this.getNameFilter} className="inputcreatepenggunamatkul" type="text" placeholder="NIM" required ></input>
                                    </div>

                                    <div className="inputcreatenamapenggunamatkul">
                                        <label><b>Nama</b> </label> <br></br>
                                        <input className="inputcreatepenggunamatkul" type="text" placeholder="Nama" value={state.namac || ''} required></input>
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
                    <div>
                        <div className="kotakbackmatkul">
                            <a onClick={() => this.Back()}>
                                <div className="backmatkul">
                                    <i className="fa fa-arrow-left"></i>
                                    <span><b>&nbsp;&nbsp;Kembali</b></span>
                                </div>
                            </a>
                        </div>
                        <div className="kotakdaftarmatkul">
                            <a onClick={() => this.showDaftar()}>
                                <div className="daftarmatkul">
                                    <i className="fa fa-plus"></i>
                                    <span><b>&nbsp;&nbsp;Pengguna</b></span>
                                </div>
                            </a>
                        </div>
                    </div>
                    }
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
                            <table className="tablematkul">
                                <thead className="theadlog">
                                    <tr>
                                        <th colSpan="6"><h5 style={{ letterSpacing: "2px" }}>Pengajar</h5></th>
                                    </tr>
                                    <tr>
                                        <th className="fakultas" style={{ cursor: "default" }}>Fakultas</th>
                                        <th className="jurusan" style={{ cursor: "default" }}>Jurusan</th>
                                        <th className="nim" style={{ cursor: "default" }}>NIM/NIP</th>
                                        <th className="nama" style={{ cursor: "default" }}>Nama</th>
                                        <th className="nim" style={{ cursor: "default" }}>Status</th>
                                        <th className="nim" style={{ cursor: "default" }}>Keterangan</th>
                                    </tr>
                                </thead>
                                {(state.datakosongpengajar === false) &&
                                    <tbody className="tbodylog">
                                        {state.datadosen.map(isidata => (
                                            <tr key={i++}>
                                                <td>{isidata.fakultas}</td>
                                                <td>{isidata.jurusan}</td>
                                                <td>{isidata.nip}</td>
                                                <td>{isidata.nama}</td>
                                                <td>Dosen</td>
                                                <td>
                                                    <div>
                                                        &nbsp;
                                                        <button className="backgroundmerah" onClick={() => this.deletePengguna("Pengajar", isidata.nip, isidata.nama)}>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {state.dataasisten.map(isidata => (
                                            <tr key={i++}>
                                                <td>{isidata.fakultas}</td>
                                                <td>{isidata.jurusan}</td>
                                                <td>{isidata.nip}</td>
                                                <td>{isidata.nama}</td>
                                                <td>Asisten</td>
                                                <td>
                                                    <div>
                                                        &nbsp;
                                                        <button className="backgroundmerah" onClick={() => this.deletePengguna("Pengajar", isidata.nip, isidata.nama)}>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>}
                                {(state.datakosongpengajar === true) &&
                                    <tbody className="tbodylog">
                                        <tr>
                                            <td colSpan="5">Data tidak ditemukan</td>
                                        </tr>
                                    </tbody>}
                            </table>
                        </div>
                        <br></br>
                        <div className="tampilkanpage">
                            <b>Tampilkan&nbsp;&nbsp;</b>
                            <select name="limit" onChange={this.handleFilter} className="inputfilterpagelogpintu" required>
                                <option value={10}> 10 </option>
                                <option value={20}> 20 </option>
                                <option value={30}> 30 </option>
                                <option value={40}> 40 </option>
                                <option value={50}> 50 </option>
                                <option value={100}> 100 </option>
                            </select>
                            <b> &nbsp; dari &nbsp;</b>
                            <b>{state.rowCount}</b>
                            <b>&nbsp;Data</b>
                        </div>
                        <div className="filtersearchlogpintu">
                            <span><b>Search&nbsp;&nbsp;</b></span>
                            <input name="search" onChange={this.handleFilter} className="inputfilterlogpintu" type="text" placeholder="search..." required></input>
                        </div>
                        <div className="marginbottom20px"></div>
                        <div className="isitabel">
                            <table className="tablematkul">
                                <thead className="theadlog">
                                    <tr>
                                        <th colSpan="5"><h5 style={{ letterSpacing: "2px" }}>Mahasiswa</h5></th>
                                    </tr>
                                    <tr>
                                        <th className="fakultas" onClick={() => this.filter(state.page, "a.fakultas", state.ascdsc)}>Fakultas</th>
                                        <th className="jurusan" onClick={() => this.filter(state.page, "a.jurusan", state.ascdsc)}>Jurusan</th>
                                        <th className="nim" onClick={() => this.filter(state.page, "b.nim", state.ascdsc)}>NIM</th>
                                        <th className="nama" onClick={() => this.filter(state.page, "a.nama", state.ascdsc)}>Nama</th>
                                        <th className="keterangan">Keterangan</th>
                                    </tr>
                                </thead>
                                {(state.datakosongmahasiswa === false) &&
                                    <tbody className="tbodylog">
                                        {state.datamahasiswa.map(isidata => (
                                            <tr key={i++}>
                                                <td>{isidata.fakultas}</td>
                                                <td>{isidata.jurusan}</td>
                                                <td>{isidata.nim}</td>
                                                <td>{isidata.nama}</td>
                                                <td>
                                                    <div>
                                                        &nbsp;
                                                        <button className="backgroundmerah" onClick={() => this.deletePengguna("Mahasiswa", isidata.nim, isidata.nama)}>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>}
                                {(state.datakosongmahasiswa === true) &&
                                    <tbody className="tbodylog">
                                        <tr>
                                            <td colSpan="5">Data tidak ditemukan</td>
                                        </tr>
                                    </tbody>}
                            </table>
                        </div>
                        <div className="marginbottom20px"></div>
                        <div className="pagedata">
                            {showPrevious &&
                                <button className="pagesebelumnya" onClick={() => this.filter((state.page - 1), state.sortby, state.ascdsc)}>≪ Sebelumnya</button>
                            }
                            {(showPrevious === false) &&
                                <button className="pagesebelumnyanone">≪ Sebelumnya</button>
                            }
                            {
                                showNext &&
                                <button className="pageberikutnya" onClick={() => this.filter((state.page + 1), state.sortby, state.ascdsc)}>Berikutnya ≫</button>
                            }
                            {
                                (showNext === false) &&
                                <button className="pageberikutnyanone">Berikutnya ≫</button>
                            }
                        </div>
                    </div>
                </div>
            )
        }

    }
}

export default withRouter(Filter_Matkul_Pengguna);
