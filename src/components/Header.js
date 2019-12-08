import React, {Component} from 'react';
import {Switch,Route,withRouter,Link} from 'react-router-dom';


class Header extends Component {
    isLogout(){
        sessionStorage.removeItem("name");
        window.location.reload()
    }
    render(){
        function Statistik(){
            return(<span><b>Statistik</b></span>)
        }
        function Log(){
            return(<span><b>Log</b></span>)
        }
        function Pengguna(){
            return(<span><b>Pengguna</b></span>)
        }
        function Ruangan(){
            return(<span><b>Ruangan</b></span>)
        }
        function Matakuliah(){
            return(<span><b>Mata kuliah</b></span>)
        }
        function Fakultas(){
            return(<span><b>Fakultas</b></span>)
        }
        function Laporan(){
            return(<span><b>Laporan</b></span>)
        }
        function Bantuan(){
            return(<span><b>Bantuan</b></span>)
        }
        function Home(){
            return(<span><b>Home</b></span>)
        }
        return (
            <header className="main-header">
                <Link to="/" className="logo">
                    <span className="logo-mini"><b>ITB</b></span>
                    <span className="logo-lg"><span>Institut Teknologi Bandung</span></span>
                </Link>
                <nav className="navbar navbar-static-top">
                    <a className="sidebar-toggle" data-toggle="push-menu" role="button"></a>
                    <span className="judulhalaman">
                        <Switch>
                            <Route path="/statistik" component={Statistik} />
                            <Route path="/log" component={Log} />
                            <Route path="/pengguna" component={Pengguna} />
                            <Route path="/ruangan" component={Ruangan} />
                            <Route path="/matakuliah" component={Matakuliah} />
                            <Route path="/fakultas" component={Fakultas} />
                            <Route path="/laporan" component={Laporan} />
                            <Route path="/bantuan" component={Bantuan} />
                            <Route exact path="/" component={Home} />
                        </Switch>
                        <span>
                            <a onClick={this.isLogout}>
                                <div className="kotaklogout">
                                    <i className="fa fa-share"></i> 
                                    <span>Log out</span>
                                </div>
                            </a>
                       </span>
                    </span>
                    
                </nav>
            </header>
        )
    }
}
export default withRouter(Header);