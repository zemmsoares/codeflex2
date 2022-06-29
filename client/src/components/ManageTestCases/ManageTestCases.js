import React, { useEffect, useRef, useState } from 'react';
import PathLink from '../PathLink/PathLink'
import Popup from '../Popup/Popup';
import LoadFiles from '../LoadFiles/LoadFiles';

import { URL } from '../commons/Constants';
import { splitUrl, getAuthorization, parseLocalJwt, getRndInteger, readFile, isContentManager } from '../commons/Utils';

import './ManageTestCases.css';
import PageNotFound from '../PageNotFound/PageNotFound';
import { useLocation, useParams } from 'react-router-dom';

function ManageTestCases() {

    const [userIsOwner, setUserIsOwner] = useState(true);
    const [testCases, setTestCases] = useState([]);
    const [input, setInput] = useState('');
    const [popupInfo, setPopupInfo] = useState([]);
    const [currentTestCase, setCurrentTestCase] = useState(0);
    const [currentMode, setCurrentMode] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [addingTestCase, setAddingTestCase] = useState(false);
    const [inputNew, setInputNew] = useState('');
    const [outputNew, setOutputNew] = useState('');
    const [descriptionNew, setDescriptionNew] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [currentText, setCurrentText] = useState('');

    const { problemName } = useParams();
    const { tournamentName } = useParams();
    const location = useLocation();

    const newInput = useRef();
    const newOutput = useRef();
    const newDescription = useRef();

    const modalAdd = useRef();
    const modalEdit = useRef();


    useEffect(() => {
        if (!isContentManager()) {
            isUserTournamentOwner();
        }
        fetchTestCases();
    }, [])

    function isUserTournamentOwner() {
        fetch(URL + '/api/database/tournament/isUserTournamentOwner/' + tournamentName + "/" + parseLocalJwt().username, {
            headers: new Headers({ ...getAuthorization() })
        }).then(res => {
            if (res.status === 200) {
                setUserIsOwner(true)
            } else {
                setUserIsOwner(false);
            }
        })
    }

    function onClick(text, mode, title, testCase) {
        setCurrentText(text);
        setModalTitle(title);
        setCurrentTestCase(testCase);
        setCurrentMode(mode);
        modalEdit.current.openModal();
    }

    function onClickAdd() {
        modalAdd.current.openModal();
    }

    function fetchTestCases() {
        fetch(URL + '/api/database/Problem/viewAllTestCasesByProblemName/' + problemName, {
            headers: { ...getAuthorization() }
        }).then(res => res.json())
            .then(data => {
                console.log(data);
                setTestCases(data);
            })
    }

    function persistChangesOnDatabase() {
        fetch(URL + '/api/database/TestCases/updateList', {
            method: 'POST',
            body: JSON.stringify(testCases),
            headers: new Headers({
                ...getAuthorization(),
                'Content-Type': 'application/json'
            })
        })
    }

    function onModalClose() {
        let newTestCases = testCases;
        let mode = currentMode;
        let newArray = null;
        switch (mode) {
            case 'input':
                newArray = newTestCases.map(t => {
                    if (t === currentTestCase) {
                        t.input = currentText;
                    }
                    return t;
                })
                break;
            case 'output':
                newArray = newTestCases.map(t => {
                    if (t === currentTestCase) {
                        t.output = currentText;
                    }
                    return t;
                })
                break;
            case 'description':
                newArray = newTestCases.map(t => {
                    if (t === currentTestCase) {
                        t.description = currentText;
                    }
                    return t;
                })
                break;
            default:
                newArray = testCases;
                break;
        }

        setTestCases(newArray);
        setCurrentMode('');
        persistChangesOnDatabase();
    }

    function onChange(e) {
        setCurrentText(e.target.value);
    }

    function onChangeNew(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    function deleteTestCase(index) {
        fetch(URL + '/api/database/TestCases/delete/' + index, {
            method: 'POST',
            headers: { ...getAuthorization() }
        }).then(() => {
            fetchTestCases();
        });
    }

    function onNewTestCaseModalClose() {
        if (currentMode !== 'bulk') {

            const data = {
                input: newInput.current.value.trim(),
                output: newOutput.current.value.trim(),
                description: newDescription.current.value.trim()
            }

            addTestCase(data);
        }

        setCurrentMode('');
    }

    function changeToBulk() {
        setCurrentMode('bulk')
    }

    function addTestCase(data) {
        fetch(URL + '/api/database/TestCases/addToProblem/' + problemName, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                ...getAuthorization(),
                'Content-Type': 'application/json'
            })
        }).then(() => {
            fetchTestCases();
        });
    }

    function toggleCheckBox(e, t) {

        console.log("OUTPUT ");

        let newTestCases = testCases.map((tc, i) => {
            if (tc === t) {
                console.log(tc.shown);
                tc.shown = !tc.shown;
            }
            return tc;
        });

        console.log("NEW TEST CASES")
        console.log(newTestCases);

        setTestCases(newTestCases);
        persistChangesOnDatabase();

    }

    function addTestCasesFromFiles(files) {
        console.log('Saving files from manage test cases');

        if (files.length > 0) {

            console.log('SORTING')
            files = files.sort((a, b) => { return a.name.toLowerCase().localeCompare(b.name.toLowerCase()) });
            console.log(files);
            for (let i = 0; i < files.length; i++) {
                let current = files[i];
                let next = (i + 1 >= files.length) ? files[i] : files[i + 1];

                let splitCurrent = current.name.split("_");
                let splitNext = next.name.split("_");


                let input = '';
                let output = '';

                // if same test case
                if (splitCurrent[0].trim() === splitNext[0].trim()) {
                    input = readFile(current).trim();
                    output = readFile(next).trim();
                    i++;

                } else {
                    if (splitCurrent[1].trim() === 'input.txt') {
                        input = readFile(current).trim();
                    } else if (splitCurrent[1].trim() === 'output.txt') {
                        output = readFile(current).trim();
                    }
                }

                console.log("Input " + input);
                console.log("Output" + output);
                console.log('\n');

                const data = {
                    input: input,
                    output: output,
                    description: ''
                }

                addTestCase(data);
            }

            modalAdd.current.closeModal();
            setCurrentMode('');
        }
    }

    if (!userIsOwner) {
        return (
            <PageNotFound />
        )
    }

    const PopupInformation = () => (
        <div className="tc-popup">
            <h2 style={{ color: 'black', margin: 'auto' }}>{modalTitle}</h2>
            <textarea autoFocus name="input" id="" style={{ border: '1px solid #6a44ff' }} className="modal-text-area"
                value={currentText}
                placeholder={currentMode === 'description' ? 'If you select to show this test case, this description will show on the Problem page on top of the input and the output' : ''}
                onChange={onChange}></textarea>
        </div>
    );

    const PopupAddTestCase = () => (

        currentMode === 'bulk' ?
            <LoadFiles addTestCasesFromFiles={addTestCasesFromFiles} />
            :
            <div className="tc-popup">
                <h2 style={{ color: 'black', margin: 'auto' }}>Add new </h2>
                <input type="button" id="add-in-bulk" className="btn" style={{ position: 'absolute', right: '25px', top: '25px' }} value="Add in bulk" onClick={changeToBulk} />
                <div className="row">
                    <div className="col-sm-6">
                        <p>Input</p>
                        <textarea ref={newInput} name="inputNew" id="" style={{ border: '1px solid #6a44ff' }} className="modal-text-area-section"
                        ></textarea>
                    </div>
                    <div className="col-sm-6">
                        <p>Output</p>
                        <textarea ref={newOutput} name="outputNew" id="" style={{ border: '1px solid #6a44ff' }} className="modal-text-area-section"
                        ></textarea>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <p>Description</p>
                        <textarea ref={newDescription} name="descriptionNew" id="" style={{ border: '1px solid #6a44ff', height: '100px', width: '100%' }} className="modal-text-area-section"
                            placeholder={currentMode === 'description' ? 'If you select to show this test case, this description will show on the Problem page on top of the input and the output' : ''}
                        ></textarea>
                    </div>
                </div>
            </div>
    );

    return (
        <div className="container" >
            <div className="row">
                <PathLink path={location.pathname} title="Test Cases" />
                <h3 className="page-subtitle">Make sure the test cases you insert cover the problem fully.</h3>
                <p className="page-subtitle">Add new test cases or edit the current ones. To edit, click on the respective button, edit the data and the changes will be saved when leaving the window.</p>

                <div className="col-sm-3 col-xs-12 test-case-wrapper tc add-test-case " onClick={onClickAdd}>
                    <div className='flex justify-center bg-cyan-200'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                {testCases.sort((a, b) => a.id - b.id).map((t, i) => (
                    <div className="col-sm-3 col-xs-12 test-case-wrapper tc">
                        <div >
                            <h3 style={{ display: 'inline-block' }}>Test Case {i + 1}</h3>
                            <i style={{ position: 'absolute', top: '20px', right: '15px' }} className="material-icons" onClick={() => deleteTestCase(t.id)}>delete</i>
                        </div>
                        <hr style={{ borderBottom: 'none', borderLeft: 'none', borderRight: 'none' }} />
                        <input className="btn btn-tc" type="button" value="Input" onClick={() => onClick(t.input, 'input', "Add input", t)} />
                        <input className="btn btn-tc" type="button" value="Output" onClick={() => onClick(t.output, 'output', "Add output", t)} />
                        <input className="btn btn-tc" type="button" value="Description" onClick={() => onClick(t.description, 'description', "Add description", t)} />
                        <label className="container inline-field">Show
                            <input type="checkbox" name="shown" checked={t.shown ? "checked" : ''} onClick={(e) => toggleCheckBox(e, t)} />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                ))}

                <Popup ref={modalAdd} onModalClose={onNewTestCaseModalClose} >
                    <PopupAddTestCase />
                </Popup>


                <Popup ref={modalEdit} onModalClose={onModalClose}>
                    <PopupInformation />
                </Popup>
            </div>
        </div>
    )
}

export default ManageTestCases