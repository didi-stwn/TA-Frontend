import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import LaporanMahasiswa from './laporan_mahasiswa';
import LaporanPengajar from './laporan_pengajar';

class MenuLaporan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ShowLaporanMahasiswa: true,
            ShowLaporanPengajar: false,
        };
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
                <div>
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