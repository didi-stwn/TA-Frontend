import React from 'react';
import logo from './img/logoitb.png';
import get from './config';
import { Route, Redirect, withRouter } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            pesan: '',
            gagal: false,
            isLogin: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    // componentDidMount(){
    //     for (var i = 0; i<1000 ; i++){
    //         fetch("http://localhost:3000/coba", {
    //             method: 'post',
    //             headers :{"Content-Type" : "application/json"},
    //             body: JSON.stringify({
    //                 nama: i,
    //                 waktu: "2019-01-01 01:01:01"
    //                 })
    //         })
    //         .then (response =>response.json())  
    //         .then (response =>{
    //             if (response.status===1){
    //                 console.log("Berhasil")
    //             }
    //             else{
    //                 console.log("Gagal")
    //             }
    //         })
    //     }
    // }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        const { username, password } = this.state
        fetch(get.login, {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
            .then(response => response.json())
            .then(response => {
                if (response.status === 0) {
                    this.setState({ gagal: true })
                    this.setState({ pesan: '*username or password is incorrect' })
                    setTimeout(() => { this.setState({ gagal: false }) }, 4000);
                }
                else {
                    sessionStorage.setItem("name", response.token)
                    this.setState({ isLogin: true })
                }
            })
            .catch(error => {
                this.setState({ gagal: true })
                this.setState({ pesan: '*Connection loss' })
                setTimeout(() => { this.setState({ gagal: false }) }, 4000);
            })
    }
    render() {
        const { isLogin } = this.state
        document.title = "Login"
        const { gagal } = this.state;
        return (
            <div className="login">
                <div className="backgroundlogin"></div>
                <div className="backgroundloginn">
                    <div className="paddingtop100px"></div>
                    <div className="backgroundloginnn">
                        <div className="imglogin">
                            <img src={logo}></img>
                        </div>
                        <div className="formform">
                            <form onSubmit={this.handleSubmit}>
                                <label className="loginnim">Username</label> <br></br>
                                <input className="inputnim" name="username" placeholder="Input Username ..." onChange={this.handleChange} type="text" required />
                                <br></br>
                                <label className="loginpass">Password</label> <br></br>
                                <input className="inputnim" name="password" placeholder="Input Password ..." onChange={this.handleChange} type="password" required />
                                <br></br>
                                {
                                    gagal &&
                                    <p className="gagallogin">{this.state.pesan}</p>
                                }
                                <button className="submitform" type="submit">
                                    <span>
                                        <span>
                                            Login&nbsp;
                                        </span>
                                    </span>
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="paddingtop100px"></div>
                    {
                        isLogin &&
                        <Redirect to="/" />
                    }
                </div>
            </div>
        )
    }
}
// background-image: url('../img/logoitb.png')