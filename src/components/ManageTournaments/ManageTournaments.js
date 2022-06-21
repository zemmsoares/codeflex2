import React, { useEffect, useState } from 'react'
import { dateWithHoursAndDay, getAuthorization, parseLocalJwt, splitUrl, textToLowerCaseNoSpaces } from '../commons/Utils';
import { URL } from '../commons/Constants';
import PathLink from '../PathLink/PathLink';
import { Link, useLocation } from 'react-router-dom';

function ManageTournaments() {

    const [location2, setLocation2] = useState('');
    const [tournaments, setTournaments] = useState([]);
    const [redirectDestination, setRedirectDestination] = useState('');

    const location = useLocation();

    useEffect(() => {
        fetchTournaments();
        setLocation2(splitUrl(location.pathname)[0])
    }, [])

    function fetchTournaments() {
        let location2 = splitUrl(location.pathname)[0];
        if (location2 === 'compete') {
            fetch(URL + '/api/database/Tournament/viewAllWithRegisteredUsersByOwnerUsername/' + parseLocalJwt().username, {
                headers: { ...getAuthorization() }
            }).then(res => res.json())
                .then(data => {
                    setTournaments(data)
                })
        } else if (location2 === 'manage') {
            console.log('fetching public tournaments')
            fetch(URL + '/api/database/Tournament/viewAllPublicTournaments', {
                headers: { ...getAuthorization() }
            }).then(res => res.json())
                .then(data => {
                    setTournaments(data)
                })
        }
    }

    function onIconDelete(tournamentName) {
        console.log('Deleting')
        tournamentName = textToLowerCaseNoSpaces(tournamentName);
        const data = {
            tournament: { name: tournamentName }
        }
        fetch(URL + '/api/database/Tournament/deleteByName/' + tournamentName, {
            method: 'POST',
            headers: {
                ...getAuthorization()
            }
        }).then(() => {
            fetchTournaments();
        });
    }


    function onIconClick(e, name) {

        let destination = textToLowerCaseNoSpaces(name);

        switch (e.target.id) {
            case 'visibility':

                setRedirectDestination('visibility')

                if (location2 === 'compete') {
                    window.location.href = "/compete/manage-tournaments/" + destination;
                } else {
                    window.location.href = "/manage/tournaments/" + destination;
                }

                break;
            case 'delete':
                setRedirectDestination('delete')
                break;
            case 'edit':

                setRedirectDestination('edit')

                if (location2 === 'compete') {
                    window.location.href = "/compete/manage-tournaments/" + textToLowerCaseNoSpaces(name) + "/edit";
                } else {
                    window.location.href = "/manage/tournaments/" + textToLowerCaseNoSpaces(name) + "/edit"
                }
                break;
            default:
                break;
        }

    }


    const rows = tournaments.length;

    return (
        <div className="container">
            <div className="row">

                <PathLink path={location.pathname} title="Manage tournaments" />
                {tournaments.length > 0 ?
                    <div>
                        {/* DO REACT TABLE DO REACT TABLE DO REACT TABLE DO REACT TABLE DO REACT TABLE  */}
                    </div> : <h3 className="no-data-h3">There are no tournaments created.</h3>}
            </div>
            <Link to={location2 === 'compete' ? "/compete/create-tournament" : "/manage/tournaments/add"}> <input type="button" style={{ float: 'right', marginTop: '25px', marginRight: '0' }} className="btn btn-codeflex" value="Create tournament" /></Link>
        </div>
    )
}

export default ManageTournaments