import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import get from './config';

class Dosen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //show pengguna dan filter
            pageshow: "dosen",
            kodedevice: '',

            //Pengguna
            //read 
            sortby: 'fakultas',
            ascdsc: 'asc',
            search: '',
            limit: 10,
            page: 1,
            rowCount: 0,
            semuafakultas: [],
            jurusan: [],
            jurusankosong: true,
            data: [],
            datakosong: true,
            daftar: false,
            edit: false,
            //create
            fakultasc: '',
            jurusanc: '',
            nipc: '',
            namac: '',
            finger1: '',
            finger2: '',
            pesanfinger1: false,
            pesanfinger2: false,
            pesandevice: false,
            pesandevicenotfound: false,

            //edit
            oldnip: '',
            nipu: '',
            namau: '',
            // finger1u:'',
            // finger2u:'',

            //filter pengguna
            //read 
            sortbyfilter: 'a.kodematkul',
            ascdscfilter: 'asc',
            searchfilter: '',
            limitfilter: 10,
            pagefilter: 1,
            daftarfilter: false,
            //create
            filternip: '',
            namafilterc: '',
            kodematkulfilterc: '',
            namamatkulfilterc: '',
            kelasfilterc: '',

            //status add atau edit
            pesan: '',
            datasalah: false,
            databenar: false,
        };
        this.getJurusan = this.getJurusan.bind(this);
        this.getNameMatkulFilter = this.getNameMatkulFilter.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitDaftar = this.handleSubmitDaftar.bind(this);
        this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
    }

    getData(pageshow, sortby, ascdsc, search, limit, page) {
        const { filternip } = this.state
        if (pageshow === "dosen") {
            fetch(get.readdosen, {
                method: 'post',
                headers: {
                    "x-access-token": sessionStorage.name,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sortby: sortby,
                    ascdsc: ascdsc,
                    search: search,
                    limit: limit,
                    page: page,
                })
            })
                .then(response => response.json())
                .then(response => {
                    //berhasil dapet data
                    if ((response.status === 1) && (response.count !== 0)) {
                        this.setState({ data: response.hasil })
                        this.setState({ rowCount: response.count })
                        this.setState({ datakosong: false })
                    }
                    else if ((response.status === 1) && (response.count === 0)) {
                        this.setState({ datakosong: true })
                        this.setState({ rowCount: response.count })
                    }
                    //ga dapet token
                    else if ((response.status !== 1) && (response.status !== 0)) {
                        sessionStorage.removeItem("name")
                        window.location.reload()
                    }
                })
                .catch(error => {
                    sessionStorage.removeItem("name")
                    window.location.reload()
                })
        }
        else if (pageshow === "filterdosen") {
            fetch(get.readfilterdosen, {
                method: 'post',
                headers: {
                    "x-access-token": sessionStorage.name,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sortby: sortby,
                    ascdsc: ascdsc,
                    search: search,
                    limit: limit,
                    page: page,
                    nipfilter: filternip,
                })
            })
                .then(response => response.json())
                .then(response => {
                    //berhasil dapet data
                    if ((response.status === 1) && (response.count !== 0)) {
                        this.setState({ data: response.hasil })
                        this.setState({ rowCount: response.count })
                        this.setState({ datakosong: false })
                    }
                    else if ((response.status === 1) && (response.count === 0)) {
                        this.setState({ datakosong: true })
                        this.setState({ rowCount: response.count })
                    }
                    //ga dapet token
                    else if ((response.status !== 1) && (response.status !== 0)) {
                        sessionStorage.removeItem("name")
                        window.location.reload()
                    }
                })
                .catch(error => {
                    sessionStorage.removeItem("name")
                    window.location.reload()
                })
        }
    }

    getFakultas() {
        fetch(get.readfakultasjurusan, {
            method: 'post',
            headers: {
                "x-access-token": sessionStorage.name,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sortby: 'fakultas',
                ascdsc: 'asc',
                search: '',
                limit: 100,
                page: 1,
            })
        })
            .then(response => response.json())
            .then(response => {
                //berhasil dapet data
                if ((response.status === 1) && (response.count !== 0)) {
                    this.setState({ semuafakultas: response.hasil })
                }
                //ga dapet token
                else if ((response.status !== 1) && (response.status !== 0)) {
                    sessionStorage.removeItem("name")
                    window.location.reload()
                }
            })
            .catch(error => {
                sessionStorage.removeItem("name")
                window.location.reload()
            })
    }

    getJurusan(e) {
        const { value } = e.target
        this.setState({ fakultasc: value })
        if (value === '') {
            this.setState({ jurusankosong: true })
        }
        else {
            this.setState({ jurusankosong: false })
            this.setState({ jurusan: [] })
            fetch(get.readfakultasjurusan + "/" + value, {
                method: 'post',
                headers: {
                    "x-access-token": sessionStorage.name,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sortby: 'jurusan',
                    ascdsc: 'asc',
                    search: '',
                    limit: 100,
                    page: 1,
                })
            })
                .then(response => response.json())
                .then(response => {
                    //berhasil dapet data
                    if ((response.status === 1) && (response.count !== 0)) {
                        this.setState({ jurusan: response.hasil })
                    }
                    //ga dapet token
                    else if ((response.status !== 1) && (response.status !== 0)) {
                        sessionStorage.removeItem("name")
                        window.location.reload()
                    }
                })
                .catch(error => {
                    sessionStorage.removeItem("name")
                    window.location.reload()
                })
        }
    }

    handleFilter(e) {
        const { pageshow, sortby, ascdsc, search, limit, page } = this.state
        const { sortbyfilter, ascdscfilter, searchfilter, limitfilter, pagefilter } = this.state
        const { name, value } = e.target;
        this.setState({ [name]: value });
        var sortbyf, ascdscf, searchingf, maxf, pagef;
        if (pageshow === "dosen") {
            sortbyf = sortby
            ascdscf = ascdsc
            pagef = page
            if (name === "search") {
                searchingf = value
                maxf = limit
            }
            else if (name === "limit") {
                searchingf = search
                maxf = value
            }
        }
        else if (pageshow === "filterdosen") {
            sortbyf = sortbyfilter
            ascdscf = ascdscfilter
            pagef = pagefilter
            if (name === "searchfilter") {
                searchingf = value
                maxf = limitfilter
            }
            else if (name === "limitfilter") {
                searchingf = searchfilter
                maxf = value
            }
        }
        this.getData(pageshow, sortbyf, ascdscf, searchingf, maxf, pagef)
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    componentDidMount() {
        const { pageshow, sortby, ascdsc, search, limit, page } = this.state
        const { sortbyfilter, ascdscfilter, searchfilter, limitfilter, pagefilter } = this.state
        if (pageshow === "dosen") {
            //console.log("1")
            this.getData(pageshow, sortby, ascdsc, search, limit, page)
        }
        else if (pageshow === "filterdosen") {
            //console.log("2")
            this.getData(pageshow, sortbyfilter, ascdscfilter, searchfilter, limitfilter, pagefilter)
        }
        this.getFakultas()
    }

    filter(pagenow, sortbynow, ascdscnow) {
        const { pageshow, sortby, search, limit, page } = this.state
        const { sortbyfilter, searchfilter, limitfilter, pagefilter } = this.state
        var searchf, limitf
        if (pageshow === "dosen") {
            searchf = search
            limitf = limit
            if (pagenow === page) {
                if (sortbynow === sortby) {
                    if (ascdscnow === "asc") {
                        ascdscnow = "desc"
                    }
                    else if (ascdscnow === "desc") {
                        ascdscnow = "asc"
                    }
                }
                else {
                    ascdscnow = "asc"
                }
            }
            this.setState({ page: pagenow })
            this.setState({ sortby: sortbynow })
            this.setState({ ascdsc: ascdscnow })
        }
        else if (pageshow === "filterdosen") {
            searchf = searchfilter
            limitf = limitfilter
            if (pagenow === pagefilter) {
                if (sortbynow === sortbyfilter) {
                    if (ascdscnow === "asc") {
                        ascdscnow = "desc"
                    }
                    else if (ascdscnow === "desc") {
                        ascdscnow = "asc"
                    }
                }
                else {
                    ascdscnow = "asc"
                }
            }
            this.setState({ pagefilter: pagenow })
            this.setState({ sortbyfilter: sortbynow })
            this.setState({ ascdscfil: ascdscnow })
        }
        this.getData(pageshow, sortbynow, ascdscnow, searchf, limitf, pagenow)
    }

    deleteDataFinger(a) {
        fetch(get.deletefinger, {
            method: 'post',
            headers: {
                "x-access-token" : sessionStorage.name,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                kodedevice: a,
            })
        })
            .then(response => response.json())
            .then(response => {
                //console.log(response)
                //berhasil get data
                if (response.status === 1) {

                }
                //tidak berhasil get data
                else if (response.status === 0) {

                }
                //ga ada token
                else {
                    sessionStorage.removeItem("name")
                    window.location.reload()
                }
            })
            .catch(error => {
                sessionStorage.removeItem("name")
                window.location.reload()
            })
    }

    getFinger1() {
        const { kodedevice } = this.state
        if (kodedevice !== '') {
            fetch(get.checkdevice + "/" + kodedevice, {
                method: 'get',
                headers: {
                    "x-access-token" : sessionStorage.name,
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(response => {
                    //berhasil get data
                    if (response.status === 1) {
                        this.setState({ pesanfinger1: true })
                        this.deleteDataFinger(kodedevice)
                        this.setState({ finger1: '-' })
                        this.setState({ pesandevice: false })
                        this.setState({ pesandevicenotfound: false })

                        this.interval = setInterval(() => {
                            fetch(get.readfinger + "/" + kodedevice, {
                                method: 'get',
                                headers: {
                                    "x-access-token" : sessionStorage.name,
                                    "Content-Type": "application/json"
                                }
                            })
                                .then(response => response.json())
                                .then(response => {
                                    //console.log(response)
                                    //berhasil get data
                                    if (response.status === 1) {
                                        if (response.hasil.length !== 0) {
                                            this.setState({ finger1: response.hasil[0].template })
                                            this.setState({ pesanfinger1: false })
                                            clearInterval(this.interval);
                                        }
                                        else {
                                            this.setState({ finger1: '-' })
                                        }
                                    }
                                    //tidak berhasil get data
                                    else if (response.status === 0) {
                                        this.setState({ finger1: '-' })
                                    }
                                    //ga ada token
                                    else {
                                        sessionStorage.removeItem("name")
                                        window.location.reload()
                                    }
                                })
                                .catch(error => {
                                    sessionStorage.removeItem("name")
                                    window.location.reload()
                                })
                        }, 2000);
                    }
                    //tidak berhasil get data
                    else if (response.status === 0) {
                        this.setState({ pesandevice: false })
                        this.setState({ pesandevicenotfound: true })
                    }
                    //ga ada token
                    else {
                        sessionStorage.removeItem("name")
                        window.location.reload()
                    }
                })
                .catch(error => {
                    sessionStorage.removeItem("name")
                    window.location.reload()
                })
        }
        else {
            this.setState({ pesandevice: true })
            this.setState({ pesandevicenotfound: false })
        }
        // this.setState({ finger1: '-' })
    }

    getFinger2() {
        const { kodedevice, finger1 } = this.state
        if ((kodedevice !== '') && ((finger1 !== '') && (finger1 !== '-'))) {
            fetch(get.checkdevice + "/" + kodedevice, {
                method: 'get',
                headers: {
                    "x-access-token" : sessionStorage.name,
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(response => {
                    //berhasil get data
                    if (response.status === 1) {
                        this.setState({ pesanfinger2: true })
                        this.deleteDataFinger(kodedevice)
                        this.setState({ finger2: '-' })
                        this.setState({ pesandevice: false })
                        this.setState({ pesandevicenotfound: false })

                        this.interval = setInterval(() => {
                            fetch(get.readfinger + "/" + kodedevice, {
                                method: 'get',
                                headers: {
                                    "x-access-token" : sessionStorage.name,
                                    "Content-Type": "application/json"
                                }
                            })
                                .then(response => response.json())
                                .then(response => {
                                    //console.log(response)
                                    //berhasil get data
                                    if (response.status === 1) {
                                        if (response.hasil.length !== 0) {
                                            this.setState({ finger2: response.hasil[0].template })
                                            this.setState({ pesanfinger2: false })
                                            clearInterval(this.interval);
                                        }
                                        else {
                                            this.setState({ finger2: '-' })
                                        }
                                    }
                                    //tidak berhasil get data
                                    else if (response.status === 0) {
                                        this.setState({ finger2: '-' })
                                    }
                                    //ga ada token
                                    else {
                                        sessionStorage.removeItem("name")
                                        window.location.reload()
                                    }
                                })
                                .catch(error => {
                                    sessionStorage.removeItem("name")
                                    window.location.reload()
                                })
                        }, 2000);
                    }
                    //tidak berhasil get data
                    else if (response.status === 0) {
                        this.setState({ pesandevice: false })
                        this.setState({ pesandevicenotfound: true })
                    }
                    //ga ada token
                    else {
                        sessionStorage.removeItem("name")
                        window.location.reload()
                    }
                })
                .catch(error => {
                    sessionStorage.removeItem("name")
                    window.location.reload()
                })
        }
        // this.setState({ finger2: '-' })
    }

    handleSubmitDaftar(e) {
        e.preventDefault();
        const { pageshow, fakultasc, jurusanc, nipc, namac, finger1, finger2 } = this.state;
        const { filternip, namafilterc, kodematkulfilterc, kelasfilterc } = this.state;
        if (pageshow === "dosen") {
            fetch(get.createdosen, {
                method: 'post',
                headers: {
                    "x-access-token": sessionStorage.name,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fakultas: fakultasc,
                    jurusan: jurusanc,
                    nip: nipc,
                    nama: namac,
                    finger1: finger1,
                    finger2: finger2,
                })
            })
                .then(response => response.json())
                .then(response => {
                    //berhasil add data
                    if (response.status === 1) {
                        this.setState({ databenar: true })
                        this.setState({ datasalah: false })
                        this.setState({ pesan: response.pesan })
                        setTimeout(this.componentDidMount(), 1000)
                    }
                    //tidak berhasil add data
                    else if (response.status === 0) {
                        this.setState({ databenar: false })
                        this.setState({ datasalah: true })
                        this.setState({ pesan: response.pesan })
                    }
                    //ga ada token
                    else {
                        sessionStorage.removeItem("name")
                        window.location.reload()
                    }
                })
                .catch(error => {
                    sessionStorage.removeItem("name")
                    window.location.reload()
                })
        }
        else if (pageshow === "filterdosen") {
            fetch(get.createfilterdosen, {
                method: 'post',
                headers: {
                    "x-access-token": sessionStorage.name,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nip: filternip,
                    nama: namafilterc,
                    kodematkul: kodematkulfilterc,
                    kelas: kelasfilterc
                })
            })
                .then(response => response.json())
                .then(response => {
                    //berhasil add data
                    if (response.status === 1) {
                        this.setState({ databenar: true })
                        this.setState({ datasalah: false })
                        this.setState({ pesan: response.pesan })
                        setTimeout(this.componentDidMount(), 1000)
                    }
                    //tidak berhasil add data
                    else if (response.status === 0) {
                        this.setState({ databenar: false })
                        this.setState({ datasalah: true })
                        this.setState({ pesan: response.pesan })
                    }
                    //ga ada token
                    else {
                        sessionStorage.removeItem("name")
                        window.location.reload()
                    }
                })
                .catch(error => {
                    sessionStorage.removeItem("name")
                    window.location.reload()
                })
        }
    }

    handleSubmitEdit(e) {
        e.preventDefault();
        const { oldnip, nipu, namau, finger1, finger2 } = this.state;
        fetch(get.updatedosen, {
            method: 'post',
            headers: {
                "x-access-token": sessionStorage.name,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                oldnip: oldnip,
                newnip: nipu,
                newnama: namau,
                newfinger1: finger1,
                newfinger2: finger2,
            })
        })
            .then(response => response.json())
            .then(response => {
                //berhasil add data
                if (response.status === 1) {
                    this.setState({ databenar: true })
                    this.setState({ datasalah: false })
                    this.setState({ pesan: response.pesan })
                    setTimeout(this.componentDidMount(), 1000)
                }
                //tidak berhasil add data
                else if (response.status === 0) {
                    this.setState({ databenar: false })
                    this.setState({ datasalah: true })
                    this.setState({ pesan: response.pesan })
                }
                //ga ada token
                else {
                    sessionStorage.removeItem("name")
                    window.location.reload()
                }
            })
            .catch(error => {
                sessionStorage.removeItem("name")
                window.location.reload()
            })
    }

    deletePengguna(a) {
        var yes = window.confirm("Apakah anda yakin ingin menghapus nim: " + a + "?");
        if (yes === true) {
            fetch(get.deletedosen, {
                method: 'post',
                headers: {
                    "x-access-token": sessionStorage.name,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nip: a
                })
            })
                .then(response => response.json())
                .then(response => {
                    setTimeout(this.componentDidMount(), 1000)
                })
                .catch(error => {
                    sessionStorage.removeItem("name")
                    window.location.reload()
                })
        }
    }

    deleteFilterPengguna(a, b, c, d) {
        var yes = window.confirm("Apakah anda yakin ingin menghapus Kode Matakuliah: " + c + " pada kelas: " + d + "?");
        if (yes === true) {
            fetch(get.deletefilterdosen, {
                method: 'post',
                headers: {
                    "x-access-token": sessionStorage.name,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nip: a,
                    nama: b,
                    kodematkul: c,
                    kelas: d,
                })
            })
                .then(response => response.json())
                .then(response => {
                    //console.log(response)
                    setTimeout(this.componentDidMount(), 1000)
                })
                .catch(error => {
                    sessionStorage.removeItem("name")
                    window.location.reload()
                })
        }
    }

    getNameFilter() {
        const { filternip } = this.state
        fetch(get.readdosen, {
            method: 'post',
            headers: {
                "x-access-token": sessionStorage.name,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sortby: "nip",
                ascdsc: "asc",
                search: filternip,
                limit: "1",
                page: "1",
            })
        })
            .then(response => response.json())
            .then(response => {
                //berhasil dapet data
                if ((response.status === 1) && (response.count === 1)) {
                    this.setState({ namafilterc: response.hasil[0].nama })
                }
                else if ((response.status === 1) && (response.count !== 1)) {
                    this.setState({ namafilterc: '' })
                }
                //ga dapet token
                else if ((response.status !== 1) && (response.status !== 0)) {
                    sessionStorage.removeItem("name")
                    window.location.reload()
                }
            })
            .catch(error => {
                sessionStorage.removeItem("name")
                window.location.reload()
            })
    }

    getNameMatkulFilter(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
        var lengthnama = value.length;
        if (lengthnama === 6) {
            fetch(get.readmatkul, {
                method: 'post',
                headers: {
                    "x-access-token": sessionStorage.name,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sortby: "kodematkul",
                    ascdsc: "asc",
                    search: value,
                    limit: "1",
                    page: "1",
                })
            })
                .then(response => response.json())
                .then(response => {
                    //berhasil dapet data
                    if ((response.status === 1) && (response.count >= 1)) {
                        this.setState({ namamatkulfilterc: response.hasil[0].namamatkul })
                    }
                    else if ((response.status === 1) && (response.count !== 1)) {
                        this.setState({ namamatkulfilterc: '' })
                    }
                    //ga dapet token
                    else if ((response.status !== 1) && (response.status !== 0)) {
                        sessionStorage.removeItem("name")
                        window.location.reload()
                    }
                })
                .catch(error => {
                    sessionStorage.removeItem("name")
                    window.location.reload()
                })
        }
        else {
            this.setState({ namamatkulfilterc: '' })
        }
    }

    showDaftar() {
        this.setState({ daftar: true })
        this.setState({ edit: false })
    }
    hideDaftar() {
        this.setState({ daftar: false })
        this.setState({ datasalah: false })
        this.setState({ databenar: false })
        this.setState({ finger1: '' })
        this.setState({ finger2: '' })
        this.setState({ kodedevice: '' })
        this.setState({ pesandevice: false })
        this.setState({ pesandevicenotfound: false })
        this.setState({ pesanfinger1: false })
        this.setState({ pesanfinger2: false })
        this.componentWillUnmount()
    }
    showDaftarFilter() {
        this.setState({ daftarfilter: true })
    }
    hideDaftarFilter() {
        this.setState({ daftarfilter: false })
        this.setState({ datasalah: false })
        this.setState({ databenar: false })
        this.setState({ namamatkulfilterc: '' })
    }
    showEdit(a, b, c, d, e) {
        this.setState({ edit: true })
        this.setState({ daftar: false })
        this.setState({ oldnip: a })
        this.setState({ nipu: b })
        this.setState({ namau: c })
        this.setState({ finger1: d })
        this.setState({ finger2: e })
    }
    hideEdit() {
        this.setState({ edit: false })
        this.setState({ datasalah: false })
        this.setState({ databenar: false })
    }
    showFilterPengguna(a, b) {
        const { sortbyfilter, ascdscfilter, searchfilter, limitfilter, pagefilter } = this.state
        if (b.length >= 8) {
            this.setState({ pageshow: a })
            this.getData(a, sortbyfilter, ascdscfilter, searchfilter, limitfilter, pagefilter)
            this.getNameFilter()
        }
    }
    showPengguna(a) {
        const { sortby, ascdsc, search, limit, page } = this.state
        this.setState({ pageshow: a })
        this.getData(a, sortby, ascdsc, search, limit, page)
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
        const state = this.state
        //data fingerprint
        var showfinger1, showfinger2
        if (state.finger1 === '-') {
            showfinger1 = "Waiting finger..."
        }
        else if ((state.finger1 !== '-') && (state.finger1 !== '')) {
            showfinger1 = "Finger Detected."
        }
        if (state.finger2 === '-') {
            showfinger2 = "Waiting finger..."
        }
        else if ((state.finger2 !== '-') && (state.finger2 !== '')) {
            showfinger2 = "Finger Detected."
        }

        //mengambil data fakultas dari database fakultas
        var fakultas = []
        var checkfakultas = 0
        for (var i = 0; i < state.semuafakultas.length; i++) {
            for (var j = 0; j < fakultas.length; j++) {
                if (state.semuafakultas[i].fakultas === fakultas[j]) {
                    checkfakultas++
                }
            }
            if (checkfakultas === 0) {
                fakultas.push(state.semuafakultas[i].fakultas)
            }
            checkfakultas = 0;
        }

        //setting tombol berikutnya and sebelumnya
        var maxPage, showNext, showPrevious;
        if (state.pageshow === "dosen") {
            maxPage = parseInt(state.rowCount / state.limit);
            if ((state.rowCount % state.limit) !== 0) {
                maxPage = maxPage + 1
            }
            showNext = false;
            showPrevious = false;
            // deteksi page pertama
            if (state.page === 1) {
                showPrevious = false;
                if ((state.page === maxPage) || (maxPage === 0)) {
                    showNext = false;
                }
                else {
                    showNext = true;
                }
            }
            // deteksi page terakhir
            else if ((state.page === maxPage) || (maxPage === 0)) {
                showPrevious = true;
                showNext = false;
            }
            //deteksi page ditengah
            else {
                showPrevious = true;
                showNext = true;
            }
        }
        else if (state.pageshow === "filterdosen") {
            maxPage = parseInt(state.rowCount / state.limitfilter);
            if ((state.rowCount % state.limitfilter) !== 0) {
                maxPage = maxPage + 1
            }
            showNext = false;
            showPrevious = false;
            // deteksi page pertama
            if (state.pagefilter === 1) {
                showPrevious = false;
                if (state.pagefilter === maxPage) {
                    showNext = false;
                }
                else {
                    showNext = true;
                }
            }
            // deteksi page terakhir
            else if (state.pagefilter === maxPage) {
                showPrevious = true;
                showNext = false;
            }
            //deteksi page ditengah
            else {
                showPrevious = true;
                showNext = true;
            }
        }


        var aksidata
        if ((state.daftar === true) || (state.daftarfilter === true)) {
            aksidata = "show"
        }
        else if (state.edit === true) {
            aksidata = "show"
        }
        else {
            aksidata = "hide"
        }
        i = 1;
        return (
            <div>
                {state.daftar &&
                    <div>
                        <div className="kotakfilter2">
                            <form className="kotakforminputlogpintu" onSubmit={this.handleSubmitDaftar}>
                                {
                                    state.databenar &&
                                    <span className="texthijau">{state.pesan}</span>
                                }
                                {
                                    state.datasalah &&
                                    <span className="textmerah">{state.pesan}</span>
                                }
                                <div className="kotakinputpenggunafakultas">
                                    <label> <b>Fakultas</b> </label> <br></br>
                                    <select onChange={this.getJurusan} className="inputformlogpintustatus" required>
                                        <option> </option>
                                        {fakultas.map(isidata => (
                                            <option key={i++} value={isidata}>{isidata}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="kotakinputpenggunajurusan">
                                    <label> <b>Jurusan</b> </label> <br></br>
                                    <select name="jurusanc" onChange={this.handleChange} className="inputformlogpintujurusan" required>
                                        {state.jurusankosong &&
                                            <option> </option>
                                        }
                                        {(state.jurusankosong === false) &&
                                            <option> </option>
                                        }
                                        {(state.jurusankosong === false) && state.jurusan.map(isidata => (
                                            <option key={i++} value={isidata.jurusan}>{isidata.jurusan}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="kotakinputpenggunanim">
                                    <label><b>NIP</b> </label> <br></br>
                                    <input name="nipc" onChange={this.handleChange} className="inputformlogpintunimc" type="text" placeholder="NIP" required ></input>
                                </div>

                                <div className="kotakinputpenggunanama">
                                    <label><b>Nama</b> </label> <br></br>
                                    <input name="namac" onChange={this.handleChange} className="inputformlogpintunimc" type="text" placeholder="Nama" required ></input>
                                </div>

                                <div className="kotakinputpenggunadevice">
                                    <label><b>Kode Device</b> </label> <br></br>
                                    {state.pesandevice &&
                                        <span className="pesanfinger1">*Input Kode Device</span>
                                    }
                                    {state.pesandevicenotfound &&
                                        <span className="pesanfinger1">*Device not found</span>
                                    }
                                    <input name="kodedevice" onChange={this.handleChange} className="inputformlogpintunimc" type="text" placeholder="Kode Device" required ></input>
                                </div>

                                <div className="kotakinputpenggunafinger1">
                                    <label><b>Finger1</b> </label> <br></br>
                                    {state.pesanfinger1 &&
                                        <span className="pesanfinger1">*Press B in your fingerprint device</span>
                                    }
                                    <input onChange={this.handleChange} className="inputformlogpintunimc" type="text" placeholder="Finger 1" value={showfinger1 || ''} required ></input>
                                    <button type="button" className="submitfinger1" onClick={() => this.getFinger1()}><i className="fa fa-bullseye"></i></button>
                                </div>

                                <div className="kotakinputpenggunafinger2">
                                    <label><b>Finger2</b> </label> <br></br>
                                    {state.pesanfinger2 &&
                                        <span className="pesanfinger1">*Press B in your fingerprint device</span>
                                    }
                                    <input onChange={this.handleChange} className="inputformlogpintunimc" type="text" placeholder="Finger 2" value={showfinger2 || ''} required ></input>
                                    <button type="button" className="submitfinger2" onClick={() => this.getFinger2()}><i className="fa fa-bullseye"></i></button>
                                </div>

                                <div className="kotaksubmitpenggunadaftar">
                                    <input className="submitformlogpintu" type="submit" value="Add"></input>
                                </div>

                                <div className="kotakcancelpenggunadaftar">
                                    <button className="buttonlikea" onClick={() => this.hideDaftar()}> <span className="cancelformpengguna">Cancel</span></button>
                                </div>
                            </form>
                        </div>
                    </div>
                }
                {state.daftarfilter &&
                    <div>
                        <div className="kotakfilter2">
                            <form className="kotakforminputlogpintu" onSubmit={this.handleSubmitDaftar}>
                                {
                                    state.databenar &&
                                    <span className="texthijau">{state.pesan}</span>
                                }
                                {
                                    state.datasalah &&
                                    <span className="textmerah">{state.pesan}</span>
                                }

                                <div className="kotakinputfilterpenggunanim">
                                    <label><b>NIP</b> </label> <br></br>
                                    <input onChange={this.handleChange} className="inputformlogpintujurusan" type="text" placeholder="NIP" value={state.filternip || ''} required ></input>
                                </div>

                                <div className="kotakinputfilterpenggunanama">
                                    <label><b>Nama</b> </label> <br></br>
                                    <input onChange={this.handleChange} className="inputformlogpintujurusan" type="text" placeholder="Nama" value={state.namafilterc || ''} required ></input>
                                </div>

                                <div className="kotakinputfilterpenggunakodematkul">
                                    <label><b>Kode Matakuliah</b> </label> <br></br>
                                    <input name="kodematkulfilterc" onChange={this.getNameMatkulFilter} className="inputformlogpintujurusan" type="text" placeholder="Kode Matkul..." required ></input>
                                </div>

                                <div className="kotakinputfilterpenggunanamamatkul">
                                    <label><b>Nama Matakuliah</b> </label> <br></br>
                                    <input value={state.namamatkulfilterc} onChange={this.handleChange} className="inputformlogpintujurusan" type="text" placeholder="Kode Matkul..." required ></input>
                                </div>

                                <div className="kotakinputfilterpenggunakelas">
                                    <label><b>Kelas</b> </label> <br></br>
                                    <input name="kelasfilterc" onChange={this.handleChange} className="inputformlogpintujurusan" type="text" placeholder="Kelas..." required ></input>
                                </div>

                                <div className="kotaksubmitpenggunadaftar">
                                    <input className="submitformlogpintu" type="submit" value="Add"></input>
                                </div>

                                <div className="kotakcancelpenggunadaftar">
                                    <button className="buttonlikea" onClick={() => this.hideDaftarFilter()}> <span className="cancelformpengguna">Cancel</span></button>
                                </div>
                            </form>
                        </div>
                    </div>
                }
                {
                    state.edit &&
                    <div>
                        <div className="kotakfilter2">
                            <form className="kotakforminputlogpintu" onSubmit={this.handleSubmitEdit}>
                                {
                                    state.databenar &&
                                    <span className="texthijau">{state.pesan}</span>
                                }
                                {
                                    state.datasalah &&
                                    <span className="textmerah">{state.pesan}</span>
                                }

                                <div className="kotakinputpenggunanimu">
                                    <label><b>NIP</b> </label> <br></br>
                                    <input name="nipu" onChange={this.handleChange} className="inputformlogpintunimu" type="text" placeholder="NIP" value={state.nipu || ''} required ></input>
                                </div>

                                <div className="kotakinputpenggunanamau">
                                    <label><b>Nama</b> </label> <br></br>
                                    <input name="namau" onChange={this.handleChange} className="inputformlogpintunimu" type="text" placeholder="Nama" value={state.namau || ''} required ></input>
                                </div>

                                <div className="kotakinputpenggunadeviceu">
                                    <label><b>Kode Device</b> </label> <br></br>
                                    <input name="kodedevice" onChange={this.handleChange} className="inputformlogpintunimu" type="text" placeholder="Kode Device" required ></input>
                                </div>

                                <div className="kotakinputpenggunafinger1u">
                                    <label><b>Finger1</b> </label> <br></br>
                                    <input onChange={this.handleChange} className="inputformlogpintunimu" type="text" placeholder="Finger 1" value={showfinger1 || ''} required ></input>
                                    <button type="button" className="submitfinger1" onClick={() => this.getFinger1()}><i className="fa fa-bullseye"></i></button>
                                </div>

                                <div className="kotakinputpenggunafinger2u">
                                    <label><b>Finger2</b> </label> <br></br>
                                    <input onChange={this.handleChange} className="inputformlogpintunimu" type="text" placeholder="Finger 2" value={showfinger2 || ''} required ></input>
                                    <button type="button" className="submitfinger2" onClick={() => this.getFinger2()}><i className="fa fa-bullseye"></i></button>
                                </div>

                                <div className="kotaksubmitpenggunadaftar">
                                    <input className="submitformlogpintu" type="submit" value="Edit"></input>
                                </div>

                                <div className="kotakcancelpenggunadaftar">
                                    <button className="buttonlikea" onClick={() => this.hideEdit()}> <span className="cancelformpengguna">Cancel</span></button>
                                </div>
                            </form>
                        </div>
                    </div>
                }
                {(state.daftar === false) && (state.edit === false) && (state.daftarfilter === false) &&
                    <div className="kotakbagiandaftar">
                        <div className="kotakdaftarruangan">
                            <button className="buttonlikea" onClick={() => this.showPengguna("dosen")}>
                                <div className="daftar" style={{ width: "150px" }}>
                                    <span><b>Daftar Dosen</b></span>
                                </div>
                            </button>
                        </div>
                        {(state.pageshow === "dosen") &&
                            <div className="kotakdaftarruangan1">
                                <button className="buttonlikea" onClick={() => this.showDaftar()}>
                                    <div className="daftar">
                                        <i className="fa fa-plus"></i>
                                        <span><b>Dosen</b></span>
                                    </div>
                                </button>
                            </div>}
                        {(state.pageshow === "filterdosen") &&
                            <div className="kotakdaftarruangan1">
                                <button className="buttonlikea" onClick={() => this.showDaftarFilter()}>
                                    <div className="daftar">
                                        <i className="fa fa-plus"></i>
                                        <span><b>Mata Kuliah</b></span>
                                    </div>
                                </button>
                            </div>}
                        <div className="kotakfilterpengguna">
                            <input name="filternip" value={state.filternip || ''} onChange={this.handleChange} className="inputfilternim" type="text" placeholder="Masukkan NIP..." required ></input>
                            <button className="buttonlikea" onClick={() => this.showFilterPengguna("filterdosen", state.filternip)}>
                                <div className="tombolfilterpengguna">
                                    <i className="fa fa-search"></i>
                                    <span><b>&nbsp;&nbsp;&nbsp;Mata Kuliah Dosen</b></span>
                                </div>
                            </button>
                        </div>
                    </div>
                }
                {(state.pageshow === "dosen") &&
                    <div id={aksidata} className="kotakdata">
                        <div className="tampilkanpage">
                            <b>Tampilkan&nbsp;&nbsp;</b>
                            <select name="limit" onChange={this.handleFilter} className="inputfilterpagelogpintu" required>
                                <option value={10}> 10 </option>
                                <option value={20}> 20 </option>
                                <option value={30}> 30 </option>
                                <option value={40}> 40 </option>
                                <option value={50}> 50 </option>
                                <option value={100}> 100 </option>
                            </select>
                            <b> &nbsp; dari &nbsp;</b>
                            <b>{state.rowCount}</b>
                            <b>&nbsp;Data</b>
                        </div>
                        <div className="filtersearchlogpintu">
                            <span><b>Search&nbsp;&nbsp;</b></span>
                            <input name="search" onChange={this.handleFilter} className="inputfilterlogpintu" type="text" placeholder="search..." required></input>
                        </div>
                        <div className="marginbottom20px"></div>
                        <div className="isitabel">
                            <table className="tablepengguna">
                                <thead className="theadlog">
                                    <tr>
                                        <th className="fakultas" onClick={() => this.filter(state.page, "fakultas", state.ascdsc)}>Fakultas</th>
                                        <th className="jurusan" onClick={() => this.filter(state.page, "jurusan", state.ascdsc)}>Jurusan</th>
                                        <th className="nim" onClick={() => this.filter(state.page, "nip", state.ascdsc)}>NIP</th>
                                        <th className="nama" onClick={() => this.filter(state.page, "nama", state.ascdsc)}>Nama</th>
                                        {/* <th className="finger1" onClick={() => this.filter(state.page, "finger1", state.ascdsc)}>Finger1</th>
                  <th className="finger2" onClick={() => this.filter(state.page, "finger2", state.ascdsc)}>Finger2</th> */}
                                        <th className="keterangan">Keterangan</th>
                                    </tr>
                                </thead>
                                {(state.datakosong === false) &&
                                    <tbody className="tbodylog">
                                        {state.data.map(isidata => (
                                            <tr key={i++}>
                                                <td>{isidata.fakultas}</td>
                                                <td>{isidata.jurusan}</td>
                                                <td>{isidata.nip}</td>
                                                <td>{isidata.nama}</td>
                                                {/* <td>{isidata.finger1}</td>
                    <td>{isidata.finger2}</td> */}
                                                <td>
                                                    <div>
                                                        <button className="backgroundbiru" onClick={() => this.showEdit(isidata.nip, isidata.nip, isidata.nama, '', '')} >
                                                            Edit
                                                        </button>
                                                        &nbsp;
                                                        <button className="backgroundmerah" onClick={() => this.deletePengguna(isidata.nip)}>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>}
                                {(state.datakosong === true) &&
                                    <tbody className="tbodylog">
                                        <tr>
                                            <td colSpan="7">Data tidak ditemukan</td>
                                        </tr>
                                    </tbody>}
                            </table>
                        </div>
                        <div className="marginbottom20px"></div>
                        <div className="pagedata">
                            {showPrevious &&
                                <button className="pagesebelumnya" onClick={() => this.filter((state.page - 1), state.sortby, state.ascdsc)}>≪ Sebelumnya</button>
                            }
                            {(showPrevious === false) &&
                                <button className="pagesebelumnyanone">≪ Sebelumnya</button>
                            }
                            {
                                showNext &&
                                <button className="pageberikutnya" onClick={() => this.filter((state.page + 1), state.sortby, state.ascdsc)}>Berikutnya ≫</button>
                            }
                            {
                                (showNext === false) &&
                                <button className="pageberikutnyanone">Berikutnya ≫</button>
                            }
                        </div>
                    </div>}


                {(state.pageshow === "filterdosen") &&
                    <div id={aksidata} className="kotakdata">
                        <div>
                            <b>Nama: {state.namafilterc}</b>
                        </div>
                        <br></br>
                        <div className="tampilkanpage">
                            <b>Tampilkan&nbsp;&nbsp;</b>
                            <select name="limitfilter" onChange={this.handleFilter} className="inputfilterpagelogpintu" required>
                                <option value={10}> 10 </option>
                                <option value={20}> 20 </option>
                                <option value={30}> 30 </option>
                                <option value={40}> 40 </option>
                                <option value={50}> 50 </option>
                                <option value={100}> 100 </option>
                            </select>
                            <b> &nbsp; dari &nbsp;</b>
                            <b>{state.rowCount}</b>
                            <b>&nbsp;Data</b>
                        </div>
                        <div className="filtersearchlogpintu">
                            <span><b>Search&nbsp;&nbsp;</b></span>
                            <input name="searchfilter" onChange={this.handleFilter} className="inputfilterlogpintu" type="text" placeholder="search..." required></input>
                        </div>
                        <div className="marginbottom20px"></div>
                        <div className="isitabel">
                            <table className="tablefilterpengguna">
                                <thead className="theadlog">
                                    <tr>
                                        <th className="matkul" onClick={() => this.filter(state.pagefilter, "a.kodematkul", state.ascdscfilter)}>Kode Matakuliah</th>
                                        <th className="namamatkul" onClick={() => this.filter(state.pagefilter, "b.namamatkul", state.ascdscfilter)}>Nama Matakuliah</th>
                                        <th className="kelas" onClick={() => this.filter(state.pagefilter, "a.kelas", state.ascdscfilter)}>Kelas</th>
                                        <th className="keterangan">Keterangan</th>
                                    </tr>
                                </thead>
                                {(state.datakosong === false) &&
                                    <tbody className="tbodylog">
                                        {state.data.map(isidata => (
                                            <tr key={i++}>
                                                <td>{isidata.kodematkul}</td>
                                                <td>{isidata.namamatkul}</td>
                                                <td>{isidata.kelas}</td>
                                                <td>
                                                    <div>
                                                        <button className="backgroundmerah" onClick={() => this.deleteFilterPengguna(isidata.nip, isidata.nama, isidata.kodematkul, isidata.kelas)}>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>}
                                {(state.datakosong === true) &&
                                    <tbody className="tbodylog">
                                        <tr>
                                            <td colSpan="7">Data tidak ditemukan</td>
                                        </tr>
                                    </tbody>}
                            </table>
                        </div>
                        <div className="marginbottom20px"></div>
                        <div className="pagedata">
                            {showPrevious &&
                                <button className="pagesebelumnya" onClick={() => this.filter((state.pagefilter - 1), state.sortbyfilter, state.ascdscfilter)}>≪ Sebelumnya</button>
                            }
                            {(showPrevious === false) &&
                                <button className="pagesebelumnyanone">≪ Sebelumnya</button>
                            }
                            {
                                showNext &&
                                <button className="pageberikutnya" onClick={() => this.filter((state.pagefilter + 1), state.sortbyfilter, state.ascdscfilter)}>Berikutnya ≫</button>
                            }
                            {
                                (showNext === false) &&
                                <button className="pageberikutnyanone">Berikutnya ≫</button>
                            }
                        </div>
                    </div>}
            </div>
        )
    }
}

export default withRouter(Dosen);