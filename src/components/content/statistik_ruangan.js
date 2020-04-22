import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Pie } from 'react-chartjs-2';

class StatistikRuangan extends Component {
    // spek : 
    // dapat melihat statistik telat pada ruangan tersebut pada semua jam pelajaran
    // dapat melihat statistik telat pada ruangan tersebut pada tiap jam 
    // setelah coba di css, di coba buat ukuran windownya diperkecil, buat biar halaman webnya responsive
    constructor(props) {
        super(props);
        this.state = {
            koderuangan: '',
            startDate: '',
            endDate: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitDaftar = this.handleSubmitDaftar.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmitDaftar(e) {
        e.preventDefault();
        const { koderuangan, startDate, endDate } = this.state
        console.log(koderuangan)
        console.log(startDate)
        console.log(endDate)
        // http request buat get data
        // buat backend sendiri
        // buat backend untuk semua kondisi (koderuangan ada atau engga, startdate ada atau engga, enddate ada atau engga)
    }

    render() {
        const Xvalue = ['Tidak Hadir', 'Hadir', 'Izin', 'Sakit']
        const Yvalue = [30, 500, 100, 20]
        const data = {
            labels: Xvalue,
            datasets: [
                {
                    data: Yvalue,
                    backgroundColor: [
                        'rgba(255,0,0,1)',
                        'blue',
                        'yellow',
                        'green'
                    ],
                },
            ],
        };
        const options = {
            maintainAspectRatio: false,
            responsive: false,
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 10
                }
            },
            title: {
                display: true,
                text: 'Kehadiran pada Mata Kuliah EL3000'
            }
        }
        return (
            <div>
                <div className="kotakfilter3">
                    <form className="kotakforminputlogpintu" onSubmit={this.handleSubmitDaftar}>
                        <div className="filterdatastatistik">
                            <label><b>Kode Ruangan</b> </label> <br></br>
                            <input name="koderuangan" onChange={this.handleChange} className="inputfiltertanggalawallog" type="text" required ></input>
                        </div>
                        <div className="filtertanggalawalstatistik">
                            <label><b>Tanggal Awal</b> </label> <br></br>
                            <input name="startDate" onChange={this.handleChange} className="inputfiltertanggalawallog" type="date" required ></input>
                        </div>
                        <div className="filtertanggalakhirstatistik">
                            <label><b>Tanggal Akhir</b> </label> <br></br>
                            <input name="endDate" onChange={this.handleChange} className="inputfiltertanggalawallog" type="date" required ></input>
                        </div>
                        <div className="kotaksubmitstatistik">
                            <input className="submitformstatistik" type="submit" value="Filter"></input> 
                        </div>
                    </form>
                </div>
                <div className="paddingtop30px2"></div>
                <div className="kotakdata">
                    <Pie
                        data={data}
                        width={200}
                        options={options}
                    />
                </div>
            </div>
        )
    }
}

export default withRouter(StatistikRuangan);