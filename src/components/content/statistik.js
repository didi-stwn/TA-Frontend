import React,{Component} from 'react';
import {withRouter} from 'react-router-dom'
import Chart from 'react-google-charts';

class Statistik extends Component{
    render(){
        return (
        <div>
            <div>
                <div>
                    <a>
                        <div className="statistiknim">
                            <span><b>NIM</b></span>
                        </div>
                    </a>
                </div>
                <div>
                    <a>
                        <div className="statistikmatakuliah">
                            <span><b>Mata Kuliah</b></span>
                        </div>
                    </a>
                </div>
                <div>
                    <a>
                        <div className="statistikruangan">
                            <span><b>Ruangan</b></span>
                        </div>
                    </a>
                </div>
            </div>
            <div className="paddingtop30px"></div>
            
            <div>
                <div className="filterdatastatistik">
                    <label><b>Ruangan</b> </label> <br></br>
                    <input name="startDateRead" onChange={this.handleChange} className="inputfiltertanggalawallog" type="text" required ></input>
                </div>
                <div className="filtertanggalawalstatistik">
                    <label><b>Tanggal Awal</b> </label> <br></br>
                    <input name="startDateRead" onChange={this.handleChange} className="inputfiltertanggalawallog" type="date" required ></input>
                </div>
                <div className="filtertanggalakhirstatistik">
                    <label><b>Tanggal Akhir</b> </label> <br></br>
                    <input name="endDateRead" onChange={this.handleChange} className="inputfiltertanggalawallog" type="date" required ></input>
                </div>
                <div className="filterstatistik">
                    <input className="submitfiltertanggallog" type="submit" value="Filter" onClick={() => this.filterTanggal()}></input>
                </div>
            </div>
            <div className="paddingtop30px"></div>
            <div className="kotakdata"> 
                <div className="texttengah" style={{width:'100%'}}>
                    <Chart
                    width={'600px'}
                    height={'250px'}
                    chartType="PieChart"
                    loader={<div>Loading ...</div>}
                    data={[
                        ['Status', 'Persentase'],
                        ['Hadir Terlambat', 83],
                        ['Hadir Tepat Waktu', 5],
                    ]}
                    options={{
                        title: 'Persentase Kehadiran dari 1 Januari 2019 - 6 Juni 2019',
                        // sliceVisibilityThreshold: 0.2, // 20%
                    }}
                    rootProps={{ 'data-testid': '7' }}
                    />
                </div>
                <div className="texttengah" style={{overflowX:'scroll', width:'100%'}}>
                    <div>
                    <Chart
                        width={'200px'}
                        height={'100px'}
                        chartType="PieChart"
                        loader={<div>Loading ...</div>}
                        data={[
                            ['Status', 'Persentase'],
                            ['Hadir', 3],
                            ['Izin', 5],
                            ['Sakit', 9],
                            ['Tidak Hadir', 10], // Below limit.
                        ]}
                        options={{
                            title: 'Persentase Kehadiran EL4125',
                            // sliceVisibilityThreshold: 0.2, // 20%
                        }}
                        rootProps={{ 'data-testid': '7' }}
                        />
                    </div>
                    <div>
                    <Chart
                        width={'200px'}
                        height={'100px'}
                        chartType="PieChart"
                        loader={<div>Loading ...</div>}
                        data={[
                            ['Status', 'Persentase'],
                            ['Hadir', 3],
                            ['Izin', 5],
                            ['Sakit', 9],
                            ['Tidak Hadir', 10], // Below limit.
                        ]}
                        options={{
                            title: 'Persentase Kehadiran EL4126',
                            // sliceVisibilityThreshold: 0.2, // 20%
                        }}
                        rootProps={{ 'data-testid': '7' }}
                        />
                    </div>
                    <div>
                    <Chart
                        width={'200px'}
                        height={'100px'}
                        chartType="PieChart"
                        loader={<div>Loading ...</div>}
                        data={[
                            ['Status', 'Persentase'],
                            ['Hadir', 3],
                            ['Izin', 5],
                            ['Sakit', 9],
                            ['Tidak Hadir', 10], // Below limit.
                        ]}
                        options={{
                            title: 'Persentase Kehadiran  EL4127',
                            // sliceVisibilityThreshold: 0.2, // 20%
                        }}
                        rootProps={{ 'data-testid': '7' }}
                        />
                    </div>
                    <div>
                    <Chart
                        width={'200px'}
                        height={'100px'}
                        chartType="PieChart"
                        loader={<div>Loading ...</div>}
                        data={[
                            ['Status', 'Persentase'],
                            ['Hadir', 3],
                            ['Izin', 5],
                            ['Sakit', 9],
                            ['Tidak Hadir', 10], // Below limit.
                        ]}
                        options={{
                            title: 'Persentase Kehadiran EL4128',
                            // sliceVisibilityThreshold: 0.2, // 20%
                        }}
                        rootProps={{ 'data-testid': '7' }}
                        />
                    </div>
                    <div>
                    <Chart
                        width={'200px'}
                        height={'100px'}
                        chartType="PieChart"
                        loader={<div>Loading ...</div>}
                        data={[
                            ['Status', 'Persentase'],
                            ['Hadir', 3],
                            ['Izin', 5],
                            ['Sakit', 9],
                            ['Tidak Hadir', 10], // Below limit.
                        ]}
                        options={{
                            title: 'Persentase Kehadiran EL4128',
                            // sliceVisibilityThreshold: 0.2, // 20%
                        }}
                        rootProps={{ 'data-testid': '7' }}
                        />
                    </div>
                    <div>
                    <Chart
                        width={'200px'}
                        height={'100px'}
                        chartType="PieChart"
                        loader={<div>Loading ...</div>}
                        data={[
                            ['Status', 'Persentase'],
                            ['Hadir', 3],
                            ['Izin', 5],
                            ['Sakit', 9],
                            ['Tidak Hadir', 10], // Below limit.
                        ]}
                        options={{
                            title: 'Persentase Kehadiran EL4129',
                            // sliceVisibilityThreshold: 0.2, // 20%
                        }}
                        rootProps={{ 'data-testid': '7' }}
                        />
                    </div>
                </div>
                {/* <span>Kehadiran Mahasiswa dari 1 Januari 2019 - 6 Juni 2019</span>
                <table className="tablelog">
                    <thead className="theadlog">
                        <tr>
                        <th className="waktu">NIM</th>
                        <th className="nama" >Nama</th>
                        <th className="ruangan" >hadir</th>
                        <th className="ruangan" >Sakit</th>
                        <th className="ruangan" >Izin</th>
                        <th className="ruangan">Alfa</th>
                        <th className="ruangan" >Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{textAlign:'center'}}>
                            <td>132116108</td>
                            <td>Didi Setiawan</td>
                            <td>30</td>
                            <td>3</td>
                            <td>4</td>
                            <td>6</td>
                            <td className="backgroundmerah">Warning</td>
                        </tr> 
                        <tr style={{textAlign:'center'}}>
                            <td>132116105</td>
                            <td>Jason William Chandra</td>
                            <td>30</td>
                            <td>4</td>
                            <td>4</td>
                            <td>4</td>
                            <td className="backgroundmerah">Warning</td>
                        </tr> 
                        <tr style={{textAlign:'center'}}>
                            <td>132116008</td>
                            <td>Maurizfa</td>
                            <td>30</td>
                            <td>3</td>
                            <td>3</td>
                            <td>3</td>
                            <td className="backgroundkuning">Warning</td>
                        </tr> 
                        <tr style={{textAlign:'center'}}>
                            <td>132116200</td>
                            <td>Michael</td>
                            <td>30</td>
                            <td>3</td>
                            <td>3</td>
                            <td>2</td>
                            <td className="backgroundkuning">Warning</td>
                        </tr> 
                        <tr style={{textAlign:'center'}}>
                            <td>132116208</td>
                            <td>Dedi Setiawan</td>
                            <td>30</td>
                            <td>1</td>
                            <td>1</td>
                            <td>5</td>
                            <td className="backgroundkuning">Warning</td>
                        </tr> 
                        <tr style={{textAlign:'center'}}>
                            <td>132116190</td>
                            <td>Antonius</td>
                            <td>30</td>
                            <td>2</td>
                            <td>2</td>
                            <td>3</td>
                            <td className="backgroundkuning">Warning</td>
                        </tr> 
                        <tr style={{textAlign:'center'}}>
                            <td>132116000</td>
                            <td>Dudi Setiawan</td>
                            <td>30</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td className="backgroundhijau">Aman</td>
                        </tr> 
                        <tr style={{textAlign:'center'}}>
                            <td>132116188</td>
                            <td>Dodi Setiawan</td>
                            <td>30</td>
                            <td>1</td>
                            <td>1</td>
                            <td>0</td>
                            <td className="backgroundhijau">Aman</td>
                        </tr> 
                        <tr style={{textAlign:'center'}}>
                            <td>132116178</td>
                            <td>William</td>
                            <td>30</td>
                            <td>0</td>
                            <td>0</td>
                            <td>0</td>
                            <td className="backgroundhijau">Aman</td>
                        </tr> 
                    </tbody>
                </table> */}
            </div>
        </div>
        )
    } 
}

export default withRouter(Statistik);