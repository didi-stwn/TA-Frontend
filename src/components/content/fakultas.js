import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import get from './config';

class Fakultas extends Component {
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
      data: [],
      datakosong: false,
      daftar: false,
      edit: false,

      //create
      fakultasc: '',
      jurusanc: '',

      //edit
      oldfakultas: '',
      oldjurusan: '',
      newjurusan: '',

      //status add
      pesan: '',
      datasalah: false,
      databenar: false,
    };
    this.handleFilter = this.handleFilter.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitDaftar = this.handleSubmitDaftar.bind(this);
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
  }

  getData(sortby, ascdsc, search, limit, page) {
    fetch(get.readfakultasjurusan, {
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

  handleFilter(e) {
    const { sortby, ascdsc, search, limit, page } = this.state
    const { name, value } = e.target;
    this.setState({ [name]: value });
    if (name == "search") {
      var searching = value
      var max = limit
    }
    else if (name == "limit") {
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
  }

  filter(pagenow, sortbynow, ascdscnow) {
    const { sortby, ascdsc, search, limit, page } = this.state
    if (pagenow == page) {
      if (sortbynow == sortby) {
        if (ascdscnow == "asc") {
          ascdscnow = "desc"
        }
        else if (ascdscnow == "desc") {
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
    const { fakultasc, jurusanc } = this.state;

    fetch(get.createfakultasjurusan, {
      method: 'post',
      headers: {
        "x-access-token": sessionStorage.name,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fakultas: fakultasc,
        jurusan: jurusanc,
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
    const { oldfakultas, oldjurusan, newjurusan } = this.state;
    fetch(get.updatefakultasjurusan, {
      method: 'post',
      headers: {
        "x-access-token": sessionStorage.name,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        oldfakultas: oldfakultas,
        oldjurusan: oldjurusan,
        newjurusan: newjurusan,
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

  deletePengguna(a, b) {
    var yes = window.confirm("Apakah anda yakin ingin menghapus jurusan: " + a + "?");
    if (yes === true) {
      fetch(get.deletefakultasjurusan, {
        method: 'post',
        headers: {
          "Authorization": sessionStorage.name,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fakultas: a,
          jurusan: b,
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
  showEdit(a, b, c) {
    this.setState({ edit: true })
    this.setState({ daftar: false })
    this.setState({ oldfakultas: a })
    this.setState({ oldjurusan: b })
    this.setState({ newjurusan: c })
  }
  hideEdit() {
    this.setState({ edit: false })
    this.setState({ datasalah: false })
    this.setState({ databenar: false })
  }
  render() {
    const { oldfakultas, newjurusan, datakosong, rowCount, limit, page, daftar, edit, databenar, pesan, datasalah, data, sortby, ascdsc } = this.state

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
    var i = 1;
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

                <div className="kotakinputfakultas">
                  <label><b>Fakultas</b> </label> <br></br>
                  <input name="fakultasc" onChange={this.handleChange} className="inputformfakultas" type="text" placeholder="Fakultas" required ></input>
                </div>

                <div className="kotakinputjurusan">
                  <label><b>Jurusan</b> </label> <br></br>
                  <input name="jurusanc" onChange={this.handleChange} className="inputformfakultas" type="text" placeholder="Jurusan" required ></input>
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

                <div className="kotakinputfakultas">
                  <label><b>Fakultas</b> </label> <br></br>
                  <input onChange={this.handleChange} className="inputformfakultas" type="text" placeholder="Fakultas" value={oldfakultas} required ></input>
                </div>

                <div className="kotakinputjurusan">
                  <label><b>Jurusan</b> </label> <br></br>
                  <input name="newjurusan" onChange={this.handleChange} className="inputformfakultas" type="text" placeholder="Jurusan" value={newjurusan} required ></input>
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
                <span><b>&nbsp;&nbsp;Fakultas/Jurusan</b></span>
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
            <table className="tablefakultas">
              <thead className="theadlog">
                <tr>
                  <th className="fakultas" onClick={() => this.filter(page, "fakultas", ascdsc)}>Fakultas</th>
                  <th className="jurusan" onClick={() => this.filter(page, "jurusan", ascdsc)}>Jurusan</th>
                  <th className="keterangan">Keterangan</th>
                </tr>
              </thead>
              {(datakosong === false) &&
                <tbody className="tbodylog">
                  {data.map(isidata => (
                    <tr key={i++}>
                      <td>{isidata.fakultas}</td>
                      <td>{isidata.jurusan}</td>
                      <td>
                        <div>
                          <button className="backgroundbiru" onClick={() => this.showEdit(isidata.fakultas, isidata.jurusan, isidata.jurusan)} >
                            Edit
                        </button>
                          &nbsp;
                        <button className="backgroundmerah" onClick={() => this.deletePengguna(isidata.fakultas, isidata.jurusan)}>
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

export default withRouter(Fakultas);
