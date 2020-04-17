import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Matakuliah from './matakuliah';
import FilterMatkulPengguna from './filter_matkul_pengguna';
import FilterMatkulRuangan from './filter_matkul_ruangan';

class MenuMatkul extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ShowMatkul: true,
            ShowMatkulPengguna: false,
            ShowMatkulRuangan: false,
        };
    }
    ShowMatkulNow() {
        this.setState({
            ShowMatkul: true,
            ShowMatkulPengguna: false,
            ShowMatkulRuangan: false
        })
    }
    ShowMatkulPenggunaNow() {
        this.setState({
            ShowMatkul: false,
            ShowMatkulPengguna: true,
            ShowMatkulRuangan: false
        })
    }
    ShowMatkulRuanganNow() {
        this.setState({
            ShowMatkul: false,
            ShowMatkulPengguna: false,
            ShowMatkulRuangan: true
        })
    }
    render() {
        const state = this.state
        var stylematkul, stylematkulpengguna, stylematkulruangan
        if (state.ShowMatkul) {
            stylematkul = "menumatkuldipilih"
            stylematkulpengguna = "menumatkultidakdipilih"
            stylematkulruangan = "menumatkultidakdipilih"
        }
        else if (state.ShowMatkulPengguna){
            stylematkul = "menumatkultidakdipilih"
            stylematkulpengguna = "menumatkuldipilih"
            stylematkulruangan = "menumatkultidakdipilih"
        }
        else if (state.ShowMatkulRuangan){
            stylematkul = "menumatkultidakdipilih"
            stylematkulpengguna = "menumatkultidakdipilih"
            stylematkulruangan = "menumatkuldipilih"
        }
        return (
            <div>
                <div>
                    <div className="kotakmenumatkul">
                        <button className={stylematkul} onClick={() => this.ShowMatkulNow()}>
                            <span>Matakuliah</span>
                        </button>
                    </div>
                    <div className="kotakmenumatkulpengguna">
                        <button className={stylematkulpengguna} onClick={() => this.ShowMatkulPenggunaNow()}>
                            <span>Pengguna Matakuliah</span>
                        </button>
                    </div>
                    <div className="kotakmenumatkulruangan">
                        <button className={stylematkulruangan} onClick={() => this.ShowMatkulRuanganNow()}>
                            <span>Ruangan Matakuliah</span>
                        </button>
                    </div>
                </div>
                <div>
                    {
                        state.ShowMatkul &&
                        <Matakuliah />
                    }
                    {
                        state.ShowMatkulPengguna &&
                        <FilterMatkulPengguna />
                    }
                    {
                        state.ShowMatkulRuangan &&
                        <FilterMatkulRuangan />
                    }

                </div>
            </div>
        )
    }
}

export default withRouter(MenuMatkul);