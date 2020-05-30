import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';


class Header extends Component {
    isLogout() {
        sessionStorage.removeItem("name");
        window.location.reload()
    }
    render() {
        function NameHeader() {
            if (window.location.pathname === "/statistik") {
                return (<span><b>Statistik</b></span>)
            }
            else if (window.location.pathname === "/log") {
                return (<span><b>Log</b></span>)
            }
            else if (window.location.pathname === "/mahasiswa") {
                return (<span><b>Mahasiswa</b></span>)
            }
            else if (window.location.pathname === "/dosen") {
                return (<span><b>Dosen</b></span>)
            }
            else if (window.location.pathname === "/ruangan") {
                return (<span><b>Ruangan</b></span>)
            }
            else if (window.location.pathname === "/matakuliah") {
                return (<span><b>Mata Kuliah</b></span>)
            }
            else if (window.location.pathname === "/fakultas") {
                return (<span><b>Fakultas</b></span>)
            }
            else if (window.location.pathname === "/laporan") {
                return (<span><b>Laporan</b></span>)
            }
            else if (window.location.pathname === "/about") {
                return (<span><b>About Me</b></span>)
            }
            else if (window.location.pathname === "/") {
                return (<span><b>Home</b></span>)
            }
            else {
                return (<span><b>NOT FOUND</b></span>)
            }
        }

        return (
            <header className="main-header">
                <Link to="/" className="logo">
                    <span className="logo-mini"><b>ITB</b></span>
                    <span className="logo-lg"><span>Institut Teknologi Bandung</span></span>
                </Link>
                <div className="navbar navbar-static-top">
                    <button style={{border:'none', backgroundColor:'transparant'}} className="sidebar-toggle" data-toggle="push-menu"></button>
                    <span className="judulhalaman">
                        {NameHeader()}
                        <button style={{float:'right'}} className="buttonlikea" onClick={this.isLogout}>
                            <div className="kotaklogout">
                                <i className="fa fa-share"></i>
                                <span>Log out</span>
                            </div>
                        </button>
                    </span>
                </div>
            </header>
        )
    }
}
export default withRouter(Header);