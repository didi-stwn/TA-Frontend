import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import get from './config';

class Pengaturan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //read
            data: [],
            datakosong: true,
            daftar: false,
            edit: false,

            //create
            namac: '',
            jumlahc: 0,

            //edit
            namau_old: '',
            namau_new: '',
            jumlahu_new: 0,

            //status add
            pesan: '',
            datasalah: false,
            databenar: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitDaftar = this.handleSubmitDaftar.bind(this);
        this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
    }

    getData() {
        fetch(get.readkonfigurasimahasiswa, {
            method: 'post',
            headers: {
                "x-access-token": sessionStorage.name,
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(response => {
                //berhasil dapet data
                if ((response.hasil.length !== 0) && (response.status === 1)) {
                    this.setState({ data: response.hasil })
                    this.setState({ datakosong: false })
                }
                else if ((response.hasil.length === 0) && (response.status === 1)) {
                    this.setState({ data: [] })
                    this.setState({ datakosong: true })
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

    componentDidMount() {
        this.getData()
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmitDaftar(e) {
        e.preventDefault();
        const { namac, jumlahc } = this.state;

        fetch(get.createkonfigurasimahasiswa, {
            method: 'post',
            headers: {
                "x-access-token": sessionStorage.name,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nama: namac,
                jumlah_minggu: jumlahc,
            })
        })
            .then(response => response.json())
            .then(response => {
                //berhasil add data
                if (response.status === 1) {
                    this.setState({ databenar: true })
                    this.setState({ datasalah: false })
                    this.setState({ pesan: response.pesan })
                    setTimeout(this.componentDidMount(), 1000)
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

    handleSubmitEdit(e) {
        e.preventDefault();
        const { namau_new, namau_old, jumlahu_new } = this.state;
        fetch(get.updatekonfigurasimahasiswa, {
            method: 'post',
            headers: {
                "x-access-token": sessionStorage.name,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nama_old: namau_old,
                nama_new: namau_new,
                jumlah_minggu_new: jumlahu_new,
            })
        })
            .then(response => response.json())
            .then(response => {
                //berhasil add data
                if (response.status === 1) {
                    this.setState({ databenar: true })
                    this.setState({ datasalah: false })
                    this.setState({ pesan: response.pesan })
                    setTimeout(this.componentDidMount(), 1000)
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

    deletePengguna(a) {
        var yes = window.confirm("Apakah anda yakin ingin menghapus pengaturan: " + a + "?");
        if (yes === true) {
            fetch(get.deletekonfigurasimahasiswa, {
                method: 'post',
                headers: {
                    "Authorization": sessionStorage.name,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nama: a,
                })
            })
                .then(response => response.json())
                .then(response => {
                    setTimeout(this.componentDidMount(), 1000)
                })
                .catch(error => {
                    sessionStorage.removeItem("name")
                    window.location.reload()
                })
        }
    }

    showDaftar() {
        this.setState({ daftar: true })
        this.setState({ edit: false })
    }
    hideDaftar() {
        this.setState({ daftar: false })
        this.setState({ datasalah: false })
        this.setState({ databenar: false })
    }
    showEdit(a, b, c) {
        this.setState({ edit: true })
        this.setState({ daftar: false })
        this.setState({ namau_old: a })
        this.setState({ namau_new: b })
        this.setState({ jumlahu_new: c })
    }
    hideEdit() {
        this.setState({ edit: false })
        this.setState({ datasalah: false })
        this.setState({ databenar: false })
    }

    render() {
        const state = this.state
        var aksidata
        if (state.daftar === true) {
            aksidata = "show"
        }
        else if (state.edit === true) {
            aksidata = "show"
        }
        else {
            aksidata = "hide"
        }
        var i = 1;
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

                                <div className="kotakinputfakultas">
                                    <label><b>Nama</b> </label> <br></br>
                                    <input name="namac" onChange={this.handleChange} className="inputformfakultas" type="text" placeholder="Nama pengaturan..." required ></input>
                                </div>

                                <div className="kotakinputjurusan">
                                    <label><b>Jumlah (minggu)</b> </label> <br></br>
                                    <input name="jumlahc" onChange={this.handleChange} className="inputformfakultas" type="text" placeholder="Jumlah dalam minggu..." required ></input>
                                </div>

                                <div className="kotaksubmitpenggunadaftar">
                                    <input className="submitformlogpintu" type="submit" value="Add"></input>
                                </div>

                                <div className="kotakcancelpenggunadaftar">
                                    <button className="buttonlikea" onClick={() => this.hideDaftar()}> <span className="cancelformpengguna">Cancel</span></button>
                                </div>
                            </form>
                        </div>
                    </div>
                }
                {
                    state.edit &&
                    <div>
                        <div className="kotakfilter2">
                            <form className="kotakforminputlogpintu" onSubmit={this.handleSubmitEdit}>
                                {
                                    state.databenar &&
                                    <span className="texthijau">{state.pesan}</span>
                                }
                                {
                                    state.datasalah &&
                                    <span className="textmerah">{state.pesan}</span>
                                }

                                <div className="kotakinputfakultas">
                                    <label><b>Nama</b> </label> <br></br>
                                    <input name="namau_new" onChange={this.handleChange} className="inputformfakultas" type="text" placeholder="Nama pengaturan..." value={state.namau_new || ''} required ></input>
                                </div>

                                <div className="kotakinputjurusan">
                                    <label><b>Jumlah (minggu)</b> </label> <br></br>
                                    <input name="jumlahu_new" onChange={this.handleChange} className="inputformfakultas" type="text" placeholder="Jumlah dalam minggu..." value={state.jumlahu_new || ''} required ></input>
                                </div>

                                <div className="kotaksubmitpenggunadaftar">
                                    <input className="submitformlogpintu" type="submit" value="Add"></input>
                                </div>

                                <div className="kotakcancelpenggunadaftar">
                                    <button className="buttonlikea" onClick={() => this.hideEdit()}> <span className="cancelformpengguna">Cancel</span></button>
                                </div>
                            </form>
                        </div>
                    </div>
                }
                {(state.daftar === false) && (state.edit === false) &&
                    <div className="kotakdaftarruangan">
                        <button className="buttonlikea" onClick={() => this.showDaftar()}>
                            <div className="daftarfakultas">
                                <i className="fa fa-plus"></i>
                                <span><b>&nbsp;&nbsp;Pengaturan</b></span>
                            </div>
                        </button>
                    </div>
                }
                <div id={aksidata} className="kotakdata">
                    <div className="marginbottom20px"></div>
                    <div className="isitabel">
                        <table className="tablefakultas">
                            <thead className="theadlog">
                                <tr>
                                    <th className="fakultas" >Nama Pengaturan</th>
                                    <th className="jurusan" >Jumlah (minggu)</th>
                                    <th className="keterangan">Keterangan</th>
                                </tr>
                            </thead>
                            {(state.datakosong === false) &&
                                <tbody className="tbodylog">
                                    {state.data.map(isidata => (
                                        <tr key={i++}>
                                            <td>{isidata.nama}</td>
                                            <td>{isidata.jumlah_minggu}</td>
                                            <td>
                                                <div>
                                                    <button className="backgroundbiru" onClick={() => this.showEdit(isidata.nama, isidata.nama, isidata.jumlah_minggu)} >
                                                        Edit
                            </button>
                                                    &nbsp;
                            <button className="backgroundmerah" onClick={() => this.deletePengguna(isidata.nama)}>
                                                        Delete
                            </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>}
                            {(state.datakosong === true) &&
                                <tbody className="tbodylog">
                                    <tr>
                                        <td colSpan="3">Data tidak ditemukan</td>
                                    </tr>
                                </tbody>}
                        </table>
                    </div>
                    <div className="marginbottom20px"></div>
                </div>
            </div>
        )
    }
}

export default withRouter(Pengaturan);