import React, { Component } from "react";
import "../css/ProjectHomePage.css";
import { BASEURL, callApi,setSession } from "../api";

export class Projecthomepage extends Component {
  constructor() {
    super();
    this.userRegistration = this.userRegistration.bind(this);
    // this.getResponse = this.getResponse.bind(this);
    this.forgotPassword=this.forgotPassword.bind(this);
    this.signin=this.signin.bind(this);
    this.state = {
      activeFAQ: null,
    };
    
  }

  showSignin = () => {
    const popup = document.getElementById("popup");
    const signin = document.getElementById("signin");
    const signup = document.getElementById("signup");
    const popupHeader = document.getElementById("popupHeader");

    if (popup && signin && signup && popupHeader) {
      popupHeader.innerHTML = "Login";
      signin.style.display = "block";
      signup.style.display = "none";
      popup.style.display = "flex";
      username.value="";
      password.value="";
    }
  };

  showSignup = () => {
    const popup = document.getElementById("popup");
    const signin = document.getElementById("signin");
    const signup = document.getElementById("signup");
    const popupHeader = document.getElementById("popupHeader");

    if (popup && signin && signup && popupHeader) {
      popupHeader.innerHTML = "Sign Up";
      signin.style.display = "none";
      signup.style.display = "block";
      popup.style.display = "flex";
    }
  };
  
  closeSignin = (event) => {
    if (event.target.id === "popup") {
      const popup = document.getElementById("popup");
      if (popup) {
        popup.style.display = "none";
      }
    }
  };
  toggleFAQ = (index) => {
    this.setState((prevState) => ({
      activeFAQ: prevState.activeFAQ === index ? null : index,
    }));
  };
  
  userRegistration() {
    let fullname = document.getElementById("fullname");
    let email = document.getElementById("email");
    let role = document.getElementById("role");
    let signuppassword = document.getElementById("signuppassword");
    let confirmpassword = document.getElementById("confirmPassword");

    // Reset borders
    fullname.style.border = "";
    email.style.border = "";
    role.style.border = "";
    signuppassword.style.border = "";
    confirmpassword.style.border = "";

    // Validation checks
    if (fullname.value === "") {
      fullname.style.border = "1px solid red";
      fullname.focus();
      return;
    }
    if (email.value === "") {
      email.style.border = "1px solid red";
      email.focus();
      return;
    }
    if (role.value === "") {
      role.style.border = "1px solid red";
      role.focus();
      return;
    }
    if (signuppassword.value === "") {
      signuppassword.style.border = "1px solid red";
      signuppassword.focus();
      return;
    }
    if (confirmpassword.value === "") {
      confirmpassword.style.border = "1px solid red";
      confirmpassword.focus();
      return;
    }
    if (signuppassword.value !== confirmpassword.value) {
      signuppassword.style.border = "1px solid red";
      signuppassword.focus();
      return;
    }

    let data = JSON.stringify({
      fullname: fullname.value,
      email: email.value,
      role: role.value,
      password: signuppassword.value,
    });

    console.log("Sending Data:", data);

    callApi("POST", "http://localhost:8080/users/signup", data, this.getResponse);
  }

  getResponse(res) {
    console.log("API Response:", res); // Debugging

    if (!res || typeof res !== "string") {
      alert("Error: Invalid response from server.");
      return;
    }

    let resp = res.split("::");

    if (resp.length < 2) {
      alert( res);
      return;
    }

    alert(resp[1]);

    if (resp[0] === "200") {
      let signin = document.getElementById("signin");
      let signup = document.getElementById("signup");
      if (signin && signup) {
        signin.style.display = "block";
        signup.style.display = "none";
      }
    }
  }
  forgotPassword(){
    username.style.border="";
    if(username.value===""){
      username.style.border="1px solid red";
      username.focus()
      return;
    }
    let url="http://localhost:8080/users/forgotpassword/"+username.value;
    callApi("GET",url,"",this.forgotPasswordResponse);
  }
  forgotPasswordResponse(res){
   
    let data = res.split('::');
if (data[0] === "200") {
    responseDiv.innerHTML = `< br/><br/><label style='color:green'>${data[1]}</label>`;
} else {
    responseDiv.innerHTML = `<br/><br/><label style='color:red'>${data[1]}</label>`;
}

  }
  signin()
  {
    username.style.border = "";
    password.style.border = "";
    responseDiv.innerHTML = "";
    if(username.value === "")
    {
      username.style.border = "1px solid red";
      username.focus();
      return;
    }
    if(password.value === "")
      {
        password.style.border = "1px solid red";
        password.focus();
        return;
      }
      let data = JSON.stringify({
          email: username.value,
          password: password.value
      });
      callApi("POST", BASEURL + "users/signin", data, this.siginResponse);
  }

