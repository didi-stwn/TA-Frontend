import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import get from './config';

class Ruangan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageshow: 'ruangan',

      //Ruangan
      //read
      sortby: 'koderuangan',
      ascdsc: 'asc',
      search: '',
      limit: 10,
      page: 1,
      rowCount: 0,
      data: [],
      datakosong: true,
      daftar: false,
      edit: false,
      //create
      kodedevicec: '',
      koderuanganc: '',
      alamatc: '',
      //edit
      oldkodedevice: '',
      newkoderuangan: '',
      newalamat: '',

      //Filter Ruangan
      //read
      jam_masuk: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
      datafilterruangan: [],
      daftarfilter: false,
      //create
      harifilterc: '',
      jamfilterc: '',
      durasifilterc: '',
      koderuanganfilterc: '',
      kodematkulfilterc: '',
      kelasfilterc: '',
      datafilterkosong: false,

      //status add
      pesan: '',
      datasalah: false,
      databenar: false,
    };
    this.handleFilter = this.handleFilter.bind(this);
    this.getNameMatkulFilter = this.getNameMatkulFilter.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitDaftar = this.handleSubmitDaftar.bind(this);
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
  }

  getData(sortby, ascdsc, search, limit, page) {
    fetch(get.readruangan, {
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
      .catch(error => {
        sessionStorage.removeItem("name")
        window.location.reload()
      })
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
    const { pageshow, kodedevicec, koderuanganc, alamatc } = this.state;
    const { harifilterc, jamfilterc, durasifilterc, koderuanganfilterc, kodematkulfilterc, kelasfilterc } = this.state;
    if (pageshow === "filterruangan") {
      fetch(get.createfilterruangan, {
        method: 'post',
        headers: {
          "x-access-token": sessionStorage.name,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          hari: harifilterc,
          jam: jamfilterc,
          durasi: durasifilterc,
          koderuangan: koderuanganfilterc,
          kodematkul: kodematkulfilterc,
          kelas: kelasfilterc,
        })
      })
        .then(response => response.json())
        .then(response => {
          //console.log(response)
          //berhasil add data
          if (response.status === 1) {
            this.setState({ databenar: true })
            this.setState({ datasalah: false })
            this.setState({ pesan: response.pesan })
            setTimeout(this.getDataFilterRuangan(), 1000)
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
    else if (pageshow === "ruangan") {
      fetch(get.createruangan, {
        method: 'post',
        headers: {
          "x-access-token": sessionStorage.name,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          kodedevice: kodedevicec,
          koderuangan: koderuanganc,
          alamat: alamatc,
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
  }

  handleSubmitEdit(e) {
    e.preventDefault();
    const { oldkodedevice, newkoderuangan, newalamat } = this.state;

    fetch(get.updateruangan, {
      method: 'post',
      headers: {
        "x-access-token": sessionStorage.name,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        oldkodedevice: oldkodedevice,
        newkoderuangan: newkoderuangan,
        newalamat: newalamat,
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
    var yes = window.confirm("Apakah anda yakin ingin menghapus Kode Device: " + a + "?");
    if (yes === true) {
      fetch(get.deleteruangan, {
        method: 'post',
        headers: {
          "Authorization": sessionStorage.name,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          kodedevice: a,
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

  updateDevice(a) {
    var yes = window.confirm("Apakah anda yakin ingin mengupdate Device: " + a + "?");
    if (yes === true) {
      fetch(get.updatedeviceruangan, {
        method: 'post',
        headers: {
          "Authorization": sessionStorage.name,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          kodedevice: a,
          kode: 2
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

  getDataFilterRuangan() {
    const { koderuanganfilterc } = this.state;
    fetch(get.readfilterruangan + "/" + koderuanganfilterc, {
      method: 'get',
      headers: {
        "x-access-token": sessionStorage.name,
        "Content-Type": "application/json"
      },
    })
      .then(response => response.json())
      .then(response => {
        //berhasil dapet data
        if ((response.status === 1) && (response.count !== 0)) {
          this.setState({ datafilterruangan: response.hasil })
          this.setState({ datafilterkosong: false })
        }
        else if ((response.status === 1) && (response.count === 0)) {
          this.setState({ datafilterruangan: [] })
          this.setState({ datafilterkosong: false })
        }
        else if (response.status === 2) {
          this.setState({ datafilterkosong: true })
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

  deleteFilterRuangan(a, b, c, d, e) {

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
          setTimeout(this.getDataFilterRuangan(), 1000)
        })
        .catch(error => {
          sessionStorage.removeItem("name")
          window.location.reload()
        })
    }
  }

  getNameMatkulFilter(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    var lengthnama = value.length;
    if (lengthnama === 6) {
      fetch(get.readmatkul, {
        method: 'post',
        headers: {
          "x-access-token": sessionStorage.name,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sortby: "kodematkul",
          ascdsc: "asc",
          search: value,
          limit: "1",
          page: "1",
        })
      })
        .then(response => response.json())
        .then(response => {
          //berhasil dapet data
          if ((response.status === 1) && (response.count >= 1)) {
            this.setState({ namamatkulfilterc: response.hasil[0].namamatkul })
          }
          else if ((response.status === 1) && (response.count !== 1)) {
            this.setState({ namamatkulfilterc: '' })
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
      this.setState({ namamatkulfilterc: '' })
    }
  }

  showDaftarFilter(a, b) {
    this.setState({ daftarfilter: true })
    this.setState({ harifilterc: a })
    this.setState({ jamfilterc: b })
  }
  hideDaftarFilter() {
    this.setState({ daftarfilter: false })
    this.setState({ datasalah: false })
    this.setState({ databenar: false })
    this.setState({ namamatkulfilterc: '' })
  }
  showRuangan(a) {
    this.setState({ pageshow: a })
  }
  showFilterRuangan(a, b) {
    this.setState({ pageshow: a })
    this.getDataFilterRuangan()
    this.setState({ koderuanganfilterc: b })
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
    this.setState({ oldkodedevice: a })
    this.setState({ newkoderuangan: b })
    this.setState({ newalamat: c })
  }
  hideEdit() {
    this.setState({ edit: false })
    this.setState({ datasalah: false })
    this.setState({ databenar: false })
  }

  getDataMatkulHari(a, b, hari) {
    var c
    if (b.length > 0) {
      for (let k = 0; k < b.length; k++) {
        if (b[k].hari === hari) {
          if ((b[k].jam + b[k].durasi - 1 >= a) && (a >= b[k].jam)) {
            c = (<div>
              <span style={{ fontWeight: '1000' }}>{b[k].kodematkul}</span>
              <br></br>
              <span>{b[k].namamatkul}</span>
              <br></br>
              <span>{b[k].kelas}</span>
              <br></br>
              <button className="backgroundmerah" onClick={() => { this.deleteFilterRuangan(hari, b[k].jam, b[k].koderuangan, b[k].kodematkul, b[k].kelas) }}>
                Hapus
              </button>
            </div>)
            break
          }
          else {
            c = (<div>
              <button className="backgroundbiru" onClick={() => this.showDaftarFilter(hari, a)} >
                Tambah
              </button>
            </div>)
          }
        }
        else {
          c = (<div>
            <button className="backgroundbiru" onClick={() => this.showDaftarFilter(hari, a)} >
              Tambah
            </button>
          </div>)
        }
      }
    }
    else {
      c = (<div>
        <button className="backgroundbiru" onClick={() => this.showDaftarFilter(hari, a)} >
          Tambah
        </button>
      </div>)
    }
    return c
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
    if ((state.daftar === true) || (state.daftarfilter === true)) {
      aksidata = "show"
    }
    else if (state.edit === true) {
      aksidata = "show"
    }
    else {
      aksidata = "hide"
    }

    //status aktif atau tidak aktif
    function Status(a) {
      var startTime = new Date(a)
      var endTime = new Date();
      var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
      var resultInMinutes = Math.round(difference / 60000);
      if (resultInMinutes < 6) {
        return <div className="backgroundhijau"><b>Aktif</b></div>
      }
      else {
        return <div className="backgroundmerah"><b>Tidak Aktif</b></div>
      }
    }
    function Waktu(t) {
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
    var i = 1;
    if (state.pageshow === "ruangan") {
      var stylefilterruangan = "kotakfilterruangan1"
    }
    else if (state.pageshow === "filterruangan") {
      stylefilterruangan = "kotakfilterruangan2"
    }

    //filterruangan
    function jam(a, b) {
      if (a > 9) {
        return (a + ":00 - " + b + ":00")
      }
      else {
        return ("0" + a + ":00 - 0" + b + ":00")
      }
    }

    //tulisan update device
    function update_name_device(a) {
      if (a === 1) {
        return "Updated"
      }
      else {
        return "Waiting for Updated"
      }
    }
    function update_classname_device(a) {
      if (a === 1) {
        return "backgroundhijau"
      }
      else {
        return "backgroundmerah"
      }
    }


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

                <div className="kotakinputruangandevice">
                  <label><b>Kode Device</b> </label> <br></br>
                  <input name="kodedevicec" onChange={this.handleChange} className="inputformfakultas" type="text" placeholder="Kode Device" required ></input>
                </div>

                <div className="kotakinputruanganruangan">
                  <label><b>Kode Ruangan</b> </label> <br></br>
                  <input name="koderuanganc" onChange={this.handleChange} className="inputformfakultas" type="text" placeholder="Kode Ruangan" required ></input>
                </div>

                <div className="kotakinputruanganalamat">
                  <label><b>Alamat</b> </label> <br></br>
                  <input name="alamatc" onChange={this.handleChange} className="inputformfakultas" type="text" placeholder="Alamat" required ></input>
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
        {state.daftarfilter &&
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

                <div className="kotakinputfilterruanganhari">
                  <label><b>Hari</b> </label> <br></br>
                  <input onChange={this.handleChange} className="inputfilterruangan" type="text" value={this.getHari(state.harifilterc) || ''} required ></input>
                </div>

                <div className="kotakinputfilterruanganjam">
                  <label><b>Jam</b> </label> <br></br>
                  <input onChange={this.handleChange} className="inputfilterruangan" type="text" value={this.getJam(state.jamfilterc) || ''} required ></input>
                </div>

                <div className="kotakinputfilterruangandurasi">
                  <label><b>Durasi</b> </label> <br></br>
                  <select name="durasifilterc" onChange={this.handleChange} className="inputfilterruangan" required>
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

                <div className="kotakinputfilterruangankodematkul">
                  <label><b>Kode Matakuliah</b> </label> <br></br>
                  <input name="kodematkulfilterc" onChange={this.getNameMatkulFilter} className="inputfilterruangan" type="text" placeholder="Kode Matkul..." required ></input>
                </div>

                <div className="kotakinputfilterruangannamamatkul">
                  <label><b>Nama Matakuliah</b> </label> <br></br>
                  <input onChange={this.handleChange} value={state.namamatkulfilterc || ''} className="inputfilterruangan" type="text" placeholder="Nama Matkul..." required ></input>
                </div>

                <div className="kotakinputfilterruangankelas">
                  <label><b>Kelas</b> </label> <br></br>
                  <input name="kelasfilterc" onChange={this.handleChange} className="inputfilterruangan" type="text" placeholder="Kelas..." required ></input>
                </div>

                <div className="kotaksubmitpenggunadaftar">
                  <input className="submitformlogpintu" type="submit" value="Add"></input>
                </div>

                <div className="kotakcancelpenggunadaftar">
                  <button className="buttonlikea" onClick={() => this.hideDaftarFilter()}> <span className="cancelformpengguna">Cancel</span></button>
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
                  <label><b>Kode Ruangan</b> </label> <br></br>
                  <input name="newkoderuangan" onChange={this.handleChange} className="inputformfakultas" type="text" placeholder="Kode Ruangan" value={state.newkoderuangan || ''} required ></input>
                </div>

                <div className="kotakinputjurusan">
                  <label><b>Alamat</b> </label> <br></br>
                  <input name="newalamat" onChange={this.handleChange} className="inputformfakultas" type="text" placeholder="Alamat" value={state.newalamat || ''} required ></input>
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
        {(state.daftar === false) && (state.edit === false) && (state.daftarfilter === false) &&
          <div className="kotakbagiandaftar">
            <div className="kotakdaftarruangan">
              <button className="buttonlikea" onClick={() => this.showRuangan("ruangan")}>
                <div className="daftar" style={{ width: "150px" }}>
                  <span><b>Daftar Ruangan</b></span>
                </div>
              </button>
            </div>
            {(state.pageshow === "ruangan") &&
              <div className="kotakdaftarruangan1">
                <button className="buttonlikea" onClick={() => this.showDaftar()}>
                  <div className="daftar">
                    <i className="fa fa-plus"></i>
                    <span><b>Ruangan</b></span>
                  </div>
                </button>
              </div>}
            <div className={stylefilterruangan}>
              <input name="koderuanganfilterc" style={{ width: "200px" }} onChange={this.handleChange} className="inputfilternim" type="text" placeholder="Masukkan Kode Ruangan..." value={state.koderuanganfilterc || ''} required ></input>
              <button className="buttonlikea" onClick={() => this.showFilterRuangan("filterruangan", state.koderuanganfilterc)}>
                <div className="tombolfilterpengguna" style={{ marginLeft: "230px" }}>
                  <i className="fa fa-search"></i>
                  <span><b>&nbsp;&nbsp;&nbsp;Mata Kuliah Ruangan</b></span>
                </div>
              </button>
            </div>
          </div>
        }
        {state.pageshow === "ruangan" &&
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
              <b>{state.rowCount}</b>
              <b>&nbsp;Data</b>
            </div>
            <div className="filtersearchlogpintu">
              <span><b>Search&nbsp;&nbsp;</b></span>
              <input name="search" onChange={this.handleFilter} className="inputfilterlogpintu" type="text" placeholder="search..." required></input>
            </div>
            <div className="marginbottom20px"></div>
            <div className="isitabel">
              <table className="tableruangan">
                <thead className="theadlog">
                  <tr>
                    <th className="koderuangan" onClick={() => this.filter(state.page, "kodedevice", state.ascdsc)}>Kode Device</th>
                    <th className="koderuangan" onClick={() => this.filter(state.page, "koderuangan", state.ascdsc)}>Kode Ruangan</th>
                    <th className="alamat" onClick={() => this.filter(state.page, "alamat", state.ascdsc)}>Alamat</th>
                    <th className="lastseen" onClick={() => this.filter(state.page, "lastseen", state.ascdsc)}>Terakhir Aktif</th>
                    <th className="status" onClick={() => this.filter(state.page, "lastseen", state.ascdsc)}>Status</th>
                    <th className="keteranganruangan">Keterangan</th>
                  </tr>
                </thead>
                {(state.datakosong === false) &&
                  <tbody className="tbodylog">
                    {state.data.map(isidata => (
                      <tr key={i++}>
                        <td>{isidata.kodedevice}</td>
                        <td>{isidata.koderuangan}</td>
                        <td>{isidata.alamat}</td>
                        <td>{Waktu(isidata.lastseen)}</td>
                        <td>{Status(isidata.lastseen)}</td>
                        <td>
                          <div>
                            <button className={update_classname_device(isidata.status)} onClick={() => this.updateDevice(isidata.kodedevice)}>{update_name_device(isidata.status)}</button>
                            &nbsp;
                        <button className="backgroundbiru" onClick={() => this.showEdit(isidata.kodedevice, isidata.koderuangan, isidata.alamat)} >
                              Edit
                        </button>
                            &nbsp;
                        <button className="backgroundmerah" onClick={() => this.deletePengguna(isidata.kodedevice)}>
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
                      <td colSpan="7">Data tidak ditemukan</td>
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
          </div>}


        {state.pageshow === "filterruangan" &&
          <div id={aksidata} className="kotakdata">
            <div>
              <span>Kode Ruangan: {state.koderuanganfilterc}</span>
              <div className="paddingtop30px"></div>
            </div>
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
                  {state.datafilterkosong === false &&
                    state.jam_masuk.map(isidata => (
                      <tr key={i++} className="tabletinggi">
                        <td className="tablewarnamerah">{jam(isidata, isidata + 1)}</td>
                        <td>{this.getDataMatkulHari(isidata, state.datafilterruangan, 1)}</td>
                        <td>{this.getDataMatkulHari(isidata, state.datafilterruangan, 2)}</td>
                        <td>{this.getDataMatkulHari(isidata, state.datafilterruangan, 3)}</td>
                        <td>{this.getDataMatkulHari(isidata, state.datafilterruangan, 4)}</td>
                        <td>{this.getDataMatkulHari(isidata, state.datafilterruangan, 5)}</td>
                        <td>{this.getDataMatkulHari(isidata, state.datafilterruangan, 6)}</td>
                        <td>{this.getDataMatkulHari(isidata, state.datafilterruangan, 7)}</td>
                      </tr>
                    ))}
                  {
                    state.datafilterkosong === true &&
                    <tr key={i++} className="tabletinggi">
                      <td colSpan="8">Ruangan tidak ditemukan</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default withRouter(Ruangan);