import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import NavBar from "./components/NavBar/NavBar";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import PageWrapper from "./components/PageWrapper/PageWrapper";
import Login from "./components/Users/Login/Login";
import ProfilePage from "./components/Users/ProfilePage/ProfilePage";

import { parseLocalJwt, splitUrl, getAuthorization } from './components/commons/Utils';
import Dashboard from "./components/Dashboard/Dashboard";
import ListCategories from "./components/ListCategories/ListCategories";
import ListProblems from "./components/ListProblems/ListProblems";
import Problem from "./components/Problem/Problem";

export class App extends Component {
  constructor(props) {
    super(props);
  }

  manageSectionControl = () => {
    if (this.userLoggedIn()) {
      let jwt = parseLocalJwt();
      if (jwt) {
        if (typeof jwt !== "undefined" && jwt.role === 'CONTENT_MANAGER') {
          return true;
        }
      }
    }
    return false;
  }

  isUserTournamentOwner = () => {
    fetch(URL + '/api/database/tournament/isUserTournamentOwner/' + this.props.match.params.tournamentName + "/" + parseLocalJwt().username, {
      headers: new Headers({ ...getAuthorization() })
    }).then(res => { if (res.status === 200) { this.setState({ userIsOwner: true }); } else { this.setState({ userIsOwner: false }); } })
  }

  userLoggedIn = () => {
    return localStorage.getItem('token') != null ? true : false;
  }

  render() {

    if (this.userLoggedIn()) {
      return (
        <main class="flex">
          <Router>
            <div className="w-64 h-screen bg-gray-50">
              <NavBar />
            </div>
            <div className="flex flex-col justify-between w-screen ">
              <Routes>

                <Route path="/" element={<Dashboard />} />
                <Route path="/user/:username" element={<ProfilePage />} />

                <Route path="/practise/:categoryName/:problemName" element={<Problem />} />
                <Route path="/practise/:categoryName" element={<ListProblems />} />
                <Route path="/practise" element={<ListCategories />} />

                <Route path="/404" element={<PageNotFound />} />
                <Route path="*" element={<PageNotFound />} />

              </Routes>
            </div>
            <div style={{ marginBottom: '75px' }}></div>
          </Router >
        </main>
      )
    } else {
      return (
        <main class="">
          <Router>
            <div className="w-screen h-16" >
              <div className="w-screen">
                <NavBar />
              </div>
            </div>
            <div className=" w-screen">
              <Routes>
                {/*<Route exact path="/" component={PageWrapper(LandingPage)} />*/}
                <Route path="/" element={<Login />} />

                {/*<Route exact path="/login" component={PageWrapper(Login)} />*/}
                <Route path="/login" element={<Login />} />

                {/*<Route exact path="/user/:username" component={PageWrapper(ProfilePage)} />*/}
                <Route path="/user/:username" element={<ProfilePage />} />

                {/*<Route component={PageWrapper(PageNotFound)} />*/}
                <Route path="*" element={<PageNotFound />} />

              </Routes>
            </div>
            <div style={{ marginBottom: '75px' }}></div>
          </Router>
        </main>
      )
    }
  }
}


export default App;
