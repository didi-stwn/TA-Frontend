import React,{Component} from 'react';
import Pdf from "react-to-pdf"
import ReactExport from "react-data-export";
import {withRouter} from 'react-router-dom';
import get from './config';


class Laporan extends Component{
    constructor(props) {
        super(props);
        this.state = {
            sort:'date',
            ascdsc:'asc',
            pagesize: null,
            pagee: 1,
            startDate: '',
            endDate: '',
            nim: '',
            isidata: [],
            nimuser:'',
            namauser:'',
            ruanganuser:'',
            getRangeDate: [],
            isFind:false,
            datasalah: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleChange(e) {
            const { name, value } = e.target;
            this.setState({ [name]: value });
        }
        
        handleSubmit(e){
            e.preventDefault();
        
            const {sort,ascdsc,pagesize,pagee,startDate,endDate,nim} = this.state

            var filterstart,filterend,startDatee,endDatee,starttahun,startbulan,sb,starttanggal,st,endtahun,endbulan,eb,endtanggal,et
            startDatee=new Date(startDate)
            starttahun=startDatee.getFullYear()
            sb=startDatee.getMonth()+1
            if (sb<=9){
            startbulan="0"+String(sb)
            }
            else {
            startbulan=String(sb)
            }
            st=startDatee.getDate()
            if (st<=9){
            starttanggal="0"+String(st)
            }
            else {
            starttanggal=String(st)
            }
            filterstart=starttahun+"-"+startbulan+"-"+starttanggal;
            
            endDatee= new Date(endDate)
            endtahun=endDatee.getFullYear()
            eb=endDatee.getMonth()+1
            if (eb<=9){
            endbulan="0"+String(eb)
            }
            else {
            endbulan=String(eb)
            }
            et=endDatee.getDate()
            if (et<=9){
            endtanggal="0"+String(et)
            }
            else {
            endtanggal=String(et)
            }
            filterend=endtahun+"-"+endbulan+"-"+endtanggal;
            
            fetch(get.listlog, {
            method: 'post',
            headers :{
                "Authorization" : "Bearer "+ sessionStorage.name,
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                sort_by: sort,
                ascordsc: ascdsc,
                page_size: pagesize,
                page: pagee,
                date_start: filterstart,
                date_end: filterend,
                search: nim
            })
            })
            .then (response =>response.json())  
            .then (response =>{ 
                if (response.detail==="Authentication credentials were not provided."){
                    sessionStorage.removeItem("name")
                }
                else if (response.list.length===0){
                    this.setState({datasalah:true})
                    this.setState({isFind:false})
                }
                else if (response.list!==undefined){
                    this.setState({isFind:true})
                    this.setState({nimuser:response.list[0].nim})
                    this.setState({namauser:response.list[0].nama})
                    this.setState({ruanganuser:response.list[0].nama_ruangan})
                    this.setState({isidata:response.list})
                    this.setState({datasalah:false})
                }
            })

            function getDateArray(start, end) {
                var hasil = [];
                var startdatee = new Date(start);
                var enddatee = new Date(end);
                while (startdatee <= enddatee) {
                    hasil.push(new Date(startdatee));
                    startdatee.setDate(startdatee.getDate() + 1);
                }
                return hasil;
            }
            
            var dateArr = getDateArray(startDate, endDate);
            this.setState({getRangeDate:dateArr})
        }

    render(){
        const {datasalah,isidata,getRangeDate,startDate,endDate, isFind, nimuser,namauser,ruanganuser}= this.state
        
        function Periodelaporan(start,end){
            var hasil, awal, akhir, tahunakhir, bulanawal, bulanakhir, tanggalawal, tanggalakhir, tglawal, tglakhir;
            awal = new Date(start);
            akhir = new Date(end);

            tahunakhir = String(akhir.getFullYear())

            var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
            
            bulanawal = months[(awal.getMonth())]
            bulanakhir = months[(akhir.getMonth())]

            tglawal = awal.getDate()
            tglakhir = akhir.getDate()

            if (tglawal <=9){
                tanggalawal = "0"+String(tglawal)
            }
            else {
                tanggalawal = String(tglawal)
            }

            if (tglakhir <=9){
                tanggalakhir = "0"+String(tglakhir)
            }
            else {
                tanggalakhir = String(tglakhir)
            }

            hasil = tanggalawal+" "+bulanawal+" - "+tanggalakhir+" "+bulanakhir+" "+tahunakhir
            if (isFind){
                return (
                    hasil
                )
            }
        }

        function sekarang(a){
            var hasil, tgl, tanggal, bulan, tahun, j, jam, m, menit;
            tgl = a.getDate();
            if (tgl <=9){
                tanggal = "0"+String(tgl)
            }
            else {
                tanggal = String(tgl)
            }
            var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
            bulan = months[(a.getMonth())]
            tahun = a.getFullYear();
            j = a.getHours()
            if (j<=9){
                jam = "0"+String(j)
            }
            else {
                jam = String(j)
            }
            m = a.getMinutes()
            if (m<=9){
                menit = "0"+String(m)
            }
            else {
                menit = String(m)
            }
            hasil =  bulan+" "+tanggal+", "+tahun+" "+jam+":"+menit+":00"
            if (isFind){
                return (
                    hasil
                )
            }
        }

        var i = 1;

        function waktu(t){
            var tahun,bulan,tanggal,tgl,hari,date;
            date = new Date (t)

            tahun = String(date.getFullYear())

            var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
            bulan = months[(date.getMonth())]

            tgl = date.getDate()
            if (tgl <=9){
                tanggal = "0"+String(tgl)
            }
            else {
                tanggal = String(tgl)
            }
            var days = ["Sun","Mon","Tue", "Wed", "Thu", "Fri", "Sat"];
            hari = days[(date.getDay())]
            
            return hari+", "+tanggal+"-"+bulan+"-"+tahun
        }

        function masuk(a,b){
            var hasil, tgl, tanggal, tahun, bulan;
            tgl = new Date(a)
            tanggal = tgl.getDate()
            bulan = tgl.getMonth()
            tahun = tgl.getFullYear()
            for (var i=0; i<b.length; i++){
                if(b[i].status===1){
                    var tanggalmasuk = new Date(b[i].date+" "+b[i].time)
                    var tanggalmasukk = tanggalmasuk.getDate()
                    var tahuntanggalmasuk = tanggalmasuk.getFullYear()
                    var bulantanggalmasuk = tanggalmasuk.getMonth()
                    var hasilmasuk,j, jam,m, menit;
                    j = tanggalmasuk.getHours()
                    if (j<=9){
                        jam = "0"+String(j)
                    }
                    else {
                        jam = String(j)
                    }
                    m = tanggalmasuk.getMinutes()
                    if (m<=9){
                        menit = "0"+String(m)
                    }
                    else {
                        menit = String(m)
                    }
    
                    hasilmasuk = jam + ":" +menit+":00";
                    if ((tanggal===tanggalmasukk)&&(tahun===tahuntanggalmasuk)&&(bulan===bulantanggalmasuk)){
                        hasil = hasilmasuk
                        break
                    }
                    else{
                        hasil = "-"
                    }
                }
                else{
                    hasil = "-"
                }
            }
            return hasil;
        }

        function keluar(a,b){
            var hasil, tgl, tanggal, tahun, bulan;
            hasil=''
            tgl = new Date(a)
            tanggal = tgl.getDate()
            bulan = tgl.getMonth()
            tahun = tgl.getFullYear()
            for (var i=0; i<b.length; i++){
                var tanggalmasuk = new Date(b[i].date+" "+b[i].time)
                var tanggalmasukk = tanggalmasuk.getDate()
                var tahuntanggalmasuk = tanggalmasuk.getFullYear()
                var bulantanggalmasuk = tanggalmasuk.getMonth()
                var hasilkeluar,j, jam,m, menit;
                j = tanggalmasuk.getHours()
                if (j<=9){
                    jam = "0"+String(j)
                }
                else {
                    jam = String(j)
                }
                m = tanggalmasuk.getMinutes()
                if (m<=9){
                    menit = "0"+String(m)
                }
                else {
                    menit = String(m)
                }

                hasilkeluar = jam + ":" +menit+":00";
                if ((tanggal===tanggalmasukk)&&(tahun===tahuntanggalmasuk)&&(bulan===bulantanggalmasuk)){
                    hasil = hasilkeluar
                }
            }
            if ((hasil==='')||(hasil===masuk(a,b))){
                hasil="-"
            }
            return hasil;
        }

        function total(a,b){
            var hasil, jammasuk,jamkeluar,menitmasuk,menitkeluar, j,m,jam, menit;

            var masukk = String(masuk(a,b))
            var keluarr = String(keluar(a,b))

            menitmasuk = parseInt(masukk.substring(3,5))
            menitkeluar = parseInt(keluarr.substring(3,5))
            jamkeluar = parseInt(keluarr.substring(0,2))
            jammasuk = parseInt(masukk.substring(0,2))

            m = menitkeluar-menitmasuk;
            j = jamkeluar-jammasuk;
            if (m<0){
                m = m + 60;
                j = j - 1;
            }

            if (j<=9){
                jam = "0"+String(j)
            }
            else {
                jam = String(j)
            }

            if (m<=9){
                menit = "0"+String(m)
            }
            else {
                menit = String(m)
            }
            hasil = jam+":"+menit+":00";
            if ((masukk==="-")||(keluarr==="-")){
                return "-"
            }
            else {
                return hasil
            }
        }

        function absen(a,b){
            var hasil, tgl, tanggal, tahun, bulan;
            tgl = new Date(a)
            tanggal = tgl.getDate()
            bulan = tgl.getMonth()
            tahun = tgl.getFullYear()
            for (var i=0; i<b.length; i++){
                var tanggalmasuk = new Date(b[i].date)
                var tanggalmasukk = tanggalmasuk.getDate()
                var tahuntanggalmasuk = tanggalmasuk.getFullYear()
                var bulantanggalmasuk = tanggalmasuk.getMonth()
                if ((b[i].status===2)&&(tanggal===tanggalmasukk)&&(tahun===tahuntanggalmasuk)&&(bulan===bulantanggalmasuk)){
                    hasil = "✔"
                    break
                }
                else{
                    hasil = " "
                }
            }
            return hasil;
        }

        function sakit(a,b){
            var hasil, tgl, tanggal, tahun, bulan;
            tgl = new Date(a)
            tanggal = tgl.getDate()
            bulan = tgl.getMonth()
            tahun = tgl.getFullYear()
            for (var i=0; i<b.length; i++){
                var tanggalmasuk = new Date(b[i].date)
                var tanggalmasukk = tanggalmasuk.getDate()
                var tahuntanggalmasuk = tanggalmasuk.getFullYear()
                var bulantanggalmasuk = tanggalmasuk.getMonth()
                if ((b[i].status===3)&&(tanggal===tanggalmasukk)&&(tahun===tahuntanggalmasuk)&&(bulan===bulantanggalmasuk)){
                    hasil = "✔"
                    break
                }
                else{
                    hasil = " "
                }
            }
            return hasil;
        }

        function izin(a,b){
            var hasil, tgl, tanggal, tahun, bulan;
            tgl = new Date(a)
            tanggal = tgl.getDate()
            bulan = tgl.getMonth()
            tahun = tgl.getFullYear()
            for (var i=0; i<b.length; i++){
                var tanggalmasuk = new Date(b[i].date)
                var tanggalmasukk = tanggalmasuk.getDate()
                var tahuntanggalmasuk = tanggalmasuk.getFullYear()
                var bulantanggalmasuk = tanggalmasuk.getMonth()
                if ((b[i].status===4)&&(tanggal===tanggalmasukk)&&(tahun===tahuntanggalmasuk)&&(bulan===bulantanggalmasuk)){
                    hasil = "✔"
                    break
                }
                else{
                    hasil = " "
                }
                    
            }
            return hasil;
        }

        const ref = React.createRef();
        const ExcelFile = ReactExport.ExcelFile;
        const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
        var x=1;

        function no(i){
            var m=0
            var hasil=m+i
            return  hasil
        }

        function getDataXcl(a){
            var data=new Array(a.length);
            x = 1;
            for (var i=0; i<a.length ;i++){
                data[i] = new Array(9) 
                
                data[i][0]=(no(x++))
                data[i][1]=(waktu(a[i]))
                data[i][2]=(masuk(a[i],isidata))
                data[i][3]=(keluar(a[i],isidata))
                data[i][4]=(total(a[i],isidata))
                data[i][5]=(absen(a[i],isidata))
                data[i][6]=(izin(a[i],isidata))
                data[i][7]=(sakit(a[i],isidata))
                data[i][8]=" "
            }
            return data
        }

        const dataXcl = [
            {
                columns: [" ", " ", " "," "," "," "," "," "," "],
                data: [
                    ["NIM/NIP", nimuser],
                    ["Nama", namauser],
                    ["Nama Ruangan", ruanganuser],
                    [" "],
                    [" "],
                    [" "," "," ","Pencetak","ADMIN" ],
                    // [" "," "," ","Pencetak",sessionStorage.message ],
                    ["Periode",Periodelaporan(startDate,endDate)," ","Tanggal Cetak",sekarang(new Date()) ],
                ]
            },

            {
                ySteps: 2,
                columns: [
                    {title: "No", width: {wpx: 30}},
                    {title: "Hari, Tanggal", width: {wpx: 120}},
                    {title: "Jam Masuk", width: {wpx: 100}},
                    {title: "Jam Keluar", width: {wpx: 100}},
                    {title: "Total Jam/Hari", width: {wpx: 100}},
                    {title: "Alfa", width: {wpx: 50}},
                    {title: "Izin", width: {wpx: 50}},
                    {title: "Sakit", width: {wpx: 50}},
                    {title: "Keterangan", width: {wpx: 100}},
                ],
                data: getDataXcl(getRangeDate)
            }
        ]

        return (
            <div>
                <div className="kotakdata"> 
                    <div>
                        <span className="welcometoxirka"><b>Page Belum Dibuat</b></span>
                    </div>
                </div>
                <div className="kotakfilter2"> 
                    <form className="kotakforminputlogpintu" onSubmit={this.handleSubmit}>
                        <div className="kotakinputlaporannim">
                            <label> NIM/NIP </label> <br></br>
                            <input name="nim" onChange={this.handleChange} className="inputformlaporannim" type="number" placeholder="NIM/NIP" required></input>
                        </div>

                        <div className="kotakinputlaporanstart">
                            <label> Start Date </label> <br></br>
                            <input name="startDate" onChange={this.handleChange} className="inputformlaporanstart" type="date" required></input>
                        </div> 
                        
                        <div className="kotakinputlaporanend">
                            <label> End Date </label> <br></br>
                            <input name="endDate" onChange={this.handleChange} className="inputformlaporanend" type="date" required></input>
                        </div>
                        {
                        datasalah &&
                        <p className="textmerah">*Data tidak ditemukan</p>
                        }
                        { 
                        (datasalah===false) &&
                        <p className="texthijau">&emsp;</p>
                        }
                        <div className="kotaksubmitlaporan">
                            <input className="submitformlogpintu2" type="submit" value="Find"></input>
                        </div>

                        
                        <Pdf targetRef={ref} filename={"Xirka-"+nimuser}>
                            {({ toPdf }) =>
                                <a onClick={toPdf} style={{width:"100%",height:"100%"}}>
                                    <div className="kotakprintpdflaporan">
                                        <div className="printformlaporan"> 
                                           <i className="fa fa-print"> <span> Print to PDF</span></i>
                                        </div>
                                    </div>
                                </a>
                            }
                        </Pdf>
                           
                           
                        <ExcelFile filename={"Xirka-"+nimuser} element={
                            <a>
                                <div className="kotakprintxcllaporan">
                                    <div className="printformlaporan">
                                        <i className="fa fa-print"> <span> Print to Excel</span></i>
                                    </div>
                                </div>
                        </a>}>
                            <ExcelSheet dataSet={dataXcl} name={"Xirka"+nimuser}/>
                        </ExcelFile>
                            
                    </form> 
                </div>        
                <div className="ruangandaftarruangan"> 
                    <div className="box-footer">
                        <div className="kotakisigrafik">
                            <div className="kotakisigrafik2">
                                <div ref={ref} className="ruangandaftarruangan2">
                                    <table className="tabellaporan">
                                        <tbody>
                                            <tr>
                                                <td style={{width:'15%'}}>
                                                    <b>NIM/NIP</b>
                                                </td>
                                                <td style={{width:'40%'}}>
                                                    <b>&emsp;:&emsp;{nimuser}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Nama</b>
                                                </td>
                                                <td>
                                                    <b>&emsp;:&emsp;{namauser}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Nama Ruangan</b>
                                                </td>
                                                <td>
                                                    <b>&emsp;:&emsp;{ruanganuser}</b>
                                                </td>
                                            </tr>
                                            <tr><td>&emsp;</td></tr>
                                            <tr>
                                                <td>&emsp;</td>
                                                <td>&emsp;</td>
                                                <td style={{width:'14%'}}><b>Pencetak</b></td>
                                                <td style={{width:'5%',textAlign:"center"}}><b>:</b></td>
                                                <td><b>ADMIN</b></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Periode</b>
                                                </td>
                                                <td>
                                                    <b>&emsp;:&emsp;{Periodelaporan(startDate,endDate)}</b>
                                                </td>
                                                <td style={{width:'14%'}}>
                                                    <b>Tanggal Cetak</b>
                                                </td>
                                                <td style={{width:'5%',textAlign:"center"}}>
                                                    <b>:</b>
                                                </td>
                                                <td>
                                                    <b>{sekarang(new Date())}</b>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    {/* <table className="tabellaporan">
                                        <thead>
                                            <tr className="tabellaporantrhead">
                                                <th className ="laporanno" > No </th>
                                                <th className ="laporanhari"> Hari, Tanggal </th>
                                                <th className ="laporanmasuk"> Jam Masuk </th>
                                                <th className ="laporankeluar"> Jam Keluar </th>
                                                <th className ="laporantotal"> Total Jam/Hari </th>
                                                <th className ="laporanalfa"> Alfa </th>
                                                <th className ="laporanizin"> Izin </th>
                                                <th className ="laporansakit"> Sakit </th>
                                                <th className ="laporanketerangan"> Keterangan </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { isFind && getRangeDate.map(isi =>(
                                            <tr className="tabellaporanbody" key={isi}>
                                                <td className ="laporanno">{i++}</td>
                                                <td className ="laporanhari">{waktu(isi)}</td>
                                                <td className ="laporanmasuk">{masuk(isi,isidata)}</td>
                                                <td className ="laporankeluar">{keluar(isi,isidata)}</td>                                                    
                                                <td className ="laporantotal">{total(isi,isidata)}</td>
                                                <td className ="laporanalfa">{absen(isi,isidata)}</td>
                                                <td className ="laporanizin">{izin(isi,isidata)}</td>
                                                <td className ="laporansakit">{sakit(isi,isidata)}</td>
                                                <td className ="laporanketerangan"></td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
        
    } 
}

export default withRouter(Laporan);