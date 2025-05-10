import React, { Component } from 'react';
import "../css/Dashboard.css";
import { BASEURL, callApi, getSession, setSession } from '../api';
import Menubar from './Menubar';
import IncomeBills from './IncomeBills';
import FinanceInsurance from './FinanceInsurance';
import Caluculator from './Caluculator';
import Travel from './Travel';
import ReportAndAnalysis from './ReportAndAnalysis';
import ChatBot from './ChatBot';
export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { fullname: '', activeComponent: '' };
    this.showFullname = this.showFullname.bind(this);
    this.loadComponent = this.loadComponent.bind(this);
  }

  componentDidMount() {
    let csr = getSession("csrid");
    if (csr === "") this.logout();
    let data = JSON.stringify({ csrid: csr });
    callApi("POST", BASEURL + "users/getfullname", data, this.showFullname);
  }

  showFullname(response) {
    this.setState({ fullname: response });
  }

  logout() {
    setSession("csrid", "", -1);
    window.location.replace("/");
  }

  loadComponent(mid) {
    let components = {
      "1": <IncomeBills />,
      "2": <FinanceInsurance />,
      "3": <Caluculator />,
      "4": <ReportAndAnalysis/>,
      "5": <ChatBot/>

    };
    this.setState({ activeComponent: components[mid] });
  }

  render() {
    const { fullname, activeComponent } = this.state;
    return (
      <div className='dashboard'>
        <div className='headr'>
          <img className='log' src='./images/Screenshot 2025-05-09 183902.png' alt='logo' />
          <img className='logou' onClick={() => this.logout()} src='./images/logout.png' alt='logout' />
          <label>{fullname}</label>
        </div>
        <div className='men'>
          <Menubar onMenuClick={this.loadComponent} />
        </div>
        <div className='outle'>{activeComponent}</div>
      </div>
    );
  }
}
