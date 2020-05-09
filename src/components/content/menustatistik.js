import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import StatistikMahasiswa from './statistik_mahasiswa';
import StatistikMatkul from './statistik_matkul';
import StatistikRuangan from './statistik_ruangan';
// import KonfigurasiStatistik from './konfigurasi_statistik';

class MenuStatistik extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ShowStatistikMahasiswa: true,
            ShowStatistikMatkul: false,
            ShowStatistikRuangan: false,
            ShowKonfigurasi: false,
        };
    }
    ShowStatistikMahasiswaNow() {
        this.setState({
            ShowStatistikMahasiswa: true,
            ShowStatistikMatkul: false,
            ShowStatistikRuangan: false,
            ShowKonfigurasi: false,
        })
    }
    ShowStatistikMatkulNow() {
        this.setState({
            ShowStatistikMahasiswa: false,
            ShowStatistikMatkul: true,
            ShowStatistikRuangan: false,
            ShowKonfigurasi: false,
        })
    }
    ShowStatistikRuanganNow() {
        this.setState({
            ShowStatistikMahasiswa: false,
            ShowStatistikMatkul: false,
            ShowStatistikRuangan: true,
            ShowKonfigurasi: false,
        })
    }
    ShowKonfigurasiNow() {
        this.setState({
            ShowStatistikMahasiswa: false,
            ShowStatistikMatkul: false,
            ShowStatistikRuangan: false,
            ShowKonfigurasi: true,
        })
    }
    render() {
        const state = this.state
        var stylestatistikmahasiswa, stylestatistikmatkul, stylestatistikruangan
        if (state.ShowStatistikMahasiswa) {
            stylestatistikmahasiswa = "menumatkuldipilih"
            stylestatistikmatkul = "menumatkultidakdipilih"
            stylestatistikruangan = "menumatkultidakdipilih"
            // stylekonfigurasi = "menumatkultidakdipilih"
        }
        else if (state.ShowStatistikMatkul){
            stylestatistikmahasiswa = "menumatkultidakdipilih"
            stylestatistikmatkul = "menumatkuldipilih"
            stylestatistikruangan = "menumatkultidakdipilih"
            // stylekonfigurasi = "menumatkultidakdipilih"
        }
        else if (state.ShowStatistikRuangan){
            stylestatistikmahasiswa = "menumatkultidakdipilih"
            stylestatistikmatkul = "menumatkultidakdipilih"
            stylestatistikruangan = "menumatkuldipilih"
            // stylekonfigurasi = "menumatkultidakdipilih"
        }
        else if (state.ShowKonfigurasi){
            stylestatistikmahasiswa = "menumatkultidakdipilih"
            stylestatistikmatkul = "menumatkultidakdipilih"
            stylestatistikruangan = "menumatkultidakdipilih"
            // stylekonfigurasi = "menumatkuldipilih"
        }
        return (
            <div>
                <div>
                    <div className="kotakmenumatkul">
                        <button className={stylestatistikmahasiswa} onClick={() => this.ShowStatistikMahasiswaNow()}>
                            <span>Mahasiswa</span>
                        </button>
                    </div>
                    <div className="kotakmenumatkulpengguna">
                        <button className={stylestatistikmatkul} onClick={() => this.ShowStatistikMatkulNow()}>
                            <span>Mata Kuliah</span>
                        </button>
                    </div>
                    <div className="kotakmenumatkulruangan">
                        <button className={stylestatistikruangan} onClick={() => this.ShowStatistikRuanganNow()}>
                            <span>Ruangan</span>
                        </button>
                    </div>
                    {/* <div className="kotakmenumatkulkonfigurasi">
                        <button className={stylekonfigurasi} onClick={() => this.ShowKonfigurasiNow()}>
                            <span>Pengaturan</span>
                        </button>
                    </div> */}
                </div>
                <div>
                    {
                        state.ShowStatistikMahasiswa &&
                        <StatistikMahasiswa />
                    }
                    {
                        state.ShowStatistikMatkul &&
                        <StatistikMatkul />
                    }
                    {
                        state.ShowStatistikRuangan &&
                        <StatistikRuangan />
                    }
                    {/* {
                        state.ShowKonfigurasi &&
                        <KonfigurasiStatistik />
                    } */}
                </div>
            </div>
        )
    }
}

export default withRouter(MenuStatistik);