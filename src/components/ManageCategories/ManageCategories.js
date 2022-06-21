import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { URL } from '../commons/Constants';
import { getAuthorization, textToLowerCaseNoSpaces } from '../commons/Utils';
import PathLink from '../PathLink/PathLink';
import Popup from '../Popup/Popup';

function ManageCategories() {

    const [categories, setCategories] = useState([]);

    const location = useLocation();
    const modalAdd = useRef();
    const inputCategoryName = useRef();

    useEffect(() => {
        fetchCategories();
    }, [])

    function fetchCategories() {
        fetch(URL + '/api/database/PractiseCategory/view', {
            headers: { ...getAuthorization() }
        })
            .then(res => res.json())
            .then(data => {
                setCategories(data)
            })
    }

    function deleteCategory(pc) {
        fetch(URL + '/api/database/PractiseCategory/delete/' + pc.id, {
            method: 'POST',
            headers: { ...getAuthorization() }
        }).then(() => {
            fetchCategories();
        });
    }

    function onAddCategory() {
        const data = { name: inputCategoryName.current.value }
        fetch(URL + '/api/database/PractiseCategory/add', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
                ...getAuthorization()
            })
        }).then(res => res.json()).then(data => {
            let newCategories = categories;
            newCategories.push(data);
            setCategories(newCategories);

            modalAdd.current.closeModal();

        })
    }



    function PopupAddCategory() {
        return (<div className="">
            <h2 style={{ color: 'black', marginTop: '-5px', marginBottom: '5px' }}>Add category</h2>
            <div className="row">
                <input autofocus style={{ margin: '15px' }} name="categoryName" className="textbox" id="input-add-category"
                    ref={inputCategoryName} type="text" placeholder="Category name" />
                <input type="button" className="btn btn-codeflex" id="input-save-category" onClick={onAddCategory} value="Save" />
            </div>
        </div>);
    }

    return (
        <div className="container">
            <div className="row">
                <PathLink path={location.pathname} title="Manage Categories" />
                <h3 className="page-subtitle">Categories with at least one problem will be shown on 'Practise' section.</h3>

                <div className="col-sm-3 col-xs-12 test-case-wrapper tc add-test-case" style={{ marginBottom: '25pt' }}>
                    <i className="material-icons manage-tournament-icon" id="add-test-case" onClick={() => modalAdd.current.openModal()}>add_circle_outline</i>
                </div>

                {categories.map((c, i) => (
                    <div className="col-sm-3 col-xs-12 test-case-wrapper tc">
                        <div >
                            <h3 style={{ display: 'inline-block' }}>{c.name}</h3>
                            <i onClick={() => deleteCategory(c)} style={{ position: 'absolute', top: '20px', right: '15px', cursor: 'pointer' }} className="material-icons">delete</i>
                        </div>
                        <hr style={{ borderBottom: 'none', borderLeft: 'none', borderRight: 'none' }} />
                        {c.problem.map((p, i) => (
                            <div>
                                <Link to={"/manage/problems/" + textToLowerCaseNoSpaces(p.name) + "/edit"}>
                                    <p style={{ fontFamily: 'Roboto Condensed', fontSize: '10pt' }}>{p.name}</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                ))}

                <Popup ref={modalAdd} >
                    {PopupAddCategory()}
                </Popup>

            </div>
        </div>
    )
}

export default ManageCategories