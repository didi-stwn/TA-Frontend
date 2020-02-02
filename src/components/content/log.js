import React,{Component} from 'react';
import {withRouter} from 'react-router-dom';
import get from './config';

class Log extends Component{
  constructor(props) {
    super(props);
    this.state = {
      //read
      sortby:'waktu',
      ascdsc:'desc',
      search:'',
      limit: 10,
      page: 1,
      startDateRead: null,
      endDateRead: null,
      rowCount:0,
      data: [],
      datakosong: false,
      daftar:false,

      //create
      waktuc:'',
      nimc:'',
      namac:'',
      koderuanganc:'',
      kodematkulc:'',
      kelasc:'',
      statusc:'Hadir',

      //delete
      startDateDelete:'',
      endDateDelete:'',
      
      //status add
      pesan:'',
      datasalah: false,
      databenar: false,
    };
    this.handleFilter = this.handleFilter.bind(this);
    this.filterName = this.filterName.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitDaftar = this.handleSubmitDaftar.bind(this);  
    this.handleSubmitDelete = this.handleSubmitDelete.bind(this);  
  }

  getData(startDateRead, endDateRead, sortby, ascdsc, search, limit, page){
    if ((startDateRead==null)&&(endDateRead==null)){
      var awal = null
      var akhir = null
    }
    else if ((startDateRead!=null)&&(endDateRead==null)){
      awal = startDateRead.replace("T"," ")+''
      akhir = null
    }
    else if ((startDateRead==null)&&(endDateRead!=null)){
      akhir = endDateRead.replace("T"," ")+''
      awal = null
    }
    else {
      awal = startDateRead.replace("T"," ")+''
      akhir = endDateRead.replace("T"," ")+''
    }
    if (awal==""){
      awal = null
      this.setState({startDateRead:null})
    }
    if (akhir==""){
      akhir = null
      this.setState({endDateRead:null})
    }
    fetch(get.readlog, {
      method: 'post',
      headers :{
        "x-access-token" : sessionStorage.name,
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        startDate: awal,
        endDate: akhir,
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
      if ((response.status===1)&&(response.count!==0)){
        this.setState({data:response.hasil})
        this.setState({rowCount:response.count})
        this.setState({datakosong:false})
      }
      else if ((response.status===1)&&(response.count===0)){
        this.setState({datakosong:true})
        this.setState({rowCount:response.count})
      }
      //ga dapet token
      else if ((response.status!==1)&&(response.status!==0)){
        sessionStorage.removeItem("name")
        window.location.reload()
      }
    })
  }
  
  handleFilter(e) {
    const {startDateRead, endDateRead, sortby, ascdsc, search, limit, page} = this.state 
    const { name, value } = e.target;
    this.setState({ [name]: value });
    if (name=="search"){
      var searching = value
      var max = limit
    }
    else if (name=="limit"){
      searching = search
      max = value
    }
    this.getData(startDateRead, endDateRead, sortby, ascdsc, searching, max, page)
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  filterName(e){
    const { name, value } = e.target;
    this.setState({ [name]: value });
    var lengthnama = value.length;
    if (lengthnama===8){
      fetch(get.readpengguna, {
        method: 'post',
        headers :{
          "x-access-token" : sessionStorage.name,
          "Content-Type" : "application/json"
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
        if ((response.status===1)&&(response.count==1)){
          this.setState({namac:response.hasil[0].nama})
        }
        else if ((response.status===1)&&(response.count!=1)){
          this.setState({namac:''})
        }
        //ga dapet token
        else if ((response.status!==1)&&(response.status!==0)){
          sessionStorage.removeItem("name")
          window.location.reload()
        }
      })
    }
    else{
      this.setState({namac:''})
    }
  }

  componentDidMount(){
    // const {startDateRead, endDateRead, sortby, ascdsc, search, limit, page} = this.state 
    // this.getData(startDateRead, endDateRead, sortby, ascdsc, search, limit, page)
    this.interval = setInterval(() => {
      const {startDateRead, endDateRead, sortby, ascdsc, search, limit, page} = this.state 
      this.getData(startDateRead, endDateRead, sortby, ascdsc, search, limit, page)      
    }, 2100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);  
  }

  filter(pagenow, sortbynow, ascdscnow){
    const {startDateRead, endDateRead, sortby, ascdsc, search, limit, page} = this.state 
    if (pagenow==page){
      if(sortbynow==sortby){
        if(ascdscnow=="asc"){
          ascdscnow="desc"
        }
        else if(ascdscnow=="desc"){
          ascdscnow="asc"
        }
      }
      else{
        ascdscnow="asc"
      }
    }
    this.setState({page:pagenow})
    this.setState({sortby:sortbynow})
    this.setState({ascdsc:ascdscnow})
    this.getData(startDateRead, endDateRead, sortbynow, ascdscnow, search, limit, pagenow)    
  }

  filterTanggal(){
    const{startDateRead, endDateRead, sortby, ascdsc, search, limit, page}=this.state
    this.getData(startDateRead, endDateRead, sortby, ascdsc, search, limit, page)
  }

  handleSubmitDaftar(e){
    e.preventDefault();
    const {waktuc,nimc,namac,koderuanganc,kodematkulc, kelasc ,statusc} = this.state;
    var time = waktuc.replace("T"," ")
    fetch(get.createlog, {
      method: 'post',
      headers :{
        "x-access-token" : sessionStorage.name,
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        waktu: time,
        nama: namac,
        nim: nimc,
        koderuangan: koderuanganc,
        kodematkul: kodematkulc,
        kelas: kelasc,
        status: statusc,
      })
    })
    .then(response => response.json())
    .then(response => {
      //berhasil add data
      if (response.status===1){
        this.setState({databenar:true})
        this.setState({datasalah:false})
        this.setState({pesan:response.pesan})
        setTimeout(this.componentDidMount(),1000)
      }
      //tidak berhasil add data
      else if (response.status===0){
        this.setState({databenar:false})
        this.setState({datasalah:true})
        this.setState({pesan:response.pesan})
      }
      //ga ada token
      else {
        sessionStorage.removeItem("name")
        window.location.reload()
      }
    })
  }

  handleSubmitDelete(e){
    e.preventDefault();
    const {startDateDelete, endDateDelete}=this.state
    var tanggalawal = new Date(startDateDelete).toLocaleDateString()
    var tanggalakhir = new Date(endDateDelete).toLocaleDateString()
    var yes = window.confirm("Apakah anda yakin ingin menghapus dari tanggal: "+ tanggalawal +" hingga tangga: "+tanggalakhir+"?");
    if (yes === true){
      var awal = startDateDelete.replace("T"," ")
      var akhir = endDateDelete.replace("T"," ")
      fetch(get.deletelog, {
        method: 'post',
        headers :{
          "Authorization" : sessionStorage.name,
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({
          startDate: awal,
          endDate: akhir
        })
      })
      .then(response => response.json())
      .then(response =>{
        // window.alert(response.pesan)
        setTimeout(this.componentDidMount(),1000)
      })
    }
  }

  showDaftar(){
    this.setState({daftar:true})
  }
  hideDaftar(){
    this.setState({daftar:false})
    this.setState({datasalah:false})
    this.setState({databenar:false})
    this.setState({namac:''})
    this.setState({statusc:'Hadir'})
  }  

  render(){
    const {namac, datakosong, rowCount, limit, page, daftar, databenar, pesan, datasalah, data, sortby, ascdsc} = this.state

    function waktu(t){
      var tahun,bulan,tanggal,jam,menit,tgl,j,m,date,d,detik;
      date = new Date (t)
      tahun = String(date.getFullYear())
      var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
      bulan = months[(date.getMonth())]
      tgl = date.getDate()
      if (tgl <=9){
        tanggal = "0"+String(tgl)
      }
      else {
        tanggal = String(tgl)
      }
      j = date.getHours()
      if (j<=9){
        jam = "0"+String(j)
      }
      else {
        jam = String(j)
      }
      m = date.getMinutes()
      if (m<=9){
        menit = "0"+String(m)
      }
      else {
        menit = String(m)
      }
      d = date.getSeconds()
      if (d<=9){
        detik = "0"+String(d)
      }
      else {
        detik = String(d)
      }
      return bulan+" "+tanggal+", "+tahun+" "+jam+":"+menit+":"+detik
    } 

    //setting tombol berikutnya and sebelumnya
    var maxPage=parseInt(rowCount/limit);
    if ((rowCount%limit)!==0){
      maxPage = maxPage+1
    }
    var showNext = false;
    var showPrevious = false;
    // deteksi page pertama
    if (page===1){
      showPrevious = false;
      if (page===maxPage){
        showNext = false;
      }
      else {
        showNext = true;
      }
    }
    // deteksi page terakhir
    else if (page===maxPage){
      showPrevious = true;
      showNext = false;
    }
    //deteksi page ditengah
    else {
      showPrevious = true;
      showNext = true;
    }

    var aksidata
    if (daftar===true){
      aksidata = "show"
    }
    else {
      aksidata = "hide"
    }
    var i=1;
    return(
      <div>
        {
          daftar &&
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
                <div className="kotakinputlogpintunim">
                  <label> <b>NIM</b> </label> <br></br>
                  <input name="nimc" onChange={this.filterName} className="inputformlogpintunim" type="text" placeholder="NIM" required ></input>
                </div>

                <div className="kotakinputlogpintunama">
                  <label> <b>Nama</b> </label> <br></br>
                  <input onChange={this.handleChange} className="inputformlogpintunim" type="text" placeholder="Nama" defaultValue={namac} required ></input>
                </div>
                      
                <div className="kotakinputlogpinturuangan">
                  <label><b>Ruangan</b> </label> <br></br>
                  <input name="koderuanganc" onChange={this.handleChange} className="inputformlogpintunim" type="text" placeholder="Ruangan" required ></input>
                </div>

                <div className="kotakinputlogpintumatkul">
                  <label><b>Mata Kuliah</b> </label> <br></br>
                  <input name="kodematkulc" onChange={this.handleChange} className="inputformlogpintunim" type="text" placeholder="Kode Matkul" required ></input>
                </div>

                <div className="kotakinputlogpintukelas">
                  <label><b>Kelas</b> </label> <br></br>
                  <input name="kelasc" onChange={this.handleChange} className="inputformlogpintunim" type="text" placeholder="kelas" required ></input>
                </div>                

                <div className="kotakinputlogpintucheckedtm">
                  <label> <b>Waktu dan Tanggal</b>  </label> <br></br>
                  <input name="waktuc" onChange={this.handleChange} className="inputformlogpintucheckedtm" type="datetime-local" required></input>
                </div> 
                      
                <div className="kotakinputlogpintustatus">
                  <label> <b>Status</b> </label> <br></br>
                  <select name="statusc" onChange={this.handleChange} className="inputformlogpintustatus" required>
                    <option value="Hadir"> Hadir</option>
                    <option value="Izin"> Izin </option>
                    <option value="Sakit"> Sakit </option>
                  </select>
                </div>

                <div className="kotaksubmitpengguna2">
                  <input className="submitformlogpintu" type="submit" value="Add"></input>
                </div>

                <div className="kotakcancelpengguna2">
                  <a onClick={() => this.hideDaftar()}> <span className="cancelformpengguna">Cancel</span></a>
                </div>
              </form> 
            </div>
          </div>
        }
        { (daftar===false)&& 
        <div>
          <div className="kotakdaftarruangan">
            <a onClick={() => this.showDaftar()}>
              <div className="daftar">
                <i className="fa fa-plus"></i> 
                <span><b>Log</b></span>
              </div>
            </a>
          </div>
          <div>
            <div className="filtertanggallogpintu">
              <div className="filtertanggalawallog">
                  <label><b>Tanggal Awal</b> </label> <br></br>
                  <input name="startDateRead" onChange={this.handleChange} className="inputfiltertanggalawallog" type="datetime-local" required ></input>
                </div>
                <div className="filtertanggalakhirlog">
                  <label><b>Tanggal Akhir</b> </label> <br></br>
                  <input name="endDateRead" onChange={this.handleChange} className="inputfiltertanggalawallog" type="datetime-local" required ></input>
                </div>
                <div className="filtertanggallog">
                  <input className="submitfiltertanggallog" type="submit" value="Filter" onClick={() => this.filterTanggal()}></input>
                </div>
              </div>
              <form onSubmit={this.handleSubmitDelete}>
                <div className="hapustanggallogpintu">
                  <div className="hapustanggalawallog">
                    <label><b>Tanggal Awal</b> </label> <br></br>
                    <input name="startDateDelete" onChange={this.handleChange} className="inputfiltertanggalawallog" type="datetime-local" placeholder="Terminal Id" required ></input>
                  </div>
                  <div className="hapustanggalakhirlog">
                    <label><b>Tanggal Akhir</b> </label> <br></br>
                    <input name="endDateDelete" onChange={this.handleChange} className="inputfiltertanggalawallog" type="datetime-local" placeholder="Terminal Id" required ></input>
                  </div>
                  <div className="hapustanggallog">
                    <input className="submitfiltertanggallog" type="submit" value="Hapus" ></input>
                  </div>
                </div>
              </form>
            </div>
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
            <table className="tablelog">
              <thead className="theadlog">
                <tr>
                  <th className="waktu" onClick={() => this.filter(page, "waktu", ascdsc)}>Waktu</th>
                  <th className="nim" onClick={() => this.filter(page, "nim", ascdsc)}>NIM</th>
                  <th className="nama" onClick={() => this.filter(page, "nama", ascdsc)}>Nama</th>
                  <th className="ruangan" onClick={() => this.filter(page, "koderuangan", ascdsc)}>Kode Ruangan</th>
                  <th className="matkul" onClick={() => this.filter(page, "kodematkul", ascdsc)}>Kode Mata Kuliah</th>
                  <th className="kelas" onClick={() => this.filter(page, "kelas", ascdsc)}>Kelas</th>
                  <th className="status" onClick={() => this.filter(page, "status", ascdsc)}>Status</th>
                </tr>
              </thead>
              {(datakosong === false)&&
              <tbody className="tbodylog">
                {data.map(isidata => (
                  <tr key={i++}>
                    <td>{waktu(isidata.waktu)}</td>
                    <td>{isidata.nim}</td>
                    <td>{isidata.nama}</td>
                    <td>{isidata.koderuangan}</td>
                    <td>{isidata.kodematkul}</td>
                    <td>{isidata.kelas}</td>
                    <td>{isidata.status}</td>
                  </tr>
                ))}
              </tbody>}
              {(datakosong===true) && 
              <tbody className="tbodylog">
                  <tr>
                    <td colSpan="6">Data tidak ditemukan</td>
                  </tr>
              </tbody>}
            </table>
          </div> 
          <div className="marginbottom20px"></div>
          <div className="pagedata">
            { showPrevious&& 
              <button className="pagesebelumnya" onClick={() => this.filter((page-1),sortby,ascdsc)}>≪ Sebelumnya</button>
            }
            { (showPrevious===false)&& 
              <button className="pagesebelumnyanone">≪ Sebelumnya</button>
            }
            {
              showNext&&
              <button className="pageberikutnya" onClick={() => this.filter((page+1),sortby,ascdsc)}>Berikutnya ≫</button>
            }
            {
              (showNext===false)&&
              <button className="pageberikutnyanone">Berikutnya ≫</button>
            }
          </div>
        </div>
      </div>
    )
  } 
}

export default withRouter(Log);
