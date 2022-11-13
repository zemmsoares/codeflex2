import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import Login from "./components/Users/Login/Login";
import ProfilePage from "./components/Users/ProfilePage/ProfilePage";
import { parseLocalJwt, getAuthorization } from "./components/commons/Utils";
import Dashboard from "./components/Dashboard/Dashboard";
import ListCategories from "./components/ListCategories/ListCategories";
import ListProblems from "./components/ListProblems/ListProblems";
import Problem from "./components/Problem/Problem";
import GlobalLeaderboard from "./components/GlobalLeaderboard/GlobalLeaderboard";
import ManageProblems from "./components/ManageProblems/ManageProblems";
import AddProblem from "./components/Problem/AddProblem/AddProblem";
import CreateTournament from "./components/CreateTournament/CreateTournament";
import ManageTestCases from "./components/ManageTestCases/ManageTestCases";
import ListTournaments from "./components/ListTournaments/ListTournaments";
import ManageTournaments from "./components/ManageTournaments/ManageTournaments";
import ManageContent from "./components/ManageContent/ManageContent";
import ManageCategories from "./components/ManageCategories/ManageCategories";
import Home from "./components/Home/Home";
import TournamentLeaderboard from "./components/TournamentLeaderboard/TournamentLeaderboard";
import ViewResults from "./components/ViewResults/ViewResults";

import ManageExample from "./components/ManageExample/ManageExample";
import Exam from "./components/Exam/Exam";
import ManageTournamentSubmissions from "./components/ManageTournamentSubmissions/ManageTournamentSubmissions";

export class App extends Component {
  constructor(props) {
    super(props);
  }

  manageSectionControl = () => {
    if (this.userLoggedIn()) {
      let jwt = parseLocalJwt();
      if (jwt) {
        if (typeof jwt !== "undefined" && jwt.role === "CONTENT_MANAGER") {
          return true;
        }
      }
    }
    return false;
  };

  isUserTournamentOwner = () => {
    fetch(
      URL +
        "/api/database/tournament/isUserTournamentOwner/" +
        this.props.match.params.tournamentName +
        "/" +
        parseLocalJwt().username,
      {
        headers: new Headers({ ...getAuthorization() }),
      }
    ).then((res) => {
      if (res.status === 200) {
        this.setState({ userIsOwner: true });
      } else {
        this.setState({ userIsOwner: false });
      }
    });
  };

  userLoggedIn = () => {
    return localStorage.getItem("token") != null ? true : false;
  };

