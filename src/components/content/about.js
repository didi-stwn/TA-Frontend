import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import logo from './img/meme.jpg'
import paktrio from './img/paktrio.jpg'
import didi from './img/didi.png'

class About extends Component {
    render() {
        return (
            <div className="box-footer">
                <div style={{ marginBottom: '20px', color: 'rgb(0,0,100)', display: 'block', textAlign: 'center' }}>
                    <h1 style={{ letterSpacing: '2px', fontFamily: 'Times New Roman', fontWeight: '900' }}>TA1920.01.026</h1>
                    <h1 style={{ letterSpacing: '2px', fontFamily: 'Times New Roman', fontWeight: '900' }}>"Sistem Pencatatan Kehadiran Mahasiswa"</h1>
                </div>
                <div className="texttengah">
                    <div style={{ maxWidth: '400px', overflowX: 'scroll' }}>
                        <div style={{ marginBottom: '20px', color: 'rgb(0,0,100)', display: 'block', textAlign: 'center' }}>
                            <h3 style={{ letterSpacing: '2px', fontFamily: 'Times New Roman', fontWeight: '900' }}>DOSEN PEMBIMBING</h3>
                        </div>
                        <img className="fotoabout" src={paktrio} alt="mori" />
                        <div style={{ color: 'rgb(0,0,100)', marginTop: '10px', display: 'block', textAlign: 'center' }}>
                            <h4>Prof. Trio Adiono ST., MT., Ph.D.</h4>
                            <span>19700824 199702 1 001</span>
                        </div>
                    </div>
                </div>
                <div className="paddingtop30px2"></div>
                <div style={{ marginBottom: '20px', color: 'rgb(0,0,100)', display: 'block', textAlign: 'center' }}>
                    <h3 style={{ letterSpacing: '2px', fontFamily: 'Times New Roman', fontWeight: '900' }}>ANGGOTA TIM</h3>
                </div>
                <div className="texttengah">
                    <div style={{ maxWidth: '800px', overflowX: 'scroll' }}>
                        <div className="texttengah" style={{ width: '800px' }}>
                            <div>
                                <img className="fotoabout" src={logo} alt="mori" />
                                <div style={{ color: 'rgb(0,0,100)', marginTop: '20px', display: 'block', textAlign: 'center' }}>
                                    <h4>Maurizfa</h4>
                                    <span>13216008</span>
                                </div>
                            </div>
                            <div style={{ marginLeft: '100px' }}>
                                <img className="fotoabout" src={logo} alt="jason" />
                                <div style={{ color: 'rgb(0,0,100)', marginTop: '20px', display: 'block', textAlign: 'center' }}>
                                    <h4>Jason William S</h4>
                                    <span>13216105</span>
                                </div>
                            </div>
                            <div style={{ marginLeft: '100px' }}>
                                <img className="fotoabout" src={didi} alt="didi" />
                                <div style={{ color: 'rgb(0,0,100)', marginTop: '20px', display: 'block', textAlign: 'center' }}>
                                    <h4>Didi Setiawan</h4>
                                    <span>13216108</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="paddingtop30px2"></div>
                <div className="paddingtop30px2"></div>
                <div className="paddingtop30px2"></div>
                <div style={{ display: 'block', textAlign: 'center' }}>
                    <h5 style={{ color: 'rgb(0,0,100)', fontFamily: 'Courier' }}>Copyright &#169;2017</h5>
                    <span >AdminLTE v2.4.0 by Almsaeed Studio</span><br />
                    <a href="https://adminlte.io">https://adminlte.io</a><br />
                    <span>License: Open source - MIT</span>
                </div>
            </div>
        )
    }
}

export default withRouter(About);