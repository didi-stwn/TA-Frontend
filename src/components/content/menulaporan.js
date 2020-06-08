import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import LaporanMahasiswa from './laporan_mahasiswa';
import LaporanPengajar from './laporan_pengajar';
import get from './config';

class MenuLaporan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ShowLaporanMahasiswa: true,
            ShowLaporanPengajar: false,
        };
    }
    componentDidMount() {
        fetch(get.deleteduplicatelog, {
            method: 'delete',
            headers: {
                "x-access-token": sessionStorage.name,
                "Content-Type": "application/json"
            },
        })
            .then(response => response.json())
            .then(response => {
                //ga dapet token
                if ((response.status !== 1) && (response.status !== 0)) {
                    sessionStorage.removeItem("name")
                    window.location.reload()
                }
            })
            .catch(error => {
                sessionStorage.removeItem("name")
                window.location.reload()
            })
    }
    ShowLaporanMahasiswaNow() {
        this.setState({
            ShowLaporanMahasiswa: true,
            ShowLaporanPengajar: false,
        })
    }
    ShowLaporanPengajarNow() {
        this.setState({
            ShowLaporanMahasiswa: false,
            ShowLaporanPengajar: true,
        })
    }
    render() {
        const state = this.state
        var stylelaporanmahasiswa, stylelaporanpengajar
        if (state.ShowLaporanMahasiswa) {
            stylelaporanmahasiswa = "menumatkuldipilih"
            stylelaporanpengajar = "menumatkultidakdipilih"
        }
        else if (state.ShowLaporanPengajar){
            stylelaporanmahasiswa = "menumatkultidakdipilih"
            stylelaporanpengajar = "menumatkuldipilih"
        }
        return (
            <div>
                <div className="menulaporan">
                    <div className="kotakmenumatkul">
                        <button className={stylelaporanmahasiswa} onClick={() => this.ShowLaporanMahasiswaNow()}>
                            <span>Mahasiswa</span>
                        </button>
                    </div>
                    <div className="kotakmenumatkulpengguna">
                        <button className={stylelaporanpengajar} onClick={() => this.ShowLaporanPengajarNow()}>
                            <span>Pengajar</span>
                        </button>
                    </div>
                </div>
                <div>
                    {
                        state.ShowLaporanMahasiswa &&
                        <LaporanMahasiswa />
                    }
                    {
                        state.ShowLaporanPengajar &&
                        <LaporanPengajar />
                    }

                </div>
            </div>
        )
    }
}

export default withRouter(MenuLaporan);