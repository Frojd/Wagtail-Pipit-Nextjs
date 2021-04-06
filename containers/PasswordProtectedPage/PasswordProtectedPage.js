import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getPasswordProtectedPage } from '../../api/wagtail';
import LazyContainers from '../LazyContainers';

const PasswordProtectedPage = ({ restrictionId, pageId, csrfToken }) => {
    const [values, setValues] = useState({ password: '' });
    const [error, setError] = useState(null);
    const [pageData, setPageData] = useState(null);

    const handleFormChange = async (e) => {
        e.preventDefault();

        try {
            const resp = await getPasswordProtectedPage(
                restrictionId,
                pageId,
                {
                    ...values,
                },
                {
                    headers: {
                        'X-CSRFToken': csrfToken,
                    },
                }
            );

            setPageData(resp);
        } catch (e) {
            setError('Invalid password');
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    if (pageData) {
        const { componentName, componentProps } = pageData;
        const Component = LazyContainers[componentName];
        if (!Component) {
            return <h1>Component {componentName} not found</h1>;
        }
        return <Component {...componentProps} />;
    }

    return (
        <div>
            <h1>Password is required</h1>
            <p>You need a password to access this website</p>

            {!!error && <p>{error}</p>}
            <p>
                <input
                    type="password"
                    name="password"
                    onChange={handlePasswordChange}
                    placeholder="Password"
                />
            </p>
            <button onClick={handleFormChange}>Continue</button>
        </div>
    );
};

PasswordProtectedPage.propTypes = {
    restrictionId: PropTypes.number.isRequired,
    pageId: PropTypes.number.isRequired,
    csrfToken: PropTypes.string.isRequired,
};

export default PasswordProtectedPage;
