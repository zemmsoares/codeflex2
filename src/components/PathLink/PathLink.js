import React from 'react'
import { Link } from 'react-router-dom';
import { splitUrl } from '../commons/Utils';

function PathLink(props) {

    function createPath(path, index) {
        path.map((p, i) => {
            if (i <= index) {
                return p + "/"
            }
        });
    }

    function buildPath(pathname, index) {
        let finalPath = '/';
        for (let i = 0; i <= index; i++) {
            finalPath += pathname[i];

            {/* CHECK CHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKVV
            if (props.removePath.includes[i]) {
                return "";
            }
            */}

            if (i < index) {
                finalPath += '/';
            }
        }
        console.log(finalPath)
        return finalPath;
    }


    let pathname = splitUrl(props.path);

    let titleCheck = props.title;
    if (typeof titleCheck !== 'undefined') {
        titleCheck.replace('-', ' ');
    }


    return (
        <div>
            <span>
                {pathname.map((p, index) => (
                    <div key={index} className='inline-flex'>
                        <Link key={index} to={{ pathname: buildPath(pathname, index) }}>
                            <p >
                                {p}
                            </p>
                        </Link>
                        {index < pathname.length - 0 ? <i className=" ">
                            <span className='px-2'>></span>
                        </i> : ''
                        }
                    </div >
                ))}
            </span>
        </div>
    )
}

export default PathLink