  render() {
    if (this.userLoggedIn()) {
      return (
        <main className="flex">
          <Router>
            <div>
              <NavBar />
            </div>
            <div className={`w-full bg-gray-50 `}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/leaderboard" element={<GlobalLeaderboard />} />
                <Route path="/user/:username" element={<ProfilePage />} />
                <Route
                  path="/practise/:categoryName/:problemName/view-results"
                  element={<ViewResults />}
                />
                <Route
                  path="/practise/:categoryName/:problemName"
                  element={<Problem />}
                />
                <Route
                  path="/practise/:categoryName"
                  element={<ListProblems />}
                />
                <Route path="/practise" element={<ListCategories />} />
                <Route path="/exam" element={<Exam />} />
                <Route path="/404" element={<PageNotFound />} />
                <Route path="*" element={<PageNotFound />} />

                <Route
                  path="/compete/manage-tournaments/:tournamentName/:problemName/test-cases"
                  element={<ManageTestCases />}
                />
                <Route
                  path="/compete/manage-tournaments/:tournamentName/:problemName/edit"
                  element={<AddProblem />}
                />
                <Route
                  path="/compete/manage-tournaments/:tournamentName/edit"
                  element={<CreateTournament />}
                />
                <Route
                  path="/compete/manage-tournaments/:tournamentName/add"
                  element={<AddProblem />}
                />
                <Route
                  path="/compete/manage-tournaments/:tournamentName"
                  element={<ManageProblems />}
                />
                <Route
                  path="/compete/create-tournament"
                  element={<CreateTournament />}
                />
                <Route
                  path="/compete/manage-tournaments"
                  element={<ManageTournaments />}
                />
                <Route path="/compete" element={<ListTournaments />} />

                <Route
                  path="/compete/:tournamentName/leaderboard"
                  element={<TournamentLeaderboard />}
                />
                <Route
                  path="/compete/:tournamentName/edit"
                  element={<CreateTournament />}
                />
                <Route
                  path="/compete/:tournamentName/:problemName"
                  element={<Problem />}
                />
                <Route
                  path="/compete/:tournamentName"
                  element={<ListProblems />}
                />

                <Route
                  path="/compete/:tournamentName/:problemName/view-results"
                  element={<ViewResults />}
                />

                {/* REACT.FRAGMENT is breaking the switch */}
                {this.manageSectionControl() ? (
                  <Route path="/manage" element={<ManageContent />} />
                ) : (
                  ""
                )}
                {this.manageSectionControl() ? (
                  <Route path="/manage/problems" element={<ManageProblems />} />
                ) : (
                  ""
                )}
                {this.manageSectionControl() ? (
                  <Route path="/manage/problems/add" element={<AddProblem />} />
                ) : (
                  ""
                )}
                {this.manageSectionControl() ? (
                  <Route
                    path="/manage/problems/:problemName/edit"
                    element={<AddProblem />}
                  />
                ) : (
                  ""
                )}
                {this.manageSectionControl() ? (
                  <Route
                    path="/manage/problems/:problemName/test-cases"
                    element={<ManageTestCases />}
                  />
                ) : (
                  ""
                )}
                {this.manageSectionControl() ? (
                  <Route
                    path="/manage/tournaments"
                    element={<ManageTournaments />}
                  />
                ) : (
                  ""
                )}
                {this.manageSectionControl() ? (
                  <Route
                    path="/manage/tournaments/add"
                    element={<CreateTournament />}
                  />
                ) : (
                  ""
                )}
                {this.manageSectionControl() ? (
                  <Route
                    path="/manage/tournaments/:tournamentName/edit"
                    element={<CreateTournament />}
                  />
                ) : (
                  ""
                )}
                {this.manageSectionControl() ? (
                  <Route
                    path="/manage/tournaments/:tournamentName/add"
                    element={<AddProblem />}
                  />
                ) : (
                  ""
                )}
                {this.manageSectionControl() ? (
                  <Route
                    path="/manage/tournaments/:tournamentName"
                    element={<ManageProblems />}
                  />
                ) : (
                  ""
                )}
                {this.manageSectionControl() ? (
                  <Route
                    path="/manage/tournaments/submissions/:tournamentName"
                    element={<ManageTournamentSubmissions />}
                  />
                ) : (
                  ""
                )}
                {this.manageSectionControl() ? (
                  <Route
                    path="/manage/tournaments/:tournamentName/:problemName"
                    element={<ManageProblems />}
                  />
                ) : (
                  ""
                )}
                {this.manageSectionControl() ? (
                  <Route
                    path="/manage/tournaments/:tournamentName/:problemName/edit"
                    element={<AddProblem />}
                  />
                ) : (
                  ""
                )}
                {this.manageSectionControl() ? (
                  <Route
                    path="/manage/tournaments/:tournamentName/:problemName/test-cases"
                    element={<ManageTestCases />}
                  />
                ) : (
                  ""
                )}
                {this.manageSectionControl() ? (
                  <Route
                    path="/manage/categories"
                    element={<ManageCategories />}
                  />
                ) : (
                  ""
                )}

                {this.manageSectionControl() ? (
                  <Route path="/manage/v2" element={<ManageExample />} />
                ) : (
                  ""
                )}
              </Routes>
            </div>
            <div style={{ marginBottom: "75px" }}></div>
          </Router>
        </main>
      );
    } else {
      return (
        <main>
          <Router>
            <div className="w-screen">
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
          </Router>
        </main>
      );
    }
  }
}

export default App;
