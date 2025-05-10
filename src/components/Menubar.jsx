import React, { Component } from 'react';
import "../css/Menubar.css";
import { BASEURL, callApi, getSession } from '../api';

export class Menubar extends Component {
  constructor() {
    super();
    this.state = { menuItems: [] };
    this.loadMenus = this.loadMenus.bind(this);
  }

  componentDidMount() {
    let csr = getSession("csrid");
    let data = JSON.stringify({ csrid: csr });
    callApi("POST", BASEURL + "menus/getmenusbyrole", data, this.loadMenus);
  }

  loadMenus(response) {
    let data = JSON.parse(response);
    this.setState({ menuItems: data });
  }

  render() {
    const { menuItems } = this.state;
    return (
      <div className='menubar'>
        <div className='menuheader'>
          <img src='/images/menu.png' alt='menu icon' /> MENU
        </div>
        <div className='menulist'>
          <ul>
            {menuItems.map((row) => (
              <li key={row.mid} onClick={() => this.props.onMenuClick(String(row.mid))}>
                <img src={row.icon} alt='' />
                {row.menu}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Menubar;
