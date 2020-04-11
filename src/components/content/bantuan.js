import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';

class Bantuan extends Component {
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
                text: 'Kehadiran Mahasiswa Pada matkul EL3000'
            }
        }
        return (
            <div>
                <div>
                    <div>
                        <Pie
                            data={data}
                            width={200}
                            options={options}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Bantuan);