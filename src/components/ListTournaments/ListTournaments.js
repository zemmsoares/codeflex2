import React, { useEffect, useState } from 'react'
import { Link, Navigate, Route, useLocation } from 'react-router-dom';
import { URL } from '../commons/Constants'
import { dateWithHoursAndDay, getAuthorization, getTimeHoursMinsText, parseLocalJwt, textToLowerCaseNoSpaces } from '../commons/Utils';
import PathLink from '../PathLink/PathLink';

function ListTournaments() {

    const [tournaments, setTournaments] = useState([]);
    const [redirect, setRedirect] = useState({ now: false, path: '/' });
    const [displayInputCode, setDisplayInputCode] = useState(false);
    const [privateCode, setPrivateCode] = useState('');

    const location = useLocation();

    useEffect(() => {
        fetchTournamentList();
        window.updateEveryMinute = setInterval(() => {
            fetchTournamentList();
        }, 10000);
    }, [])

    useEffect(() => {
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
            clearInterval(window.updateEveryMinute);
        }
    }, [])

    function fetchTournamentList() {
        fetch(URL + '/api/database/Tournament/viewTournamentsToList/' + parseLocalJwt().username, {
            headers: { ...getAuthorization() }
        }).then(res => res.json()).then(data => {
            setTournaments(data);
        })
    }

    function onInputChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    function onClickTournament(clickType, tournamentId, tournamentName) {
        if (clickType === 'Sign Up') {
            onClickRegister(tournamentId);
            console.log('sign')
        } else if (clickType === 'Starting soon') {
        } else if (clickType === 'Enter') {
            setRedirect({ now: true, path: '/compete/' + textToLowerCaseNoSpaces(tournamentName) })
        }
    }

    function onClickRegister(tournamentId) {
        const data = {
            user: { username: parseLocalJwt().username },
            tournament: { id: tournamentId }
        }
        registerUser(data);
    }

    function registerUser(data) {

        fetch(URL + '/api/database/Tournament/registerUser', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                ...getAuthorization(),
                'Content-Type': 'application/json'
            })
        }).then(res => res.json()).then(data => {
            setTournaments(data);
        })
    }

    function onClickPrivateTournament() {
        setDisplayInputCode(!displayInputCode)
    }

    function onClickEnterPrivateTournament() {
        const data = {
            user: { username: parseLocalJwt().username },
            tournament: { code: privateCode }
        }
        registerUser(data);
        setDisplayInputCode(false);
    }

    let availableTournaments = '';
    let archivedTournaments = '';

    if (typeof tournaments.availableTournaments !== 'undefined') {
        // TODO @Review Is this sorting working
        availableTournaments = tournaments.availableTournaments.sort((a, b) => a.tournament.endingDate - b.tournament.endingDate).map(t => (
            <div className="tournament-container">
                <div key={t.tournament.id} className="col-sm-10 col-md-10 col-xs-12">
                    <p style={{ fontSize: '15pt' }}>{t.tournament.name}</p>
                    <p>{t.tournament.description}</p>
                    {new Date(t.tournament.startingDate).getTime() > new Date().getTime() ? <p style={{ fontSize: '11pt' }} className="green-text">Starting at {dateWithHoursAndDay(t.tournament.startingDate)}</p>
                        : <p style={{ fontSize: '11pt' }} className="red-text">Finishing in {getTimeHoursMinsText(new Date(t.tournament.endingDate).getTime() - new Date().getTime())}</p>}
                </div>
                <div className="col-sm-2 col-md-2 col-xs-4 button-container-tournaments" >
                    <input type="submit" className="btn btn-codeflex" value={
                        t.registered ? (new Date(t.tournament.startingDate).getTime() >= new Date().getTime() ? 'Starting soon' : 'Enter') : 'Sign Up'
                    }
                        onClick={(e) => onClickTournament(e.target.value, t.tournament.id, t.tournament.name)} />
                </div>
            </div>
        ))
    }

    if (typeof tournaments.archivedTournaments !== 'undefined') {
        console.log('teste')
        archivedTournaments = tournaments.archivedTournaments.map(t => (
            <div className="tournament-container">
                <div key={t.tournament.id} className="col-sm-10 col-md-10 col-xs-12">
                    <p style={{ fontSize: '15pt' }}>{t.tournament.name}</p>
                    <p>{t.tournament.description}</p>
                </div>
                <div className="col-sm-2 col-md-2 col-xs-4 button-container-tournaments" >
                    <div><Link to={"/compete/" + textToLowerCaseNoSpaces(t.tournament.name)}> <input type="submit" className="btn btn-codeflex" value="View Problems" /></Link></div>
                    <div><Link to={"/compete/" + textToLowerCaseNoSpaces(t.tournament.name) + "/leaderboard"}> <input type="submit" className="btn btn-codeflex" value="Leaderboard" /></Link></div>
                </div>
            </div>
        ))
    }

    const PopupInformation = () => (
        <div>
            <h2 style={{ color: 'white', margin: 'auto' }}>teste</h2>
            <p style={{ color: 'white', margin: 'auto', textAlign: 'center' }}>fasfasfafs</p>
        </div>
    );

    return (
        <div className="container">
            <div className="row">
                <PathLink path={location.pathname} title="Tournaments" />
                <div className="col-sm-12 both-categories-container">
                    <br />
                    <div style={{ float: 'right', textAlign: 'right', marginTop: '-30px' }}>
                        {displayInputCode ? <div className="private-code">
                            <input type="text" className="textbox-no-radius" style={{ height: '25px', marginBottom: '7px' }} placeholder="Tournament Private Code"
                                name="privateCode" onChange={(e) => onInputChange(e)} value={privateCode} />
                            <input style={{ maxHeight: '25px' }} type="button" className="" value="Register" onClick={onClickEnterPrivateTournament} />
                        </div> :
                            <a>
                                <p onClick={onClickPrivateTournament} style={{ cursor: 'pointer' }}>Register in private tournament</p>
                            </a>}
                        <Link to="/compete/create-tournament"> <p>Create tournament</p></Link>
                        <Link to="/compete/manage-tournaments"><p >Manage tournaments</p></Link>
                    </div>
                    <h2 style={{ fontFamily: 'Roboto Condensed' }}>Available</h2>
                    <hr style={{ border: '0 none', height: '2px', color: '#6a44f', backgroundColor: '#6a44ff' }} />
                    <div className="tournaments-container">
                        {availableTournaments}
                    </div>
                    <h2 style={{ fontFamily: 'Roboto Condensed' }}>Finished</h2>
                    <hr style={{ border: '0 none', height: '2px', color: '#6a44f', backgroundColor: '#6a44ff' }} />
                    <div className="tournaments-container">
                        {archivedTournaments}
                    </div>
                </div>

                {redirect.now ? <Route path="*" element={<Navigate replace to={redirect.path} />} /> : ''}

            </div>
        </div >
    )
}

export default ListTournaments