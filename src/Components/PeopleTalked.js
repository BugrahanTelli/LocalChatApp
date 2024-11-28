import React from 'react';
import PropTypes from 'prop-types';

const PeopleTalked = React.memo(({ talkedPeople, currentUser  }) => {
    const filteredPeople = talkedPeople.filter(person => person !== currentUser );

    return (
        <div className="people">
            <div className="people-list">
                {filteredPeople.length > 0 ? (
                    filteredPeople.map((person, index) => (
                        <button className="person" key={index} style={{ cursor: 'pointer' }}>
                            {person}
                        </button>
                    ))
                ) : (
                    <p>No one is currently being messaged.</p>
                )}
            </div>
        </div>
    );
});

PeopleTalked.propTypes = {
    talkedPeople: PropTypes.arrayOf(PropTypes.string).isRequired,
    currentUser:  PropTypes.string.isRequired 
};

export default PeopleTalked;