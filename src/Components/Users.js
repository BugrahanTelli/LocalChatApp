import React, { useState } from 'react';

function Users({ onLogin }) {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const btnClicked = () => {
        if (username.trim() === '') {
            setError('Lütfen bir kullanıcı adı giriniz.');
        } else {
            setError('');
            localStorage.setItem('username', username);
            onLogin(username); 
        }
    };

    return (
        <div className='users'>
            <label className='userlabel' htmlFor='username'>Kullanıcı Adı: </label>
            <input
                type='text'
                id='username'
                className='username'
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                onKeyDown={(e) => e.key === 'Enter' && btnClicked()}
            />
            <button
                type='submit'
                className='okaybtn'
                onClick={btnClicked}
                disabled={username.trim() === ''}
            >
                OKAY
            </button>
            {error && <p className='error'>{error}</p>}
        </div>
    );
}

export default Users;
