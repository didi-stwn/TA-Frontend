import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';

class StatistikMahasiswa extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nim: '',
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
        const { nim, startDate, endDate } = this.state
        console.log(nim)
        console.log(startDate)
        console.log(endDate)
        // http request untuk get data 
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
                            <label><b>NIM</b> </label> <br></br>
                            <input name="nim" onChange={this.handleChange} className="inputfiltertanggalawallog" type="text" required ></input>
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

export default withRouter(StatistikMahasiswa);