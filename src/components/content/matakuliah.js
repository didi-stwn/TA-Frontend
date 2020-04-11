import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import get from './config';

class Matakuliah extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //read
      sortby: 'fakultas',
      ascdsc: 'asc',
      search: '',
      limit: 10,
      page: 1,
      rowCount: 0,
      semuafakultas: [],
      jurusan: [],
      jurusankosong: true,
      data: [],
      datakosong: false,
      daftar: false,
      edit: false,

      //create
      fakultasc: '',
      jurusanc: '',
      kodematkulc: '',
      namamatkulc: '',
      kelasc: '',

      //edit
      oldkodematkul: '',
      oldkelas: '',
      newnamamatkul: '',
      newkelas: '',

      //status add
      pesan: '',
      datasalah: false,
      databenar: false,
    };
    this.getJurusan = this.getJurusan.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitDaftar = this.handleSubmitDaftar.bind(this);
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
  }

  getData(sortby, ascdsc, search, limit, page) {
    fetch(get.readmatkul, {
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
      })
    })
      .then(response => response.json())
      .then(response => {
        //berhasil dapet data
        if ((response.status === 1) && (response.count !== 0)) {
          this.setState({ data: response.hasil })
          this.setState({ rowCount: response.count })
          this.setState({ datakosong: false })
        }
        else if ((response.status === 1) && (response.count === 0)) {
          this.setState({ datakosong: true })
          this.setState({ rowCount: response.count })
        }
        //ga dapet token
        else if ((response.status !== 1) && (response.status !== 0)) {
          sessionStorage.removeItem("name")
          window.location.reload()
        }
      })
  }

  getFakultas() {
    fetch(get.readfakultasjurusan, {
      method: 'post',
      headers: {
        "x-access-token": sessionStorage.name,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sortby: 'fakultas',
        ascdsc: 'asc',
        search: '',
        limit: 100,
        page: 1,
      })
    })
      .then(response => response.json())
      .then(response => {
        //berhasil dapet data
        if ((response.status === 1) && (response.count !== 0)) {
          this.setState({ semuafakultas: response.hasil })
        }
        //ga dapet token
        else if ((response.status !== 1) && (response.status !== 0)) {
          sessionStorage.removeItem("name")
          window.location.reload()
        }
      })
  }

  getJurusan(e) {
    const { value } = e.target
    this.setState({ fakultasc: value })
    if (value === '') {
      this.setState({ jurusankosong: true })
    }
    else {
      this.setState({ jurusankosong: false })
      this.setState({ jurusan: [] })
      fetch(get.readfakultasjurusan + "/" + value, {
        method: 'post',
        headers: {
          "x-access-token": sessionStorage.name,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sortby: 'jurusan',
          ascdsc: 'asc',
          search: '',
          limit: 100,
          page: 1,
        })
      })
        .then(response => response.json())
        .then(response => {
          //berhasil dapet data
          if ((response.status === 1) && (response.count !== 0)) {
            this.setState({ jurusan: response.hasil })
          }
          //ga dapet token
          else if ((response.status !== 1) && (response.status !== 0)) {
            sessionStorage.removeItem("name")
            window.location.reload()
          }
        })
    }
  }

  handleFilter(e) {
    const { sortby, ascdsc, search, limit, page } = this.state
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
    this.getData(sortby, ascdsc, searching, max, page)
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  componentDidMount() {
    const { sortby, ascdsc, search, limit, page } = this.state
    this.getData(sortby, ascdsc, search, limit, page)
    this.getFakultas()
  }

  filter(pagenow, sortbynow, ascdscnow) {
    const { sortby, search, limit, page } = this.state
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
    this.getData(sortbynow, ascdscnow, search, limit, pagenow)
  }

  handleSubmitDaftar(e) {
    e.preventDefault();
    const { fakultasc, jurusanc, kodematkulc, namamatkulc, kelasc } = this.state;

    fetch(get.creatematkul, {
      method: 'post',
      headers: {
        "x-access-token": sessionStorage.name,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fakultas: fakultasc,
        jurusan: jurusanc,
        kodematkul: kodematkulc,
        namamatkul: namamatkulc,
        kelas: kelasc
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
  }

  handleSubmitEdit(e) {
    e.preventDefault();
    const { oldkodematkul, oldkelas, newnamamatkul, newkelas } = this.state;
    fetch(get.updatematkul, {
      method: 'post',
      headers: {
        "x-access-token": sessionStorage.name,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        oldkodematkul: oldkodematkul,
        oldkelas: oldkelas,
        newnamamatkul: newnamamatkul,
        newkelas: newkelas
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
  }

  deletePengguna(a, b, c) {
    var yes = window.confirm("Apakah anda yakin ingin menghapus matakuliah: " + a + " kelas " + c + "?");
    if (yes === true) {
      fetch(get.deletematkul, {
        method: 'post',
        headers: {
          "Authorization": sessionStorage.name,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          kodematkul: a,
          namamatkul: b,
          kelas: c,
        })
      })
        .then(response => response.json())
        .then(response => {
          setTimeout(this.componentDidMount(), 1000)
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
  showEdit(a, b, c, d) {
    this.setState({ edit: true })
    this.setState({ daftar: false })
    this.setState({ oldkodematkul: a })
    this.setState({ oldkelas: b })
    this.setState({ newnamamatkul: c })
    this.setState({ newkelas: d })
  }
  hideEdit() {
    this.setState({ edit: false })
    this.setState({ datasalah: false })
    this.setState({ databenar: false })
  }
  render() {
    const { jurusankosong, semuafakultas, jurusan, oldkodematkul, newnamamatkul, newkelas, datakosong, rowCount, limit, page, daftar, edit, databenar, pesan, datasalah, data, sortby, ascdsc } = this.state

    //get fakultas dan jurusan
    var fakultas = []
    var checkfakultas = 0
    for (var i = 0; i < semuafakultas.length; i++) {
      for (var j = 0; j < fakultas.length; j++) {
        if (semuafakultas[i].fakultas === fakultas[j]) {
          checkfakultas++
        }
      }
      if (checkfakultas === 0) {
        fakultas.push(semuafakultas[i].fakultas)
      }
      checkfakultas = 0;
    }

    //setting tombol berikutnya and sebelumnya
    var maxPage = parseInt(rowCount / limit);
    if ((rowCount % limit) !== 0) {
      maxPage = maxPage + 1
    }
    var showNext = false;
    var showPrevious = false;
    // deteksi page pertama
    if (page === 1) {
      showPrevious = false;
      if (page === maxPage) {
        showNext = false;
      }
      else {
        showNext = true;
      }
    }
    // deteksi page terakhir
    else if (page === maxPage) {
      showPrevious = true;
      showNext = false;
    }
    //deteksi page ditengah
    else {
      showPrevious = true;
      showNext = true;
    }

    var aksidata
    if (daftar === true) {
      aksidata = "show"
    }
    else if (edit === true) {
      aksidata = "show"
    }
    else {
      aksidata = "hide"
    }
    i = 1;
    return (
      <div>
        {daftar &&
          <div>
            <div className="kotakfilter2">
              <form className="kotakforminputlogpintu" onSubmit={this.handleSubmitDaftar}>
                {
                  databenar &&
                  <span className="texthijau">{pesan}</span>
                }
                {
                  datasalah &&
                  <span className="textmerah">{pesan}</span>
                }

                <div className="kotakinputpenggunafakultas">
                  <label> <b>Fakultas</b> </label> <br></br>
                  <select onChange={this.getJurusan} className="inputformlogpintustatus" required>
                    <option> </option>
                    {fakultas.map(isidata => (
                      <option key={i++} value={isidata}>{isidata}</option>
                    ))}
                  </select>
                </div>

                <div className="kotakinputmatkuljurusan">
                  <label> <b>Jurusan</b> </label> <br></br>
                  <select name="jurusanc" onChange={this.handleChange} className="inputformlogpintujurusan" required>
                    {jurusankosong &&
                      <option> </option>
                    }
                    {(jurusankosong === false) &&
                      <option> </option>
                    }
                    {(jurusankosong === false) && jurusan.map(isidata => (
                      <option key={i++} value={isidata.jurusan}>{isidata.jurusan}</option>
                    ))}
                  </select>
                </div>

                <div className="kotakinputkodematkul">
                  <label><b>Kode Matakuliah</b> </label> <br></br>
                  <input name="kodematkulc" onChange={this.handleChange} className="inputformlogpintujurusan" type="text" placeholder="Kode" required ></input>
                </div>

                <div className="kotakinputnamamatkul">
                  <label><b>Nama Matakuliah</b> </label> <br></br>
                  <input name="namamatkulc" onChange={this.handleChange} className="inputformlogpintujurusan" type="text" placeholder="Nama" required ></input>
                </div>

                <div className="kotakinputkelas">
                  <label><b>Kelas</b> </label> <br></br>
                  <input name="kelasc" onChange={this.handleChange} className="inputformlogpintujurusan" type="text" placeholder="Kelas" required ></input>
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
        {
          edit &&
          <div>
            <div className="kotakfilter2">
              <form className="kotakforminputlogpintu" onSubmit={this.handleSubmitEdit}>
                {
                  databenar &&
                  <span className="texthijau">{pesan}</span>
                }
                {
                  datasalah &&
                  <span className="textmerah">{pesan}</span>
                }

                <div className="kotakinputkodematkuledit">
                  <label><b>Kode Mata Kuliah</b> </label> <br></br>
                  <input onChange={this.handleChange} className="inputformeditmatkul" type="text" placeholder="Kode" value={oldkodematkul} required ></input>
                </div>

                <div className="kotakinputnamamatkuledit">
                  <label><b>Nama Mata Kuliah</b> </label> <br></br>
                  <input name="newnamamatkul" onChange={this.handleChange} className="inputformeditmatkul" type="text" placeholder="Nama" value={newnamamatkul} required ></input>
                </div>

                <div className="kotakinputkelasedit">
                  <label><b>Kelas</b> </label> <br></br>
                  <input name="newkelas" onChange={this.handleChange} className="inputformeditmatkul" type="text" placeholder="Kelas" value={newkelas} required ></input>
                </div>

                <div className="kotaksubmitpenggunadaftar">
                  <input className="submitformlogpintu" type="submit" value="Add"></input>
                </div>

                <div className="kotakcancelpenggunadaftar">
                  <a onClick={() => this.hideEdit()}> <span className="cancelformpengguna">Cancel</span></a>
                </div>
              </form>
            </div>
          </div>
        }
        {(daftar === false) && (edit === false) &&
          <div className="kotakdaftarruangan">
            <a onClick={() => this.showDaftar()}>
              <div className="daftarfakultas">
                <i className="fa fa-plus"></i>
                <span><b>&nbsp;&nbsp;Mata Kuliah</b></span>
              </div>
            </a>
          </div>
        }
        <div id={aksidata} className="kotakdata">
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
            <b>{rowCount}</b>
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
                  <th className="fakultas" onClick={() => this.filter(page, "fakultas", ascdsc)}>Fakultas</th>
                  <th className="jurusan" onClick={() => this.filter(page, "jurusan", ascdsc)}>Jurusan</th>
                  <th className="kodematkul" onClick={() => this.filter(page, "kodematkul", ascdsc)}>Kode Matakuliah</th>
                  <th className="namamatkul" onClick={() => this.filter(page, "namamatkul", ascdsc)}>Nama MataKuliah</th>
                  <th className="kelas" onClick={() => this.filter(page, "kelas", ascdsc)}>Kelas</th>
                  <th className="keterangan">Keterangan</th>
                </tr>
              </thead>
              {(datakosong === false) &&
                <tbody className="tbodylog">
                  {data.map(isidata => (
                    <tr key={i++}>
                      <td>{isidata.fakultas}</td>
                      <td>{isidata.jurusan}</td>
                      <td>{isidata.kodematkul}</td>
                      <td>{isidata.namamatkul}</td>
                      <td>{isidata.kelas}</td>
                      <td>
                        <div>
                          <button className="backgroundbiru" onClick={() => this.showEdit(isidata.kodematkul, isidata.kelas, isidata.namamatkul, isidata.kelas)} >
                            Edit
                        </button>
                          &nbsp;
                        <button className="backgroundmerah" onClick={() => this.deletePengguna(isidata.kodematkul, isidata.namamatkul, isidata.kelas)}>
                            Delete
                        </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>}
              {(datakosong === true) &&
                <tbody className="tbodylog">
                  <tr>
                    <td colSpan="7">Data tidak ditemukan</td>
                  </tr>
                </tbody>}
            </table>
          </div>
          <div className="marginbottom20px"></div>
          <div className="pagedata">
            {showPrevious &&
              <button className="pagesebelumnya" onClick={() => this.filter((page - 1), sortby, ascdsc)}>≪ Sebelumnya</button>
            }
            {(showPrevious === false) &&
              <button className="pagesebelumnyanone">≪ Sebelumnya</button>
            }
            {
              showNext &&
              <button className="pageberikutnya" onClick={() => this.filter((page + 1), sortby, ascdsc)}>Berikutnya ≫</button>
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

export default withRouter(Matakuliah);