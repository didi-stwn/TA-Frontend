import React, { Component } from 'react';
import logo from "./img/logoitb.png"
import { withRouter } from 'react-router-dom'

class Home extends Component {
    render() {
        return (
            <div>
                <div className="kotakhomexirka">
                    <div>
                        <div>
                            <img className="homexirka" src={logo} alt="home" />
                        </div>
                        <div>
                            <span className="welcometo"><b>WELCOME TO</b></span>
                            <span className="welcometoxirka"><b>Institute Teknologi Bandung</b></span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Home);