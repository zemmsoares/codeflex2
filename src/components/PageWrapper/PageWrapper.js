import React from 'react';


const PageWrapper = Page => {
    return props =>
        <div className="page">

            <Page {...props} />

        </div>;
};

export default PageWrapper;