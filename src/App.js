import React, { Component } from 'react';
import Header from './components/Header';
import SideBar from './components/SideBar';
import Content from './components/Content';
import Login from './components/content/login';
import get from './components/content/config';
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import './components/content/css/AdminLTE.css';
import './components/content/css/_all-skins.min.css';
import './components/content/css/font-awesome.css';
import './components/content/css/font-awesome.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

class App extends Component {
  render() {
    //fungsi refresh token
    function refreshToken() {
      fetch(get.refreshtoken, {
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          old_access_token: sessionStorage.name,
        })
      })
        .then(response => response.json())
        .then(response => {
          if (response.status === 0) {
            sessionStorage.removeItem("name")
            window.location.reload()
          }
          else {
            sessionStorage.setItem("name", response.token)
          }
        })
        .catch(error => {
          sessionStorage.removeItem("name")
          window.location.reload()
        })
    }

    // kalau token ga ada
    if ((sessionStorage.name === "undefined") || (sessionStorage.name === undefined)) {
      return (
        <div>
          <Switch>
            <Route path="/login" component={Login} />
            <Redirect to="/login" />
          </Switch>
        </div>
      )
    }

    //kalau token ada
    else {
      //fungsi untuk memanggil refresh token 1 detik setelah ada sesuatu yang di klik
      setTimeout(function () { refreshToken() }, 1000)

      return (
        <div>
          <Route path="/" component={Header} />
          <Route path="/" component={SideBar} />
          <Route path="/" component={Content} />
        </div>
      )
    }
  }
}

export default withRouter(App);
// const data = {
    //   columns: [
    //     {
    //       label: 'NIM',
    //       field: 'nim',
    //       sort: 'asc',
    //     },
    //     {
    //       label: 'Nama',
    //       field: 'nama',
    //       sort: 'asc',
    //     },
    //     {
    //       label: 'ID Ruangan',
    //       field: 'idruangan',
    //       sort: 'asc',
    //     },
    //     {
    //       label: 'Nama Ruangan',
    //       field: 'namaruangan',
    //       sort: 'asc',
    //     },
    //     {
    //       label: 'Tanggal',
    //       field: 'tanggal',
    //       sort: 'asc',
    //     },
    //     {
    //       label: 'Waktu',
    //       field: 'waktu',
    //       sort: 'asc',
    //     },
    //     {
    //       label: 'Status',
    //       field: 'status',
    //       sort: 'asc',
    //     },
    //     {
    //       label: 'Method',
    //       field: 'method',
    //       sort: 'asc',
    //     }
    //   ],
    //   rows: this.state.isidata.map(isi=>{
    //     return {
    //       nim: isi.nim,
    //       nama: isi.nama,
    //       koderuangan: isi.kode_ruangan,
    //       namaruangan: isi.nama_ruangan,
    //       tanggal: tanggal(isi.date),
    //       waktu: waktu(isi.time),
    //       status: status(isi.status),
    //       method: method(isi.method),
    //     }
    //   })
    // };
// {/* <MDBDataTable
//             responsive
//             displayEntries={false}              
//             info={false}
//             paging={false}
//             info={false}
//             searching={false}
//             sortable={false}
//             striped
//             bordered
//             small
//             hover
//             theadColor={""}
//             data={data}
//             /> */}

// function timer(){
//   var today = new Date();
//   var Christmas = new Date("12-25-2019 01:01:01");
//   var diffMs = (Christmas - today); // milliseconds between now & Christmas
//   var diffDays = Math.floor(diffMs / 86400000); // days
//   var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
//   var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
//   var diffSecs = Math.round((((diffMs % 86400000) % 3600000) % 60000)/1000); // minutes
//   var a = (diffDays+" : "+diffHrs+" : "+diffMins+" : "+diffSecs)
//   console.log(a)
//   return a
// }

// var today = setInterval(() => {
//   timer()
// }, 1000);