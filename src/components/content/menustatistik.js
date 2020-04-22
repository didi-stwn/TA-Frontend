import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import StatistikMahasiswa from './statistik_mahasiswa';
import StatistikMatkul from './statistik_matkul';
import StatistikRuangan from './statistik_ruangan';

class MenuStatistik extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ShowStatistikMahasiswa: true,
            ShowStatistikMatkul: false,
            ShowStatistikRuangan: false,
        };
    }
    ShowStatistikMahasiswaNow() {
        this.setState({
            ShowStatistikMahasiswa: true,
            ShowStatistikMatkul: false,
            ShowStatistikRuangan: false,
        })
    }
    ShowStatistikMatkulNow() {
        this.setState({
            ShowStatistikMahasiswa: false,
            ShowStatistikMatkul: true,
            ShowStatistikRuangan: false,
        })
    }
    ShowStatistikRuanganNow() {
        this.setState({
            ShowStatistikMahasiswa: false,
            ShowStatistikMatkul: false,
            ShowStatistikRuangan: true,
        })
    }
    render() {
        const state = this.state
        var stylestatistikmahasiswa, stylestatistikmatkul, stylestatistikruangan
        if (state.ShowStatistikMahasiswa) {
            stylestatistikmahasiswa = "menumatkuldipilih"
            stylestatistikmatkul = "menumatkultidakdipilih"
            stylestatistikruangan = "menumatkultidakdipilih"
        }
        else if (state.ShowStatistikMatkul){
            stylestatistikmahasiswa = "menumatkultidakdipilih"
            stylestatistikmatkul = "menumatkuldipilih"
            stylestatistikruangan = "menumatkultidakdipilih"
        }
        else if (state.ShowStatistikRuangan){
            stylestatistikmahasiswa = "menumatkultidakdipilih"
            stylestatistikmatkul = "menumatkultidakdipilih"
            stylestatistikruangan = "menumatkuldipilih"
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

                </div>
            </div>
        )
    }
}

export default withRouter(MenuStatistik);