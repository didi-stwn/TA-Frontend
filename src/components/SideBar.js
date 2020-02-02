import React, {Component} from 'react';
import logo from './content/img/logo.png';
import {Link,withRouter} from 'react-router-dom';

class SideBar extends Component {
    render(){
        var statistik=false
        var log=false
        var pengguna=false
        var ruangan=false
        var matakuliah=false
        var fakultas=false
        var laporan=false
        var bantuan=false

        if (window.location.pathname==="/statistik"){
            statistik=true
        }
        else if (window.location.pathname==="/log"){
            log=true
        }
        else if (window.location.pathname==="/pengguna"){
            pengguna=true
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
        else if (window.location.pathname==="/bantuan"){
            bantuan=true
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
                                    <img src={logo} className="img-circle" alt="User Image" />
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
                                            <span>Log Kehadiran</span>
                                        </Link>
                                    }
                                    {
                                        (log===false) &&
                                        <Link to="/log">
                                            <i className="fa fa-check-square"></i>
                                            <span>Log Kehadiran</span>
                                        </Link>
                                    }
                                </li>
                                <li>
                                    {
                                        pengguna &&
                                        <Link to="/pengguna" className="dipilih">
                                            <i className="fa fa-users"></i> 
                                            <span>Pengguna</span>
                                        </Link>
                                    }
                                    {
                                        (pengguna===false)&&
                                        <Link to="/pengguna">
                                            <i className="fa fa-users"></i> 
                                            <span>Pengguna</span>
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
                                        bantuan &&
                                        <Link to="/bantuan" className="dipilih">
                                            <i className="fa fa-question"></i> 
                                            <span>Bantuan</span>
                                        </Link>
                                    }
                                    {
                                        (bantuan===false) &&
                                        <Link to="/bantuan">
                                            <i className="fa fa-question"></i> 
                                            <span>Bantuan</span>
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