  siginResponse(res)
  {
    let rdata = res.split('::');
    if(rdata[0] === '200')
    {
      setSession("csrid", rdata[1],1);
      window.location.replace("/dashboard");
    }
    else
    {
      responseDiv.innerHTML = `<br/><br/><label style = "color:red">${rdata[1]}</label>`;
    }
  }
  render() {
    return (
      <div className="base">
        <div id="popup" onClick={this.closeSignin}>
          <div className="popupWindow">
            <div id="popupHeader" className="popupHeader">Login</div>
            <div id="signin" className="signin">
              <label>Username:</label>
              <input type="text" id="username" />
              <label>Password:</label>
              <input type="password" id="password" />
              <div className="forgotPassword">Forgot <label onClick={this.forgotPassword}>Password?</label></div>
              <button className="signinButton" onClick={this.signin}>Sign In</button>
              <div className="div1" id='responseDiv'></div>
              <div className="div2">
                Don't have an account? 
                <label onClick={this.showSignup} className="signupLink">SIGN UP NOW</label>
              </div>
            </div>

            <div id="signup" className="signup" style={{ display: "none" }}>
              <label>Fullname:</label>
              <input type="text" id="fullname" />
              <label>Email:</label>
              <input type="email" id="email" />
              <label className="rolerole">Select Role:</label>
              <select id="role">
                <option value=""></option>
                <option value="1">Admin</option>
                <option value="2">Employee</option>
                <option value="3">JobSeeker</option>
              </select>
              <label>Password:</label>
              <input type="password" id="signuppassword" />
              <label>Confirm Password:</label>
              <input className="lablepass" type="password" id="confirmPassword" />
              <button onClick={this.userRegistration} className="register">Register Now</button>
              <div className="div2">
                Already have an account? <label onClick={this.showSignin} className="signinLink">SIGN IN</label>
              </div>
            </div>
          </div>
        </div>

        <div className="header">
        <img src="/images/Screenshot 2025-05-09 183902.png" alt="Logo" className="logo" />
        <span className="logo-text">FIN TRACK</span>
          <div className="header-actions">
            <span onClick={this.showSignin} className="signin-text">Sign In</span>
            <img src="/images/user.png" alt="Logout" className="right-corner-logo" />
          </div>
        </div>

        <div className="container">
          <div className="container-content">
          <div className="left-texts">
          <div className="text1">"Take Control of Your Finances with Ease!"</div>
          <div className="text2">Managing money shouldn’t be stressful! Our Budget Planner helps you track income, control expenses, and achieve your financial goals effortlessly. With smart budgeting tools, real-time analytics, and personalized insights, you can save more, spend wisely, and plan for a secure future—all in one place. 💰 Set budgets 📊 Track expenses 🔔 Get smart alerts 🚀 Achieve financial freedom Start budgeting smarter today! ✅</div>
          <button className="button" onClick={this.showSignin}>Get Started</button>
          </div>
          
          <div className="right-image">
            <img src="/images/WhatsApp Image 2025-05-09 at 15.05.51_bfc7111d.jpg" alt="Home Visual" />
          </div>
          </div>
          <div className="info-sections">
 
          <div className="faq-section">
  <h2 className="faq">Budget Planner FAQs</h2>
  <div className="faq-item">
    <button className="faq-question" onClick={() => this.toggleFAQ(0)}>
      What is a Budget Planner?
    </button>
    <div className={`faq-answer ${this.state.activeFAQ === 0 ? "open" : ""}`}>
      A Budget Planner is a tool that helps you track income, monitor expenses, and plan your savings to meet financial goals.
    </div>
  </div>

  <div className="faq-item">
    <button className="faq-question" onClick={() => this.toggleFAQ(1)}>
      Is this tool free to use?
    </button>
    <div className={`faq-answer ${this.state.activeFAQ === 1 ? "open" : ""}`}>
      Yes, our Budget Planner is completely free to use for personal financial planning.
    </div>
  </div>

  <div className="faq-item">
    <button className="faq-question" onClick={() => this.toggleFAQ(2)}>
      Can I track expenses in real-time?
    </button>
    <div className={`faq-answer ${this.state.activeFAQ === 2 ? "open" : ""}`}>
      Absolutely! Our platform allows real-time expense tracking with smart alerts.
    </div>
  </div>

  <div className="faq-item">
    <button className="faq-question" onClick={() => this.toggleFAQ(3)}>
      How secure is my financial data?
    </button>
    <div className={`faq-answer ${this.state.activeFAQ === 3 ? "open" : ""}`}>
      Your data is encrypted and securely stored with strict privacy protocols.
    </div>
  </div>
</div>

  <div className="contact-us">
    <h2>Contact Us</h2>
    <form className="contact-form">
      <label>Name:</label>
      <input type="text" placeholder="Your Name" />
      <label>Email:</label>
      <input type="email" placeholder="Your Email" />
      <label>Message:</label>
      <textarea rows="4" placeholder="Your Message"></textarea>
      <button type="submit">Send</button>
    </form>
  </div>
</div>

        </div>

       <div id='footer'>
          <label className='copyrightText'>Copyright&copy;TEAM. V- KLUniversity.All rights reserved</label>
          <img className='socialmediaIcon' src='./images/facebook.png'/>
          <a href='https://www.linkedin.com/pulse/budget-planner-mohana-dhathri-poola-imf9c/?trackingId=NVUxQN4gVxFBSsZwCxY4kA%3D%3D'> <img className='socialmediaIcon' src='./images/linkedin.png'/></a>
          <img className='socialmediaIcon' src='./images/twitter.png'/>
        <a href='https://youtu.be/cmO7eOpUGJ0?si=MBj9VaZMp9QMDs9r'> <img className='socialmediaIcon'  src='./images/you.jpeg'/></a> 

</div>
      </div>
    );
  }
}

export default Projecthomepage;