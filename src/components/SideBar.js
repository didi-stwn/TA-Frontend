import React, {Component} from 'react';
import logo from './content/img/logo.png';
import {Link,withRouter} from 'react-router-dom';

class SideBar extends Component {
    render(){
        var statistik=false
        var log=false
        var mahasiswa=false
        var dosen=false
        var ruangan=false
        var matakuliah=false
        var fakultas=false
        var laporan=false
        var about=false

        if (window.location.pathname==="/statistik"){
            statistik=true
        }
        else if (window.location.pathname==="/log"){
            log=true
        }
        else if (window.location.pathname==="/mahasiswa"){
            mahasiswa=true
        }
        else if (window.location.pathname==="/ruangan"){
            ruangan=true
        }
        else if (window.location.pathname==="/matakuliah"){
            matakuliah=true
        }
        else if (window.location.pathname==="/fakultas"){
            fakultas=true
        }
        else if (window.location.pathname==="/laporan"){
            laporan=true
        }
        else if (window.location.pathname==="/about"){
            about=true
        }
        else if (window.location.pathname==="/dosen"){
            dosen=true
        }
        return (
            <div className="main-sidebar">
                <div className="backgroundsidebar"></div>
                <div className="backgroundsidebarlogoitb"></div>
                <div className="sidebar">
                    <div>
                        <div>
                            <div className="margin10px">
                            </div>
                            <div className="user-panel">
                                <div className="pull-left image">                                        
                                    <img src={logo} className="img-circle" alt="User" />
                                </div>
                                <div className="pull-left info">
                                    <p className="tulisanadmin">ADMIN</p>
                                </div>
                            </div>
                        </div>
                        <div className="scrollsidebar">
                            <ul className="sidebar-menu">
                                <div className="garissidebar">
                                </div>
                                <li>
                                    {   
                                        (statistik) &&
                                        <Link to="/statistik" className="dipilih" >
                                            <i className="fa fa-bar-chart"></i>
                                            <span>Statistik</span>
                                        </Link>
                                    }
                                    {
                                        (statistik===false) &&
                                        <Link to="/statistik">
                                            <i className="fa fa-bar-chart"></i>
                                            <span>Statistik</span>
                                        </Link>
                                    }
                                </li>
                                <li>
                                    {   
                                        (log) &&
                                        <Link to="/log" className="dipilih" >
                                            <i className="fa fa-check-square"></i>
                                            <span>Riwayat Kehadiran</span>
                                        </Link>
                                    }
                                    {
                                        (log===false) &&
                                        <Link to="/log">
                                            <i className="fa fa-check-square"></i>
                                            <span>Riwayat Kehadiran</span>
                                        </Link>
                                    }
                                </li>
                                <li>
                                    {
                                        mahasiswa &&
                                        <Link to="/mahasiswa" className="dipilih">
                                            <i className="fa fa-users"></i> 
                                            <span>Mahasiswa</span>
                                        </Link>
                                    }
                                    {
                                        (mahasiswa===false)&&
                                        <Link to="/mahasiswa">
                                            <i className="fa fa-users"></i> 
                                            <span>Mahasiswa</span>
                                        </Link>
                                    }
                                    
                                </li>
                                <li>
                                    {
                                        dosen &&
                                        <Link to="/dosen" className="dipilih">
                                            <i className="fa fa-user"></i> 
                                            <span>Dosen</span>
                                        </Link>
                                    }
                                    {
                                        (dosen===false)&&
                                        <Link to="/dosen">
                                            <i className="fa fa-user"></i> 
                                            <span>Dosen</span>
                                        </Link>
                                    }
                                    
                                </li>
                                <li>
                                    {
                                        ruangan &&
                                        <Link to="/ruangan" className="dipilih">
                                            <i className="fa fa-home"></i>
                                            <span>Ruangan</span>
                                        </Link>
                                    }
                                    {
                                        (ruangan===false) &&
                                        <Link to="/ruangan">
                                            <i className="fa fa-home"></i>
                                            <span>Ruangan</span>
                                        </Link>
                                    }
                                </li>
                                <li>
                                    {
                                        matakuliah &&
                                        <Link to="/matakuliah" className="dipilih">
                                            <i className="fa fa-book"></i> 
                                            <span>Mata Kuliah</span>
                                        </Link>
                                    }
                                    {
                                        (matakuliah===false) &&
                                        <Link to="/matakuliah">
                                            <i className="fa fa-book"></i> 
                                            <span>Mata Kuliah</span>
                                        </Link>
                                    }
                                </li>
                                <li>
                                    {
                                        fakultas &&
                                        <Link to="/fakultas" className="dipilih">
                                            <i className="fa fa-institution"></i> 
                                            <span>Fakultas</span>
                                        </Link>
                                    }
                                    {
                                        (fakultas===false) &&
                                        <Link to="/fakultas">
                                            <i className="fa fa-institution"></i> 
                                            <span>Fakultas</span>
                                        </Link>
                                    }
                                </li>
                                <li>
                                    {
                                        laporan &&
                                        <Link to="/laporan" className="dipilih">
                                            <i className="fa fa-file-text"></i> 
                                            <span>Laporan</span>
                                        </Link>
                                    }
                                    {
                                        (laporan===false) &&
                                        <Link to="/laporan">
                                            <i className="fa fa-file-text"></i> 
                                            <span>Laporan</span>
                                        </Link>
                                    }
                                </li>
                                <li>
                                    {
                                        about &&
                                        <Link to="/about" className="dipilih">
                                            <i className="fa fa-info"></i> 
                                            <span>About</span>
                                        </Link>
                                    }
                                    {
                                        (about===false) &&
                                        <Link to="/about">
                                            <i className="fa fa-info"></i> 
                                            <span>About</span>
                                        </Link>
                                    }
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div> 
        )
    }
}

export default withRouter(SideBar);
