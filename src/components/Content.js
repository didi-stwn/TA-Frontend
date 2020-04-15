import React, {Component} from 'react';
import {Route,withRouter,Link} from "react-router-dom";
import { AnimatedSwitch } from 'react-router-transition';
import Log from './content/log';
import Mahasiswa from './content/mahasiswa';
import Dosen from './content/dosen';
import Ruangan from './content/ruangan';
import MenuMatkul from './content/menumatkul';
import Fakultas from './content/fakultas';
import MenuLaporan from './content/menulaporan';
import Bantuan from './content/bantuan';
import Home from './content/home';
import Statistik from './content/statistik';


class Content extends Component {
    render(){
      document.title="Admin"
        return (
          <div>
          <div className="content-wrapper">
            
            <AnimatedSwitch
              atEnter={{ opacity: 0 }}
              atLeave={{ opacity: 0 }}
              atActive={{ opacity: 1 }}
              className="switch-route"
            >
              <Route exact path="/" component={Home} />
              <Route path="/statistik" render={ () => <Statistik/> } />
              <Route path="/log" render={ () => <Log/> } />
              <Route path="/mahasiswa" render={ () => <Mahasiswa/> } />
              <Route path="/dosen" render={ () => <Dosen/> } />
              <Route path="/ruangan" render={ () => <Ruangan/> } />
              <Route path="/matakuliah" render={ () => <MenuMatkul/> } />
              <Route path="/fakultas" render={ () => <Fakultas/> } />
              <Route path="/laporan" render={ () => <MenuLaporan/> } />
              <Route path="/bantuan" render={ () => <Bantuan/> } />
              <Route render={()=>
                <div className="box-footer">
                  404 NOT FOUND
                  <br></br>
                  <br></br>
                  Go to
                  <Link className="kotakgotohome" to="/">
                    <div className="gotohome">
                      <span>Home
                      </span>
                    </div> 
                  </Link>
                </div>
              } />
            </AnimatedSwitch>
          </div> 
          </div>
        )
    }
}

export default withRouter(Content);
